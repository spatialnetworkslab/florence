import {
  isColumnOriented, isRowOriented, isGeoJSON,
  checkFormatColumnDataframe, checkFormatTransformableDataContainer
} from './utils/checkFormat.js'

import getDataLength from './utils/getDataLength.js'
import convertRowToColumnDataframe from './utils/convertRowToColumnDataframe.js'
import calculateDomainsAndGetTypes from './utils/calculateDomainsAndGetTypes.js'
import parseGeoJSON from './utils/parseGeoJSON.js'

import TransformableDataContainer from './TransformableDataContainer.js'

export default class DataContainer {
  constructor (data, options) {
    this._data = {}

    this._domainsAndTypesCalculated = false
    this._lazy = true
    this._domains = {}
    this._length = undefined
    this._types = {}

    if (options) {
      this._applyOptions(options)
    }

    if (isColumnOriented(data)) {
      this._setColumnDataframe(data)
      return
    }

    if (isRowOriented(data)) {
      this._setRowDataframe(data)
      return
    }

    if (isGeoJSON(data)) {
      this._setGeoJSON(data)
      return
    }

    if (data instanceof TransformableDataContainer) {
      this._setTransformableDataContainer(data)
      return
    }

    throw invalidDataError
  }

  data () {
    return this._data
  }

  row (index) {
    let row = {}

    for (let columnName in this._data) {
      let value = this._data[columnName][index]
      row[columnName] = value
    }

    row.$index = index

    return row
  }

  rows () {
    let iterator = createIterator(this)
    return [...iterator]
  }

  hasColumn (columnName) {
    this._calculateDomainsAndTypesIfNecessary()
    return this._data.hasOwnProperty(columnName)
  }

  column (columnName) {
    this._calculateDomainsAndTypesIfNecessary()
    return this._data[columnName]
  }

  domain (columnName) {
    this._calculateDomainsAndTypesIfNecessary()
    return this._domains[columnName]
  }

  type (columnName) {
    this._calculateDomainsAndTypesIfNecessary()
    return this._types[columnName]
  }

  transform () {
    return new TransformableDataContainer(this._data)
  }

  _applyOptions (options) {
    validateOptions(options)
    if (options.hasOwnProperty('lazy')) {
      this._lazy = options.lazy
    }
  }

  _setColumnDataframe (data) {
    checkFormatColumnDataframe(data)
    this._storeData(data)
  }

  _setRowDataframe (rowData) {
    let columnData = convertRowToColumnDataframe(rowData)
    this._setColumnDataframe(columnData)
  }

  _setGeoJSON (geojsonData) {
    let data = parseGeoJSON(geojsonData)
    this._storeData(data)
  }

  _setTransformableDataContainer (transformableDataContainer) {
    checkFormatTransformableDataContainer(transformableDataContainer)
    this._storeData(transformableDataContainer._data)
  }

  _storeData (data) {
    this._data = data
    this._length = getDataLength(data)

    if (this._lazy === false) {
      this._calculateDomainsAndTypes()
    }
  }

  _calculateDomainsAndTypes () {
    let { domains, types } = calculateDomainsAndGetTypes(this._data)
    this._domains = domains
    this._types = types
  }

  _calculateDomainsAndTypesIfNecessary () {
    if (this._lazy === true && this._domainsAndTypesCalculated === false) {
      this._calculateDomainsAndTypes()
      this._domainsAndTypesCalculated = true
    }
  }
}

const invalidDataError = new Error('Data passed to DataContainer is of unknown format')

function createIterator (self) {
  return {
    [Symbol.iterator]: function () {
      let index = -1

      return {
        next: () => {
          index++
          return { value: self.row(index), done: index === self._length }
        }
      }
    }
  }
}

function validateOptions (options) {
  if (options.hasOwnProperty('lazy')) {
    if (options.lazy.constructor !== Boolean) throw new Error(`'lazy' must be Boolean`)
  }
}

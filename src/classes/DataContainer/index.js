import produce from 'immer'

import transformMethodExposeMixin from './TransformableDataContainer/methodExposeMixin.js'

import {
  isColumnOriented, isRowOriented, isGeoJSON,
  checkFormatColumnDataframe, checkFormatInternal
} from './utils/checkFormat.js'

import getDataLength from './utils/getDataLength.js'
import convertRowToColumnDataframe from './utils/convertRowToColumnDataframe.js'
import calculateDomainsAndGetTypes from './utils/calculateDomainsAndGetTypes.js'
import parseGeoJSON from './utils/parseGeoJSON.js'
import { checkColumnPath, columnPathIsValid, getColumn } from './utils/parseColumnPath.js'

import id from '../../utils/id.js'

import TransformableDataContainer from './TransformableDataContainer'
import { Group } from './TransformableDataContainer/transformations/groupBy.js'

export default class DataContainer {
  constructor (data, options) {
    this._data = {}

    this._domainsAndTypesCalculated = false
    this._lazy = true

    this._domains = {}
    this._types = {}

    this._length = undefined

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

    if (data instanceof Group) {
      this._setGroup(data)
      return
    }

    throw invalidDataError
  }

  data () {
    return this._data
  }

  row (index) {
    return this._row(index)
  }

  rows () {
    let rows = []

    for (let i = 0; i < this._length; i++) {
      rows.push(this._row(i))
    }

    return rows
  }

  hasColumn (columnPath) {
    return columnPathIsValid(columnPath, this)
  }

  column (columnPath) {
    checkColumnPath(columnPath, this)
    return getColumn(columnPath, this)
  }

  domain (columnName) {
    this._calculateDomainsAndTypesIfNecessary()
    return this._domains[columnName]
  }

  type (columnName) {
    this._calculateDomainsAndTypesIfNecessary()
    return this._types[columnName]
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
    let data = transformableDataContainer._data
    checkFormatInternal(data)
    this._storeData(data)
  }

  _setGroup (group) {
    let data = group.data
    checkFormatInternal(data)
    this._storeData(data)
  }

  _storeData (data) {
    this._data = data
    this._length = getDataLength(data)

    this._createIndexColumn()

    if (this._lazy === false) {
      this._calculateDomainsAndTypes()
    }
  }

  _createIndexColumn () {
    if (!this._data.hasOwnProperty('$index')) {
      let length = this._length

      let indexColumn = new Array(length).fill(0).map(_ => id())
      this._data = produce(this._data, draft => {
        draft.$index = indexColumn
      })
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

  _row (index) {
    let row = {}

    for (let columnName in this._data) {
      let value = this._data[columnName][index]
      row[columnName] = value
    }

    return row
  }
}

transformMethodExposeMixin(DataContainer)

const invalidDataError = new Error('Data passed to DataContainer is of unknown format')
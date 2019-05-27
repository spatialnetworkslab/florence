import dataLoadingMixin from './dataLoadingMixin.js'
import domainsAndTypesMixin from './domainsAndTypesMixin.js'
import transformationsMixin from './transformationsMixin.js'

import { isColumnOriented, isRowOriented, isGeoJSON } from './utils/checkFormat.js'

import TransformableDataContainer from './TransformableDataContainer'
import { Group } from './TransformableDataContainer/transformations/groupBy.js'

import { warn } from '../../utils/logging.js'

import {
  checkColumnPath, columnPathIsValid, checkIfColumnExists,
  getColumn, mapColumn
} from './utils/parseColumnPath.js'

export default class DataContainer {
  constructor (data) {
    this._data = {}
    this._length = undefined
    this._indexToRowNumber = {}

    this._domainsAndTypesCalculated = false

    this._domains = {}
    this._types = {}

    if (isColumnOriented(data)) {
      this._setColumnData(data)
      return
    }

    if (isRowOriented(data)) {
      this._setRowData(data)
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
    let rowNumber = this._indexToRowNumber[index]
    return this._row(rowNumber)
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

  map (columnPath, mapFunction) {
    checkColumnPath(columnPath, this)
    return mapColumn(columnPath, this, mapFunction)
  }

  updateRow (index, row) {
    let rowNumber = this._indexToRowNumber[index]

    for (let key in row) {
      checkIfColumnExists(key, this)

      if (key === '$index') {
        warn(`Cannot update '$index' of row`)
        continue
      }

      let value = row[key]
      this._data[key][rowNumber] = value
    }
  }

  _row (rowNumber) {
    let row = {}

    for (let columnName in this._data) {
      let value = this._data[columnName][rowNumber]
      row[columnName] = value
    }

    return row
  }
}

dataLoadingMixin(DataContainer)
domainsAndTypesMixin(DataContainer)
transformationsMixin(DataContainer)

const invalidDataError = new Error('Data passed to DataContainer is of unknown format')

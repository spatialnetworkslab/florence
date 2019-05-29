
import produce from 'immer'

import { checkFormatColumnData, checkFormatInternal } from './utils/checkFormat.js'

import getDataLength from './utils/getDataLength.js'
import convertRowToColumnData from './utils/convertRowToColumnData.js'
import parseGeoJSON from './utils/parseGeoJSON.js'

import id from '../../utils/id.js'

const methods = {
  _setColumnData (data) {
    checkFormatColumnData(data)
    this._storeData(data)
  },

  _setRowData (rowData) {
    let columnData = convertRowToColumnData(rowData)
    this._setColumnData(columnData)
  },

  _setGeoJSON (geojsonData) {
    let data = parseGeoJSON(geojsonData)
    this._storeData(data)
  },

  _setTransformableDataContainer (transformableDataContainer) {
    let data = transformableDataContainer._data
    checkFormatInternal(data)
    this._storeData(data)
  },

  _setGroup (group) {
    let data = group.data
    checkFormatInternal(data)
    this._storeData(data)
  },

  _storeData (data) {
    this._data = data
    this._length = getDataLength(data)

    this._createIndexColumn()
    this._calculateDomainsAndTypes()
  },

  _createIndexColumn () {
    if (!this._data.hasOwnProperty('$index')) {
      let indexColumn = new Array(this._length).fill(0).map(_ => id())

      this._data = produce(this._data, draft => {
        draft.$index = indexColumn
      })
    }

    for (let i = 0; i < this._length; i++) {
      let index = this._data.$index[i]
      this._indexToRowNumber[index] = i
    }
  }
}

export default function (targetClass) {
  Object.assign(targetClass.prototype, methods)
}

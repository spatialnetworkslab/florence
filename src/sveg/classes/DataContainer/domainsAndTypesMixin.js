import calculateDomainsAndGetTypes from './utils/calculateDomainsAndGetTypes.js'
import { checkIfColumnExists } from './utils/parseColumnPath.js'

const methods = {
  domain (columnName) {
    checkIfColumnExists(columnName, this)
    return this._domains[columnName]
  },

  type (columnName) {
    checkIfColumnExists(columnName, this)
    return this._types[columnName]
  },

  _calculateDomainsAndTypes () {
    let { domains, types } = calculateDomainsAndGetTypes(this._data)
    this._domains = domains
    this._types = types
  }
}

export default function (targetClass) {
  Object.assign(targetClass.prototype, methods)
}

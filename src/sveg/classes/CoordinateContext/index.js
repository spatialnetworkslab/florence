export default class CoordinateContext {
  constructor ({ rangeX, rangeY, scaleX, scaleY }) {
    this._rangeX = undefined
    this._rangeY = undefined
    this._scaleX = undefined
    this._scaleY = undefined

    this._handleRanges(rangeX, rangeY)
    this._handleScales(scaleX, scaleY)
  }

  x () {
    return this._rangeX[0]
  }

  w () {
    return this._rangeX[1] - this._rangeX[0]
  }

  y () {
    return this._rangeY[0]
  }

  h () {
    return this._rangeY[1] - this._rangeY[0]
  }

  scales () {
    let scaleX = this._scaleX
    let scaleY = this._scaleY
    return { scaleX, scaleY }
  }

  _handleRanges (rangeX, rangeY) {
    this._rangeX = rangeX
    this._rangeY = rangeY
  }

  _handleScales (scaleX, scaleY) {
    if (scaleX) {
      this._scaleX = scaleX.copy().range(this._rangeX)
    }

    if (!scaleX) {
      this._scaleX = x => x
    }

    if (scaleY) {
      this._scaleY = scaleY.copy().range(this._rangeY)
    }

    if (!scaleY) {
      this._scaleY = y => y
    }
  }
}

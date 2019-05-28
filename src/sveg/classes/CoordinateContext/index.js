export default class CoordinateContext {
  constructor ({ rangeX, rangeY, scaleX, scaleY }) {
    this._rangeX = undefined
    this._rangeY = undefined
    this._scaleX = undefined
    this._scaleY = undefined

    this._handleRanges(rangeX, rangeY)
    this._handleScales(scaleX, scaleY)
  }

  _handleRanges (rangeX, rangeY) {
    validateRange(rangeX)
    this._rangeX = rangeX
    
    validateRange(rangeY)
    this._rangeY = rangeY
  }

  _handleScales (scaleX, scaleY) {
    if (scaleX) {
      // TODO
    }

    if (!scaleX) {
      this._scaleX = x => x
    }

    if (scaleY) {
      // TODO
    }

    if (!scaleY) {
      this._scaleY = y => y
    }
  }
}

function validateRange (range) {
  // TODO
}
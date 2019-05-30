import { createPolarTransformation } from './polar.js'

export default class TransformationContext {
  constructor ({ rangeX, rangeY, transformation }) {
    if (transformation.constructor === Function) {
      this._transformation = transformation(rangeX, rangeY)
      this._type = 'custom'
    }

    if (transformation.constructor === String) {
      this._type = transformation

      switch (transformation) {
        case 'cartesian':
          this._transformation = c => c
          break

        case 'polar':
          this._transformation = createPolarTransformation(rangeX, rangeY)
          break
        
        default:
          throw new Error(`Invalid transformation name: '${transformation}'`)
      }
    }
  }

  transform (coordinatePair) {
    return this._transformation(coordinatePair)
  }

  type () {
    return this._type
  }
}

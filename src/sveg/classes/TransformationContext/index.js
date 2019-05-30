import { createPolarTransformation } from './polar.js'

export default class TransformationContext {
  constructor ({ rangeX, rangeY, transformation }) {
    if (transformation.constructor === Function) {
      this._transformation = transformation(rangeX, rangeY)
    }

    if (transformation.constructor === String) {
      switch (transformation) {
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
}
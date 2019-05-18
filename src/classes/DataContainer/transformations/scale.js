import DataContainer from '../../classes/Data/DataContainer.js'
import createScale from '../../scales/createScale.js'
import getPropType from '../../scales/utils/getPropType.js'
const slashRegex = /\//g

export default function (data, instructions, scaleManager) {
  if (instructions.constructor !== Object) {
    throw new Error(`'scale' instructions must be object`)
  }

  for (let newColName in instructions) {
    if (!instructions[newColName].hasOwnProperty('column')) {
      throw new Error(`Missing required option 'column'`)
    }

    if (!instructions[newColName].hasOwnProperty('prop')) {
      throw new Error(`Missing required option 'prop'`)
    }

    if (!instructions[newColName].hasOwnProperty('scale')) {
      throw new Error(`Missing required 'scale' definition object`)
    }

    let oldColName = instructions[newColName].column
    let prop = instructions[newColName].prop
    let scalingOptions = instructions[newColName].scale

    if (scalingOptions.constructor !== Object) {
      throw new Error(`'scale' must be an Object`)
    }

    let propType = getPropType(prop)

    if (propType === 'coord' && !scalingOptions.range) {
      throw new Error(`'range' option required when using 'scale' transformation with a coordinate prop`)
    }

    if (instructions[newColName].column.match(slashRegex)) {
      throw new Error(`Cannot access different data scopes in 'scale' transformation`)
    }

    if (scalingOptions.domain.constructor === String && scalingOptions.domain.match(slashRegex)) {
      throw new Error(`Cannot access different data scopes in 'scale' transformation`)
    }

    let range = scalingOptions.range
    let fakeDataInterface = new DataContainer(data)
    fakeDataInterface.ready = () => true

    let fakeContext = {
      ranges: { x: range, y: range },
      dataInterface: fakeDataInterface,
      scaleManager
    }

    let scale = createScale(prop, fakeContext, scalingOptions)

    let oldCol = data[oldColName]
    if (!data.hasOwnProperty(oldColName)) {
      throw new Error(`Invalid column: '${oldColName}'`)
    }

    let newCol = oldCol.map(scale)

    data[newColName] = newCol
  }

  return data
}

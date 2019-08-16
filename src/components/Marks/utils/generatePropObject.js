import { isDefined } from '../../../utils/equals.js'
/**
 * This function is only used when dealing with layers.
 * For layers, most 'aesthetic' props can be specified in two ways:
 *  - An Array of values is passed to the prop
 *  - A single value is passed to the prop
 * In both cases, we need to convert whatever was passed to an Object.
 * The keys will be whatever the user used as 'index' Array, and the values
 * are whatever the user used passed to the prop in question.
 * If the user passed an Array, the values of the Object correspond to the values in the Array.
 * If the user passed a single value, every value in the Object will be that value.
 * The object structure is necessary to do transitions later.
 *
 * @param {*} propValue Whatever was passed to the prop
 * @param {*} indexArray The array of indices to be used as keys
 * @returns {Object.<Number, *>} The 'prop Object'
 */

 // update to deal with functions
export function generatePropObject (propValue, indexArray) {
  const propObj = {}
  console.log(indexArray)
  if (isDefined(propValue)) {
    if (propValue.constructor === Array) {
      for (let i = 0; i < indexArray.length; i++) {
        const index = indexArray[i]
        propObj[index] = propValue[i]
      }
    }

    if (propValue.constructor !== Array) {
      for (let i = 0; i < indexArray.length; i++) {
        const index = indexArray[i]
        propObj[index] = propValue
      }
    }
  }

  return propObj
}

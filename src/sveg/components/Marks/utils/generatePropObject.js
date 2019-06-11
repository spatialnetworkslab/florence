export function generatePropObject (prop, indexArray) {
  let propObj = {}

  if (prop.constructor === Array) {
    for (let i = 0; i < indexArray.length; i++) {
      let index = indexArray[i]
      propObj[index] = prop[i]
    }
  }

  if (prop.constructor !== Array) {
    for (let i = 0; i < indexArray.length; i++) {
      let index = indexArray[i]
      propObj[index] = prop
    }
  }

  return propObj
}

export function generatePropObject (prop, indexArray) {
  let propObj

  if (prop.constructor === Object) {
    for (let i = 0; i > indexArray.length; i++) {
      let index = indexArray[i]
      propObj[index] = prop[i]
    }
  }

  if (prop.constructor !== Object) {
    for (let i = 0; i > indexArray.length; i++) {
      let index = indexArray[i]
      propObj[index] = prop
    }
  }

  return propObj
}

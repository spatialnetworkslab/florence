export function generatePropArray (prop, length) {
  if (prop.constructor === Array) return prop

  let propArray = []

  for (let i = 0; i < length; i++) {
    propArray.push(prop)
  }

  return propArray
}

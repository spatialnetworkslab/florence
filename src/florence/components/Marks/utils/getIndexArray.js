export default function (indexProp, length) {
  if (indexProp) {
    if (indexProp.constructor !== Array) throw new Error('index must be Array')
    if (indexProp.length !== length) throw new Error('index must be of same length as coordinates')

    return indexProp
  } else {
    return new Array(length).fill(0).map((_, i) => i)
  }
}

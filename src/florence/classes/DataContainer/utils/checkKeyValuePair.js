export default function (obj, allowedKeys) {
  let keys = Object.keys(obj)
  if (keys.length !== 1) {
    throw new Error('Invalid transformation syntax')
  }

  let key = keys[0]

  if (!allowedKeys.includes(key)) {
    throw new Error(`Unknown transformation ${key}`)
  }

  return key
}

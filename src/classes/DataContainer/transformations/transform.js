export default function (data, transformFunction) {
  if (transformFunction.constructor !== Function) {
    throw new Error(`Invalid 'transform' transformation: must be a Function`)
  }

  return transformFunction(data)
}

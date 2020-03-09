export function createIdentityTransformation () {
  const transformation = c => c
  transformation.invert = c => c

  return transformation
}

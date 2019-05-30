export function interpolate (points, coordinateContext, transformationContext) {
  if (interpolationNecessary(transformationContext)) {
    for (let i = 0; i < points.length - 1; i++) {
      let j = i + 1

      let from = points[i]
      let to = points[j]
    }
  } 
  
  return points
}

export function interpolationNecessary (transformationContext) {
  return transformationContext && transformationContext.type() !== 'cartesian'
}
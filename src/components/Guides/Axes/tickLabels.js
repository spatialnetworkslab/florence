export function getTickLabelCoordinatesXAxis (
  tickCoordinates,
  { finalScaleY },
  labelOffset,
  flip
) {
  const x = tickCoordinates.x().map(x => x[0])

  const y = tickCoordinates.y().map(y => {
    const yEnd = y[1]
    const yEndAbsolute = finalScaleY(yEnd)

    const yLabelAbsolute = flip
      ? yEndAbsolute - labelOffset
      : yEndAbsolute + labelOffset

    return finalScaleY.invert(yLabelAbsolute)
  })

  return {
    x: () => x,
    y: () => y
  }
}

export function getTickLabelCoordinatesYAxis (
  tickCoordinates,
  { finalScaleX },
  labelOffset,
  flip
) {
  const x = tickCoordinates.y().map(x => {
    const xEnd = x[1]
    const xEndAbsolute = finalScaleX(xEnd)

    const xLabelAbsolute = flip
      ? xEndAbsolute - labelOffset
      : xEndAbsolute + labelOffset

    return finalScaleX.invert(xLabelAbsolute)
  })

  const y = tickCoordinates.y().map(y => y[0])

  return {
    x: () => x,
    y: () => y
  }
}

export function getTickLabelCoordinatesXAxis (
  tickCoordinates,
  { indirectScales },
  labelOffset,
  flip
) {
  const x = tickCoordinates.x().map(x => x[0])

  const y = tickCoordinates.y().map(y => {
    const yEnd = y[1]
    const yEndAbsolute = indirectScales.y(yEnd)

    const yLabelAbsolute = flip
      ? yEndAbsolute - labelOffset
      : yEndAbsolute + labelOffset

    return indirectScales.y.invert(yLabelAbsolute)
  })

  return {
    x: () => x,
    y: () => y
  }
}

export function getTickLabelCoordinatesYAxis (
  tickCoordinates,
  { indirectScales },
  labelOffset,
  flip
) {
  const x = tickCoordinates.x().map(x => {
    const xEnd = x[1]
    const xEndAbsolute = indirectScales.x(xEnd)

    const xLabelAbsolute = flip
      ? xEndAbsolute + labelOffset
      : xEndAbsolute - labelOffset

    return indirectScales.x.invert(xLabelAbsolute)
  })

  const y = tickCoordinates.y().map(y => y[0])

  return {
    x: () => x,
    y: () => y
  }
}

// from https://stackoverflow.com/a/21015393
export function getTextWidth (text, fontSize, fontFamily) {
  let canvas
  if (typeof document === 'undefined') {
    // if we don't have document/canvas available
    // assume ratio width to height is 0.8
    const length = text.length
    return length * 0.8 * fontSize
  } else {
    // re-use canvas object for better performance
    canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
    const context = canvas.getContext('2d')
    context.font = fontSize + ' ' + fontFamily
    const metrics = context.measureText(text)
    return metrics.width
  }
}

export function getTickLabelCoordinatesXAxis (
  tickCoordinates,
  labelOffset,
  flip
) {
  const dl = flip ? -labelOffset : labelOffset

  return {
    x: s => tickCoordinates.x(s).map(x => x[0]),
    y: s => tickCoordinates.y(s).map(y => y[1] + s.py(dl))
  }
}

export function getTickLabelCoordinatesYAxis (
  tickCoordinates,
  labelOffset,
  flip
) {
  const dl = flip ? labelOffset : -labelOffset

  return {
    x: s => tickCoordinates.x(s).map(x => x[1] + s.px(dl)),
    y: s => tickCoordinates.y(s).map(y => y[0])
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

export default function createPanHandler (zoomId, options) {
  const handler = function (event) {
    const extentX = options.extentX
    const extentY = options.extentY

    // stops panning if past extents X and Y
    const tempX = zoomId.x - event.delta.x
    const tempY = zoomId.y - event.delta.y

    if (tempX <= extentX[1] && tempX >= extentX[0]) {
      zoomId.x = zoomId.x - event.delta.x
    }

    if (tempY <= extentY[1] && tempY >= extentY[0]) {
      zoomId.y -= event.delta.y
    }

    return zoomId
  }

  // Resets zoomId to original zoomId (x, y, k)
  const reset = function () {
    zoomId.x = 0
    zoomId.y = 0
    return zoomId
  }

  handler.reset = reset

  return handler
}

export default function createZoomHandler (zoomId, minZoom, maxZoom, extents, step, centerPt) {
  const handler = function (event) {
    const extentX = extents.extentX
    const extentY = extents.extentY

    // Calculate new zoom factor based on step
    const delta = event.wheelDelta * step
    const tempK = zoomId.k - delta

    // Offsetting only takes effect when k is within range to prevent jitter
    if (tempK >= minZoom && tempK <= maxZoom) {
      zoomId.k -= delta

      // stops zooming if past extents X and Y
      const offsetX = -(event.coordinates.x * delta)
      const offsetY = -(event.coordinates.y * delta)

      const tempX = zoomId.x - offsetX
      const tempY = zoomId.y - offsetY

      // Make sure the viewport stays on the cursor area when zooming in/out
      if ((tempX <= extentX[1] && tempX >= extentX[0]) && (tempY <= extentY[1] && tempY >= extentY[0])) {
        zoomId.x -= offsetX
        zoomId.y -= offsetY
      } else {
        zoomId.x += offsetX
        zoomId.y += offsetY
      }
    }

    return zoomId
  }

  // Resets zoomId to origin { x: 0, y: 0, k: 1 }
  const reset = function () {
    zoomId.x = 0
    zoomId.y = 0
    zoomId.k = 1
    return zoomId
  }

  // Brings viewport back to specified center point
  const center = function () {
    zoomId.x = centerPt.x
    zoomId.y = centerPt.y
    return zoomId
  }

  handler.center = center
  handler.reset = reset

  return handler
}

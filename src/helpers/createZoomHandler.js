// export default function createZoomHandler (zoomId, minZoom, maxZoom, extents, step, centerPt) {
export default function createZoomHandler (
  zoomId, { minZoom, maxZoom, extentX, extentY, step, center: centerPt, dimension = 'both' }
) {
  const handler = function (event) {
    // Calculate new zoom factor based on step
    const delta = event.delta * step
    const tempK = zoomId.kx - delta

    // Offsetting only takes effect when k is within range to prevent jitter
    if (tempK >= minZoom && tempK <= maxZoom) {
      if (dimension === 'both') {
        zoomId.kx -= delta
        zoomId.ky -= delta
      }

      if (dimension === 'x') {
        zoomId.kx -= delta
        zoomId.ky = 1
      }

      if (dimension === 'y') {
        zoomId.kx = 1
        zoomId.ky -= delta
      }

      // stops zooming if past extents X and Y
      const offsetX = -(event.coordinates.x * delta)
      const offsetY = -(event.coordinates.y * delta)

      const tempX = zoomId.x - offsetX
      const tempY = zoomId.y - offsetY

      // Make sure the viewport stays on the cursor area when zooming in/out
      if ((tempX <= extentX[1] && tempX >= extentX[0]) && (tempY <= extentY[1] && tempY >= extentY[0])) {
        zoomId.x -= dimension !== 'y' ? offsetX : 0
        zoomId.y -= dimension !== 'x' ? offsetY : 0
      } else {
        zoomId.x += dimension !== 'y' ? offsetX : 0
        zoomId.y += dimension !== 'x' ? offsetY : 0
      }
    } 

    return zoomId
  }

  const reset = function () {
    zoomId.x = 0
    zoomId.y = 0
    zoomId.kx = 1
    zoomId.ky = 1

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

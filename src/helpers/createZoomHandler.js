// export default function createZoomHandler (zoomId, minZoom, maxZoom, extents, step, centerPt) {
export default function createZoomHandler (
  zoomIdentity,
  {
    setZoomIdentity = () => {},
    minZoom, maxZoom,
    extentX, extentY,
    step, center: centerPt,
    dimension = 'both'
  }
) {
  const zoom = function (event) {
    // Calculate new zoom factor based on step
    const delta = event.wheelDelta * step
    const tempK = zoomIdentity.kx - delta

    // Offsetting only takes effect when k is within range to prevent jitter
    if (tempK >= minZoom && tempK <= maxZoom) {
      if (dimension === 'both') {
        zoomIdentity.kx -= delta
        zoomIdentity.ky -= delta
      }

      if (dimension === 'x') {
        zoomIdentity.kx -= delta
        zoomIdentity.ky = 1
      }

      if (dimension === 'y') {
        zoomIdentity.kx = 1
        zoomIdentity.ky -= delta
      }

      // stops zooming if past extents X and Y
      const offsetX = -(event.screenCoordinates.x * delta)
      const offsetY = -(event.screenCoordinates.y * delta)

      const tempX = zoomIdentity.x - offsetX
      const tempY = zoomIdentity.y - offsetY

      // Make sure the viewport stays on the cursor area when zooming in/out
      if ((tempX <= extentX[1] && tempX >= extentX[0]) && (tempY <= extentY[1] && tempY >= extentY[0])) {
        zoomIdentity.x -= dimension !== 'y' ? offsetX : 0
        zoomIdentity.y -= dimension !== 'x' ? offsetY : 0
      } else {
        zoomIdentity.x += dimension !== 'y' ? offsetX : 0
        zoomIdentity.y += dimension !== 'x' ? offsetY : 0
      }
    }

    setZoomIdentity(zoomIdentity)
  }

  const reset = function () {
    zoomIdentity.x = 0
    zoomIdentity.y = 0
    zoomIdentity.kx = 1
    zoomIdentity.ky = 1

    setZoomIdentity(zoomIdentity)
  }

  // Brings viewport back to specified center point
  const center = function () {
    zoomIdentity.x = centerPt.x
    zoomIdentity.y = centerPt.y

    setZoomIdentity(zoomIdentity)
  }

  return {
    handlers: {
      onWheel: zoom
    },

    reset,
    center
  }
}

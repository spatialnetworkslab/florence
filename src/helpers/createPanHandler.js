export default function createPanHandler (
  zoomIdentity, setZoomIdentity, setBlockReindexing, options
) {
  const dimension = options.dimension || 'both'

  let panning = false
  let previousCoordinates

  const handler = function (event) {
    if (!panning) return

    const currentCoordinates = event.screenCoordinates
    const delta = calculateDelta(previousCoordinates, currentCoordinates)
    previousCoordinates = currentCoordinates

    const extentX = options.extentX
    const extentY = options.extentY

    // stops panning if past extents X and Y
    const tempX = zoomIdentity.x - delta.x
    const tempY = zoomIdentity.y - delta.y

    if (tempX <= extentX[1] && tempX >= extentX[0]) {
      zoomIdentity.x -= delta.x
    }

    if (tempY <= extentY[1] && tempY >= extentY[0]) {
      zoomIdentity.y -= delta.y
    }

    if (dimension === 'x') zoomIdentity.y = 0
    if (dimension === 'y') zoomIdentity.x = 0

    setZoomIdentity(zoomIdentity)
  }

  const start = function (event) {
    setBlockReindexing(true)
    panning = true
    previousCoordinates = event.screenCoordinates
  }

  const end = function (event) {
    setBlockReindexing(false)
    panning = false
  }

  // Resets zoomId to original zoomId (x, y, k)
  const reset = function () {
    zoomIdentity.x = 0
    zoomIdentity.y = 0

    setZoomIdentity(zoomIdentity)
  }

  handler.start = start
  handler.end = end
  handler.reset = reset
  handler.apply = {
    onMousedown: start,
    onMousemove: handler,
    onMouseup: end
  }

  return handler
}

function calculateDelta (previousCoordinates, currentCoordinates) {
  return {
    x: previousCoordinates.x - currentCoordinates.x,
    y: previousCoordinates.y - currentCoordinates.y
  }
}

export default function createPanHandler (zoomIdentity, extents, centerPt = {x: 0, y: 0}) {
  const handler = function (id, event) {
    let extentX
    let extentY
    const oZoomIdentity = { x: zoomIdentity.x, y: zoomIdentity.y, k: zoomIdentity.k }

    if (extents.x && extents.y) {
      extentX = extents.x
      extentY = extents.y
    }

    // stops panning if past extents X and Y
    const tempX = zoomIdentity.x - event.delta.x
    const tempY = zoomIdentity.y - event.delta.y

    if (tempX <= extentX[1] && tempX >= extentX[0]) {
      zoomIdentity.x -= event.delta.x
    }

    if (tempY <= extentY[1] && tempY >= extentY[0]) {
      zoomIdentity.Y -= event.delta.y
    }
  }

  // Brings viewport back to specified centerPt
  const center = function () {
    zoomIdentity.x = centerPt.x
    zoomIdentity.y = centerPt.y
  }

  // Resets zoomIdentity to original zoomIdentity (oZoomIdentity)
  const reset = function () {
    { x, y, k } = oZoomIdentity
    zoomIdentity = { x, y, k }
  }

  handler.center = center
  handler.reset = reset

  return handler
}

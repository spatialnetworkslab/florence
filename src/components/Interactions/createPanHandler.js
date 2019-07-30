export default function createPanHandler (zoomId, extents, centerPt = { x: 0, y: 0 }) {
  const handler = function (id, event) {
    let x = zoomId.x
    let y = zoomId.y
    const k = zoomId.k
    const extentX = extents.extentX
    const extentY = extents.extentY

    // stops panning if past extents X and Y
    const tempX = x - event.delta.x
    const tempY = y - event.delta.y

    if (tempX <= extentX[1] && tempX >= extentX[0]) {
      x -= event.delta.x
    }

    if (tempY <= extentY[1] && tempY >= extentY[0]) {
      y -= event.delta.y
    }

    let zoomIdentity = { x, y, k }
    console.log(zoomIdentity, this._interactionManager)
    return zoomIdentity
  }

  // Brings viewport back to specified centerPt
  // TODO test this (missing k)
  const center = function () {
    zoomId.x = centerPt.x
    zoomId.y = centerPt.y
    return zoomId
  }

  // Resets zoomIdentity to original zoomIdentity (oZoomIdentity)
  const reset = function (x, y, k) {
    zoomId = { x, y, k }
    return zoomId
  }

  return handler
}

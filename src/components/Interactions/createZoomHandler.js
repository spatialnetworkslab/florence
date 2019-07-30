export default function createZoomHandler (zoomId, minZoom, maxZoom, step) {
  const handler = function (id, event) {
    let x = zoomId.x
    let y = zoomId.y
    let k = zoomId.k

    // stops zooming if past extents X and Y
    const tempK = k - event.wheelDelta * step

    if (tempK >= minZoom && tempK <= maxZoom) {
      k -= event.wheelDelta * step
    }

    const offsetX = -(event.coordinates.x * event.wheelDelta)
    const offsetY = -(event.coordinates.y * event.WheelDelta)

    x += offsetX
    y += offsetY

    const zoomIdentity = { x, y, k }
    return zoomIdentity
  }

  // Resets zoomIdentity to original zoomIdentity (oZoomIdentity)
  const reset = function (oZoomIdentity = zoomId) {
    return oZoomIdentity
  }

  handler.reset = reset

  return handler
}

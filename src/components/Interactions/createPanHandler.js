export default function createPanHandler (zoomId, extents, centerPt) {
  const handler = function (id, event) {
    // let x = zoomId.x
    // let y = zoomId.y
    // let k = zoomId.k
    const extentX = extents.extentX
    const extentY = extents.extentY
    console.log(event)
    // stops panning if past extents X and Y
    let tempX = zoomId.x - event.delta.x
    let tempY = zoomId.y - event.delta.y

    if (tempX <= extentX[1] && tempX >= extentX[0]) {
      console.log('###', zoomId.x - event.delta.x)
      zoomId.x -= event.delta.x
    }

    if (tempY <= extentY[1] && tempY >= extentY[0]) {
      zoomId.y -= event.delta.y
    }
    console.log(zoomId)
    //let zoomIdentity = zoomId

    // what are we supposed to do here to manipulate zoomIdentity in the svelte component?
    //console.log(zoomIdentity, this._interactionManager)
    //return zoomIdentity
  }

  // Brings viewport back to specified center point
  const center = function () {
    zoomId.x = centerPt.x
    zoomId.y = centerPt.y
    return zoomId
  }

  // Resets zoomIdentity to original zoomIdentity (oZoomIdentity)
  const reset = function () {
    return zoomId
  }

  handler.center = center
  handler.reset = reset

  return handler
}

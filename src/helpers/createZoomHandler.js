export default function createZoomHandler (
  zoomIdentity,
  {
    setZoomIdentity = () => {},
    minZoom, maxZoom,
    extentX, extentY,
    step = 1,
    center: centerPt,
    dimension = 'both'
  }
) {
  const zoom = function (event) {
    const zoomPoint = getZoompoint(event)
    const zoomFactor = event.delta * step

    const previousScaleX = zoomIdentity.kx
    const previousScaleY = zoomIdentity.ky

    const newScaleX = previousScaleX - zoomFactor
    const newScaleY = previousScaleY - zoomFactor

    const newZoomScale = Math.max(newScaleX, newScaleY)

    if (minZoom <= newZoomScale && newZoomScale <= maxZoom) {
      if (dimension === 'both' || dimension === 'x') {
        const offset = getOffset(previousScaleX, newScaleX, zoomPoint.x, zoomIdentity.x)

        zoomIdentity.kx = newScaleX
        zoomIdentity.x = offset
      }

      if (dimension === 'both' || dimension === 'y') {
        const offset = getOffset(previousScaleY, newScaleY, zoomPoint.y, zoomIdentity.y)

        zoomIdentity.ky = newScaleY
        zoomIdentity.y = offset
      }

      setZoomIdentity(zoomIdentity)
    }
  }

  // const zoom = function (event) {
  //   const zoomPoint = getZoompoint(event)

  //   // Calculate new zoom factor based on step
  //   const delta = event.delta * step
  //   const tempK = zoomIdentity.kx - delta

  //   // Offsetting only takes effect when k is within range to prevent jitter
  //   if (tempK >= minZoom && tempK <= maxZoom) {
  //     if (dimension === 'both') {
  //       zoomIdentity.kx -= delta
  //       zoomIdentity.ky -= delta
  //     }

  //     if (dimension === 'x') {
  //       zoomIdentity.kx -= delta
  //       zoomIdentity.ky = 1
  //     }

  //     if (dimension === 'y') {
  //       zoomIdentity.kx = 1
  //       zoomIdentity.ky -= delta
  //     }

  //     // stops zooming if past extents X and Y
  //     const offsetX = -(zoomPoint.x * delta)
  //     const offsetY = -(zoomPoint.y * delta)

  //     const tempX = zoomIdentity.x - offsetX
  //     const tempY = zoomIdentity.y - offsetY

  //     // Make sure the viewport stays on the cursor area when zooming in/out
  //     if ((tempX <= extentX[1] && tempX >= extentX[0]) && (tempY <= extentY[1] && tempY >= extentY[0])) {
  //       zoomIdentity.x -= dimension !== 'y' ? offsetX : 0
  //       zoomIdentity.y -= dimension !== 'x' ? offsetY : 0
  //     } else {
  //       zoomIdentity.x += dimension !== 'y' ? offsetX : 0
  //       zoomIdentity.y += dimension !== 'x' ? offsetY : 0
  //     }
  //   }

  //   setZoomIdentity(zoomIdentity)
  // }

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
      onWheel: zoom,
      onPinch: zoom
    },

    reset,
    center
  }
}

function getZoompoint (event) {
  if (event.type === 'wheel') return event.screenCoordinates
  if (event.type === 'pinch') return event.screenCenter
}

function getOffset (previousK, newK, zoomPoint, previousOffset) {
  const unTransformedZoompoint = (zoomPoint - previousOffset) / previousK
  const scaleChange = newK - previousK
  const deltaOffset = -(unTransformedZoompoint * scaleChange)

  return previousOffset + deltaOffset
}

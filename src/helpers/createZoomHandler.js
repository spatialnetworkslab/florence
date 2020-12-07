export default function createZoomHandler (
  zoomIdentity,
  {
    setZoomIdentity,
    minZoom = 0.5,
    maxZoom = 3,
    step = 1,
    dimension = 'both'
  }
) {
  const zoom = function (event) {
    const zoomPoint = getZoompoint(event)
    const zoomFactor = event.delta * step

    // console.log(event.delta)

    const previousScaleX = zoomIdentity.kx
    const previousScaleY = zoomIdentity.ky

    const newScaleX = previousScaleX - zoomFactor
    const newScaleY = previousScaleY - zoomFactor

    const newZoomScale = Math.max(newScaleX, newScaleY)

    if (withinRange(newZoomScale, minZoom, maxZoom)) {
      if (dimension === 'both' || dimension === 'x') {
        zoomIdentity.kx = newScaleX

        const offset = getOffset(previousScaleX, newScaleX, zoomPoint.x, zoomIdentity.x)
        zoomIdentity.x = offset
      }

      if (dimension === 'both' || dimension === 'y') {
        zoomIdentity.ky = newScaleY

        const offset = getOffset(previousScaleY, newScaleY, zoomPoint.y, zoomIdentity.y)
        zoomIdentity.y = offset
      }

      setZoomIdentity(zoomIdentity)
    }
  }

  const reset = function () {
    zoomIdentity.x = 0
    zoomIdentity.y = 0
    zoomIdentity.kx = 1
    zoomIdentity.ky = 1

    setZoomIdentity(zoomIdentity)
  }

  return {
    handlers: {
      onWheel: zoom,
      onPinch: zoom
    },

    reset
  }
}

function getZoompoint (event) {
  if (event.type === 'wheel') return event.screenCoordinates
  if (event.type === 'pinch') return event.screenCenter
}

function getOffset (previousK, newK, zoomPoint, previousOffset, extent) {
  const unTransformedZoompoint = (zoomPoint - previousOffset) / previousK
  const scaleChange = newK - previousK
  const deltaOffset = -(unTransformedZoompoint * scaleChange)

  return previousOffset + deltaOffset
}

function withinRange (value, min, max) {
  return min <= value && value <= max
}

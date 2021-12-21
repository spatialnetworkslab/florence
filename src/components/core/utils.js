export const getDeltas = (
  previousCoordinates,
  currentCoordinates
) => {
  const dx = previousCoordinates.x - currentCoordinates.x
  const dy = previousCoordinates.y - currentCoordinates.y

  return { dx, dy }
}

export const createHandler = (fn1Active, fn1, fn2) => {
  if (fn1Active && fn2) {
    return (e) => {
      fn1(e)
      fn2(e)
    }
  }

  if (fn1Active && !fn2) return fn1
  if (!fn1Active && fn2) return fn2
}

export const parseZoomSettings = (zoomSettings) => {
  const defaultZoomSettings = {
    minZoom: 0.5,
    maxZoom: 3,
    step: 1,
    dimension: 'both',
    debounceReindexing: 200
  }

  if (!zoomSettings) return defaultZoomSettings

  return {...defaultZoomSettings, ...zoomSettings}
}

// taken from https://redd.one/blog/debounce-vs-throttle
export const debounce = (func, duration) => {
  let timeout

  return function (...args) {
    const effect = () => {
      timeout = null
      return func.apply(this, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(effect, duration)
  }
}

export const getNewZoomIdentity = (event, previousZoomIdentity, zoomSettings) => {
  const { minZoom, maxZoom, step, dimension } = zoomSettings

  const zoomPoint = getZoompoint(event)
  const zoomFactor = event.delta * step

  const previousKX = previousZoomIdentity.kx
  const previousKY = previousZoomIdentity.ky

  const newScaleX = previousKX - zoomFactor
  const newScaleY = previousKY - zoomFactor

  const newZoomScale = Math.max(newScaleX, newScaleY)
  
  const newZoomIdentity = {}

  if (withinRange(newZoomScale, minZoom, maxZoom)) {
    if (dimension === 'both' || dimension === 'x') {
      newZoomIdentity.kx = newScaleX

      const offset = getOffset(
        previousKX,
        newScaleX,
        zoomPoint.x,
        previousZoomIdentity.x
      )

      newZoomIdentity.x = offset
    }

    if (dimension === 'both' || dimension === 'y') {
      newZoomIdentity.ky = newScaleY

      const offset = getOffset(
        previousKY,
        newScaleY,
        zoomPoint.y,
        previousZoomIdentity.y
      )

      newZoomIdentity.y = offset
    }

    return newZoomIdentity  
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

export const panStart = (zoomingOrPanning, setPreviousCoordinates) => e => {
  zoomingOrPanning.set(true)
  setPreviousCoordinates(e.screenCoordinates)
}

export const panMove = (
  zoomingOrPanningValue,
  zoomIdentity,
  previousCoordinates,
  panExtents,
  setPreviousCoordinates,
  pan
) => e => {
  if (zoomingOrPanningValue) return;
  const currentCoordinates = e.screenCoordinates
  const dx = previousCoordinates.x - currentCoordinates.x
  const dy = previousCoordinates.y - currentCoordinates.y

  setPreviousCoordinates(currentCoordinates)

  if (panExtents) {
    const { x, y } = panExtents
    const totalPanX = zoomIdentity.x - dx
    const totalPanY = zoomIdentity.y - dy

    pan(
      totalPanX <= x[1] && totalPanX >= x[0] ? dx : 0,
      totalPanY <= y[1] && totalPanY >= y[0] ? dy : 0,
    )
  } else {
    pan(dx, dy)
  }
}

export const panEnd = (zoomingOrPanning, setPreviousCoordinates) => e => {
  zoomingOrPanning.set(false)
  setPreviousCoordinates(undefined)
}

export const createHandler = (fn1, fn2) => {
  if (fn1 && fn2) {
    return (e) => {
      fn1(e)
      fn2(e)
    }
  }

  if (fn1 && !fn2) return fn1
  if (!fn1 && fn2) return fn2
}
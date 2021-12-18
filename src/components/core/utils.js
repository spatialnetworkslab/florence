export const getDeltas = (
  previousCoordinates,
  currentCoordinates,
  panExtents
) => {
  const dx = previousCoordinates.x - currentCoordinates.x
  const dy = previousCoordinates.y - currentCoordinates.y

  if (panExtents) {
    const { x, y } = panExtents
    const totalPanX = zoomIdentity.x - dx
    const totalPanY = zoomIdentity.y - dy

    return {
      dx: totalPanX <= x[1] && totalPanX >= x[0] ? dx : 0,
      dy: totalPanY <= y[1] && totalPanY >= y[0] ? dy : 0,
    }
  }

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
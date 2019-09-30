import { scaleLinear } from 'd3-scale'

export default function (bbox) {
  const domainX = bbox.x
  const domainY = bbox.y

  let rangeX
  let rangeY

  const scaleX = scaleLinear().domain(domainX)
  const scaleY = scaleLinear().domain(domainY)

  const setRangeX = range => {
    rangeX = range
    updateRanges()
    return scaleX
  }

  const setRangeY = range => {
    rangeY = range
    updateRanges()
    return scaleY
  }

  function updateRanges () {
    if (rangeX && rangeY) {
      const rangeDeltaX = Math.abs(rangeX[1] - rangeX[0])
      const rangeDeltaY = Math.abs(rangeY[1] - rangeY[0])

      const midX = (rangeX[0] + rangeX[1]) / 2
      const midY = (rangeY[0] + rangeY[1]) / 2

      const scalingFactorX = rangeDeltaX / (domainX[1] - domainX[0])
      const scalingFactorY = rangeDeltaY / (domainY[1] - domainY[0])

      if (scalingFactorX < scalingFactorY) {
        const fromMidY = (domainY[1] - domainY[0]) / 2 * scalingFactorX
        const newRangeY = [midY - fromMidY, midY + fromMidY]

        if (rangeY[0] > rangeY[1]) newRangeY.reverse()

        scaleX.range(rangeX)
        scaleY.range(newRangeY)
      }

      if (scalingFactorX >= scalingFactorY) {
        const fromMidX = (domainX[1] - domainX[0]) / 2 * scalingFactorY
        const newRangeX = [midX - fromMidX, midX + fromMidX]

        scaleX.range(newRangeX)
        scaleY.range(rangeY)
      }
    }
  }

  const dummyScaleObject = {
    scaleX: { range: setRangeX, copy: function () { return this } },
    scaleY: { range: setRangeY, copy: function () { return this } }
  }

  return dummyScaleObject
}

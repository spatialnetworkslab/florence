import extend from './extend.js'
import { pointsToCommands, commandsToPoints } from './convertCommands.js'

export default function (a, b, excludeSegment) {
  // Points [a, b] to commands { type: 'M', x: a, y: b }
  let aCommands = pointsToCommands(a)
  let bCommands = pointsToCommands(b)

  // extend command arrays so that the are the same length
  const numPointsToExtend = Math.abs(b.length - a.length)

  if (numPointsToExtend !== 0) {
    // B has more points than A, so add points to A before interpolating
    if (bCommands.length > aCommands.length) {
      aCommands = extend(aCommands, bCommands, excludeSegment)

      // else if A has more points than B, add more points to B
    } else if (bCommands.length < aCommands.length) {
      bCommands = extend(bCommands, aCommands, excludeSegment)
    }
  }

  // convert back to points
  let aProcessed = commandsToPoints(aCommands)
  let bProcessed = commandsToPoints(bCommands)

  return [aProcessed, bProcessed]
}

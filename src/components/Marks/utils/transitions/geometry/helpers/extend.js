import splitCurve from './splitCurve.js'

function arrayOfLength (length, value) {
  const array = Array(length)
  for (let i = 0; i < length; i++) {
    array[i] = value
  }

  return array
}

/**
 * Interpolate between command objects commandStart and commandEnd segmentCount times.
 * If the types are L, Q, or C then the curves are split as per de Casteljau's algorithm.
 * Otherwise we just copy commandStart segmentCount - 1 times, finally ending with commandEnd.
 *
 * @param {Object} commandStart Command object at the beginning of the segment
 * @param {Object} commandEnd Command object at the end of the segment
 * @param {Number} segmentCount The number of segments to split this into. If only 1
 *   Then [commandEnd] is returned.
 * @return {Object[]} Array of ~segmentCount command objects between commandStart and
 *   commandEnd. (Can be segmentCount+1 objects if commandStart is type M).
 */
function splitSegment (commandStart, commandEnd, segmentCount) {
  let segments = []

  // line, quadratic bezier, or cubic bezier
  if (commandEnd.type === 'L' || commandEnd.type === 'Q' || commandEnd.type === 'C') {
    segments = segments.concat(splitCurve(commandStart, commandEnd, segmentCount))

    // general case - just copy the same point
  } else {
    const copyCommand = Object.assign({}, commandStart)

    // convert M to L
    if (copyCommand.type === 'M') {
      copyCommand.type = 'L'
    }

    segments = segments.concat(arrayOfLength(segmentCount - 1).map(() => copyCommand))
    segments.push(commandEnd)
  }

  return segments
}

/**
 * Extends an array of commandsToExtend to the length of the referenceCommands by
 * splitting segments until the number of commands match. Ensures all the actual
 * points of commandsToExtend are in the extended array.
 *
 * @param {Object[]} commandsToExtend The command object array to extend
 * @param {Object[]} referenceCommands The command object array to match in length
 * @param {Function} excludeSegment a function that takes a start command object and
 *   end command object and returns true if the segment should be excluded from splitting.
 * @return {Object[]} The extended commandsToExtend array
 */
export default function (commandsToExtend, referenceCommands, excludeSegment) {
  // compute insertion points:
  // number of segments in the path to extend
  const numSegmentsToExtend = commandsToExtend.length - 1

  // number of segments in the reference path.
  const numReferenceSegments = referenceCommands.length - 1

  // this value is always between [0, 1].
  const segmentRatio = numSegmentsToExtend / numReferenceSegments

  // create a map, mapping segments in referenceCommands to how many points
  // should be added in that segment (should always be >= 1 since we need each
  // point itself).
  // 0 = segment 0-1, 1 = segment 1-2, n-1 = last vertex
  const countPointsPerSegment = arrayOfLength(numReferenceSegments).reduce((accum, d, i) => {
    let insertIndex = Math.floor(segmentRatio * i)

    // handle excluding segments
    if (excludeSegment && insertIndex < commandsToExtend.length - 1 &&
      excludeSegment(commandsToExtend[insertIndex], commandsToExtend[insertIndex + 1])) {
      // set the insertIndex to the segment that this point should be added to:

      // round the insertIndex essentially so we split half and half on
      // neighbouring segments. hence the segmentRatio * i < 0.5
      const addToPriorSegment = ((segmentRatio * i) % 1) < 0.5

      // only skip segment if we already have 1 point in it (can't entirely remove a segment)
      if (accum[insertIndex]) {
        // TODO - Note this is a naive algorithm that should work for most d3-area use cases
        // but if two adjacent segments are supposed to be skipped, this will not perform as
        // expected. Could be updated to search for nearest segment to place the point in, but
        // will only do that if necessary.

        // add to the prior segment
        if (addToPriorSegment) {
          if (insertIndex > 0) {
            insertIndex -= 1

            // not possible to add to previous so adding to next
          } else if (insertIndex < commandsToExtend.length - 1) {
            insertIndex += 1
          }
          // add to next segment
        } else if (insertIndex < commandsToExtend.length - 1) {
          insertIndex += 1

          // not possible to add to next so adding to previous
        } else if (insertIndex > 0) {
          insertIndex -= 1
        }
      }
    }

    accum[insertIndex] = (accum[insertIndex] || 0) + 1

    return accum
  }, [])

  // extend each segment to have the correct number of points for a smooth interpolation
  const extended = countPointsPerSegment.reduce((extended, segmentCount, i) => {
    // if last command, just add `segmentCount` number of times
    if (i === commandsToExtend.length - 1) {
      const lastCommandCopies = arrayOfLength(segmentCount,
        Object.assign({}, commandsToExtend[commandsToExtend.length - 1]))

      // convert M to L
      if (lastCommandCopies[0].type === 'M') {
        lastCommandCopies.forEach(d => {
          d.type = 'L'
        })
      }
      return extended.concat(lastCommandCopies)
    }

    // otherwise, split the segment segmentCount times.
    return extended.concat(splitSegment(commandsToExtend[i], commandsToExtend[i + 1],
      segmentCount))
  }, [])

  // add in the very first point since splitSegment only adds in the ones after it
  extended.unshift(commandsToExtend[0])

  return extended
}

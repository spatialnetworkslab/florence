import proj4 from 'proj4'
import { transformGeometries } from 'geometryUtils'
import { warn } from 'logging.js'

export default function (data, reprojectInstructions) {
  if (!data.hasOwnProperty('$geometry')) {
    warn('No geometry column found. Skipping reproject-transformation.')
    return data
  }

  if (!reprojectInstructions.hasOwnProperty('to')) {
    warn(`reproject: missing required option 'to'`)
    return data
  }

  let from = 'WGS84'
  if (reprojectInstructions.hasOwnProperty('from')) {
    from = reprojectInstructions.from
  }

  let transformation = proj4(from, reprojectInstructions.to).forward

  let transformedGeometries = transformGeometries(data.$geometry, transformation)
  data.$geometry = transformedGeometries

  return data
}

import proj4 from 'proj4'
import { transformFeatures } from '../../../utils/geojson.js'

export default function (data, reprojectInstructions) {
  if (!data.hasOwnProperty('$geometry')) {
    console.warn('No geometry column found. Skipping reproject-transformation.')
    return data
  }

  if (!reprojectInstructions.hasOwnProperty('to')) {
    console.warn(`reproject: missing required option 'to'`)
    return data
  }

  let from = 'WGS84'
  if (reprojectInstructions.hasOwnProperty('from')) {
    from = reprojectInstructions.from
  }

  let transformation = proj4(from, reprojectInstructions.to).forward

  let transformedFeatures = transformFeatures(data.$geometry, transformation)
  data.$geometry = transformedFeatures

  return data
}

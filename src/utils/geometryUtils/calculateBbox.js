import { geoPath } from 'd3-geo'
import { isInvalid } from '../equals.js'

export function calculateBboxGeometries (geometries) {
  let bbox = [[Infinity, Infinity], [-Infinity, -Infinity]]

  for (let i = 0; i < geometries.length; i++) {
    const geometry = geometries[i]

    if (!isInvalid(geometry)) {
      bbox = updateBbox(bbox, geometry)
    }
  }

  const bboxObj = {
    x: [bbox[0][0], bbox[1][0]],
    y: [bbox[0][1], bbox[1][1]]
  }

  return bboxObj
}

export function calculateBboxGeometry (geometry) {
  const bbox = path.bounds(geometry)

  const bboxObj = {
    x: [bbox[0][0], bbox[1][0]],
    y: [bbox[0][1], bbox[1][1]]
  }

  return bboxObj
}

const path = geoPath()

function updateBbox (bbox, geometry) {
  const newBbox = path.bounds(geometry)

  bbox[0][0] = bbox[0][0] < newBbox[0][0] ? bbox[0][0] : newBbox[0][0]
  bbox[0][1] = bbox[0][1] < newBbox[0][1] ? bbox[0][1] : newBbox[0][1]
  bbox[1][0] = bbox[1][0] > newBbox[1][0] ? bbox[1][0] : newBbox[1][0]
  bbox[1][1] = bbox[1][1] > newBbox[1][1] ? bbox[1][1] : newBbox[1][1]

  return bbox
}

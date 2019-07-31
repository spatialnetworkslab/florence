import { geoPath } from 'd3-geo'
import { isInvalid } from '../equals.js'

export function calculateBBoxGeometries (geometries) {
  let bbox = [[Infinity, Infinity], [-Infinity, -Infinity]]

  for (let i = 0; i < geometries.length; i++) {
    const geometry = geometries[i]

    if (!isInvalid(geometry)) {
      bbox = updateBBox(bbox, geometry)
    }
  }

  const bboxObj = {
    x: [bbox[0][0], bbox[1][0]],
    y: [bbox[0][1], bbox[1][1]]
  }

  return bboxObj
}

export function calculateBBoxGeometry (geometry) {
  const bbox = path.bounds(geometry)

  const bboxObj = {
    x: [bbox[0][0], bbox[1][0]],
    y: [bbox[0][1], bbox[1][1]]
  }

  return bboxObj
}

const path = geoPath()

function updateBBox (bbox, geometry) {
  const newBBox = path.bounds(geometry)

  bbox[0][0] = bbox[0][0] < newBBox[0][0] ? bbox[0][0] : newBBox[0][0]
  bbox[0][1] = bbox[0][1] < newBBox[0][1] ? bbox[0][1] : newBBox[0][1]
  bbox[1][0] = bbox[1][0] > newBBox[1][0] ? bbox[1][0] : newBBox[1][0]
  bbox[1][1] = bbox[1][1] > newBBox[1][1] ? bbox[1][1] : newBBox[1][1]

  return bbox
}

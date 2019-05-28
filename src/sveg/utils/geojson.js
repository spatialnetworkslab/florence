import { coordEach } from '@turf/meta'
import { geoPath } from 'd3-geo'
import { isInvalid } from './equals.js.js'

export function transformFeatures (features, transformation) {
  return features.map(feature => transformFeature(feature, transformation))
}

export function transformFeature (feature, transformation) {
  let featureClone = JSON.parse(JSON.stringify(feature))
  coordEach(featureClone, coord => {
    let [x, y] = transformation(coord)
    coord[0] = x
    coord[1] = y
  })
  return featureClone
}

export function calculateBbox (features) {
  let bbox = [[Infinity, Infinity], [-Infinity, -Infinity]]

  for (let i = 0; i < features.length; i++) {
    let feature = features[i]

    if (!isInvalid(feature)) {
      bbox = updateBBox(bbox, feature)
    }
  }

  let bboxObj = {
    x: [bbox[0][0], bbox[1][0]],
    y: [bbox[0][1], bbox[1][1]]
  }

  return bboxObj
}

const path = geoPath()

function updateBBox (bbox, geometry) {
  let newBBox = path.bounds(geometry)

  bbox[0][0] = bbox[0][0] < newBBox[0][0] ? bbox[0][0] : newBBox[0][0]
  bbox[0][1] = bbox[0][1] < newBBox[0][1] ? bbox[0][1] : newBBox[0][1]
  bbox[1][0] = bbox[1][0] > newBBox[1][0] ? bbox[1][0] : newBBox[1][0]
  bbox[1][1] = bbox[1][1] > newBBox[1][1] ? bbox[1][1] : newBBox[1][1]

  return bbox
}

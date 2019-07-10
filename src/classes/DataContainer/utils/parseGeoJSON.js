import { checkFormatColumnData } from './checkFormat.js'

export default function (geojsonData) {
  let geometryData = []
  let data = {}

  let features = geojsonData.features
  let firstFeature = features[0]

  if (firstFeature.hasOwnProperty('properties')) {
    for (let columnName in firstFeature.properties) {
      data[columnName] = []
    }
  }

  for (let i = 0; i < features.length; i++) {
    let { geometry, properties } = features[i]
    geometryData.push(geometry)

    for (let columnName in properties) {
      data[columnName].push(properties[columnName])
    }
  }

  checkFormatColumnData(data)

  data.$geometry = geometryData

  return data
}

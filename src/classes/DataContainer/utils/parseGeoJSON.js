import { checkFormatColumnDataframe } from './checkFormat.js'

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

  features.forEach(({ geometry, properties }) => {
    geometryData.push(geometry)

    for (let columnName in properties) { 
      data[columnName].push(properties[columnName]) 
    }
  })

  checkFormatColumnDataframe(data)

  data.$geometry = geometryData

  return data
}

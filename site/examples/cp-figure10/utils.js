import { csvParse, autoType } from 'd3-dsv'
import centroid from '@turf/centroid'
import DataContainer from '@snlab/florence-datacontainer'

export async function loadPolygons (url) {
  const response = await fetch(url)
  const data = await response.json()
  
  // the polygons are stored as regular geojson
  // but we also need a centroid to start drawing the line chart
  // we calculate this with @turf/centroid
  // and add to the properties
  data.features.forEach(province => {
    const point = centroid(province)
    province.properties['x'] = point.geometry.coordinates[0]
    province.properties['y'] = point.geometry.coordinates[1]
  })
  return new DataContainer(data)
}

export async function loadCSV (url) {
  const response = await fetch(url)
  const data = await response.text()
  const dataParsed = csvParse(data, autoType)
  const provinces = new Set()
  const dates = new Set()
  const dataKeyed = {}
  for (let index = 0; index < dataParsed.length; index++) {
    const element = dataParsed[index];
    dates.add(element.Datum)
    provinces.add(element.Provincienaam)
    const objectToAdd = {[element.Datum]: element.Aantal}
    dataKeyed[element.Provincienaam] = {...dataKeyed[element.Provincienaam], ...objectToAdd}
  }

  delete dataKeyed['null']
  provinces.delete(null)

  const dataZeroFilled = {date: [], province: [], cases: []}
  for (const date of dates) {
    for (const province of provinces) {
      dataZeroFilled.date.push(date)
        dataZeroFilled.province.push(province)
        if (date in dataKeyed[province]) {
          dataZeroFilled.cases.push(dataKeyed[province][date])
        } else {
          dataZeroFilled.cases.push(0)
        }
    }
  }
  return new DataContainer(dataZeroFilled)
}
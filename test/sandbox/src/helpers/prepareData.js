import avocado from '../data/avocado-data.csv'
import cities from '../data/city-centroids.csv'
import states from '../data/us-states.json'

import DataContainer from '@snlab/florence-datacontainer'

export function getAvocadoDataGrouped () {
  const avocadoGrouped = new DataContainer(avocado)
    .rename({
      AveragePrice: 'averagePrice',
      'Total Volume': 'totalVolume',
      Date: 'date'
    })
    .mutate({
      averagePrice: row => parseFloat(row.averagePrice),
      totalVolume: row => parseInt(row.totalVolume),
      date: row => new Date(row.date)
    })
    .filter(row => row.date > new Date('2017-03-25'))
    .groupBy('city')

  return avocadoGrouped
}

export function getCityData () {
  const cityData = new DataContainer(cities)
    .select(['city', 'lng', 'lat', 'population'])
    .mutate({
      lng: row => parseFloat(row.lng),
      lat: row => parseFloat(row.lat),
      population: row => parseInt(row.population)
    })

  return cityData
}

export function getStateGeometries () {
  const usStates = new DataContainer(states, { validate: false })
    .filter(row => ['Alaska', 'Hawaii'].includes(row.name) === false)
    .select('$geometry')

  return usStates
}

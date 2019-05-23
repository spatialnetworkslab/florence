import DataContainer from '../../index.js'
import { valid } from '../__data__/makeGeoJSON.js'

describe('determining column types', () => {
  // quantitative
  test('a column of Numbers (including missing data) is of type quantitative', () => {
    const data = {
      a: [1, 2, NaN, 4, 5, 6, undefined, 8, null],
      b: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }

    const dataContainer = new DataContainer(data)
    expect(dataContainer.type('a')).toBe('quantitative')
    expect(dataContainer.type('b')).toBe('quantitative')
  })

  test('quantitative data cannot be mixed with other data types', () => {
    const data = { a: [1, 2, 3, '4'] }

    expect(() => new DataContainer(data)).toThrow()
  })

  // categorical
  test('a column of Strings (including missing data) is of type categorical', () => {
    const data = {
      fruit1: ['apple', 'banana', 'coconut', 'durian', 'elderberry'],
      fruit2: ['apple', null, undefined, 'durian', NaN]
    }

    const dataContainer = new DataContainer(data)
    expect(dataContainer.type('fruit1')).toBe('categorical')
    expect(dataContainer.type('fruit2')).toBe('categorical')
  })

  test('categorical data cannot be mixed with other data types', () => {
    const data = { size: ['large', 'medium', 'small', new Date(2019, 4, 20)] }

    expect(() => new DataContainer(data)).toThrow()
  })

  // temporal
  test('a column of Dates (including missing data) is of type temporal', () => {
    const data = {
      startDate: [new Date(2018, 4, 20), new Date(2018, 4, 21), new Date(2018, 4, 22), new Date(2018, 4, 23)],
      endDate: [undefined, new Date(2019, 3, 11), null, new Date(2019, 5, 4)]
    }

    const dataContainer = new DataContainer(data)
    
    expect(dataContainer.type('startDate')).toBe('temporal')
    expect(dataContainer.type('endDate')).toBe('temporal')
  })

  test('temporal data cannot be mixed with other data types', () => {
    const data = { date: [new Date(2018, 4, 20), new Date(2018, 4, 21), 11] }
    
    expect(() => new DataContainer(data)).toThrow()
  })

  // interval
  test('a column of Arrays of length 2 with Numbers (including missing data) is of type interval', () => {
    const data = { 
      bins: [[0, 5], [5, 10], [10, 17], [17, 20]],
      missingBins: [[0, 5], null, [10, 17], NaN]
    }

    const dataContainer = new DataContainer(data)

    expect(dataContainer.type('bins')).toBe('interval')
    expect(dataContainer.type('missingBins')).toBe('interval')
  })

  test('interval data cannot be mixed', () => {
    const data = { bins: [[0, 5], '[5, 10]', [10, 17]] }

    expect(() => new DataContainer(data)).toThrow()
  })

  // geometry
  test('when loading geojson data, the $geometry column is of type geometry', () => {
    const dataContainer = new DataContainer(valid())

    expect(dataContainer.type('$geometry')).toBe('geometry')
  })

  // nested
  test('a column of other DataContainers is of type nested', () => {
    const data = {
      category: ['a', 'a', 'b', 'b', 'c', 'c'],
      amount: [10, 15, 7, 2, 19, 13]
    }

    const dataContainer = new DataContainer(data)
    const groupedDataContainer = dataContainer.groupBy('category').done()

    expect(groupedDataContainer.type('$grouped')).toBe('nested')
  })
})

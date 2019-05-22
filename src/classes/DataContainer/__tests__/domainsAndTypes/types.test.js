import DataContainer from '../../index.js'

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

  })

  // categorical
  test('a column of Strings (including missing data) is of type categorical', () => {
    const data = {
      a: ['apple', 'banana', 'coconut', 'durian', 'elderberry'],
      b: ['apple', null, undefined, 'durian', NaN]
    }

    const dataContainer = new DataContainer(data)
    expect(dataContainer.type('a')).toBe('categorical')
    expect(dataContainer.type('b')).toBe('categorical')
  })

  test('categorical data cannot be mixed with other data types', () => {
    
  })

  // temporal
  test('a column of Dates (including missing data) is of type temporal', () => {

  })

  test('temporal data cannot be mixed with other data types', () => {

  })

  // interval:quantitative

  // interval:temporal

  // geometry

  // nested
})
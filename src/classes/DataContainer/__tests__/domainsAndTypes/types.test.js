import DataContainer from '../../index.js'

describe('determining column types', () => {
  // quantitative
  test('a column of Numbers is of type quantitative', () => {
    const data = {
      quantity: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }

    const dataContainer = new DataContainer(data)
    expect(dataContainer.type('quantity')).toBe('quantitative')
  })

  test('a column of Numbers and invalid data is of type quantitative', () => {
    const data = {
      quantity: [1, 2, NaN, 4, 5, 6, undefined, 8, null]
    }

    const dataContainer = new DataContainer(data)
    expect(dataContainer.type('quantity')).toBe('quantitative')
  })

  // categorical
  test('a column of Strings is of type categorical', () => {
    const data = {
      fruits: ['apple', 'banana', 'coconut', 'durian']
    }

    const dataContainer = new DataContainer(data)
    expect(dataContainer.type('fruits')).toBe('categorical')
  })

  // temporal

  // interval:quantitative

  // interval:temporal

  // geometry

  // nested
})
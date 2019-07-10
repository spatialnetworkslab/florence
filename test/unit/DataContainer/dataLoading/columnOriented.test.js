import { DataContainer } from '../../../../'

describe('loading column-oriented data', () => {
  test('valid column-oriented data throws no error', () => {
    const validData = {
      fruit: ['apple', 'banana', 'coconut'],
      quantity: [1, 2, 3]
    }

    expect(() => new DataContainer(validData)).not.toThrow()
  })

  test('column-oriented data with unequal column lengths throws an error', () => {
    const unequalColumnData = {
      city: ['Amsterdam', 'Rotterdam', 'Den Haag'],
      population: [700000, 600000, 500000, 400000]
    }

    expect(() => new DataContainer(unequalColumnData)).toThrow()
  })

  test('columns are loaded correctly', () => {
    const data = {
      day: [new Date(2019, 4, 19), new Date(2019, 4, 20), null, new Date(2019, 4, 21)],
      sales: [10, NaN, 20, 15]
    }

    let dataContainer = new DataContainer(data)

    expect(dataContainer.column('day')).toEqual([new Date(2019, 4, 19), new Date(2019, 4, 20), null, new Date(2019, 4, 21)])
    expect(dataContainer.column('sales')).toEqual([10, NaN, 20, 15])
  })

  test('column-oriented data cannot be empty', () => {
    const emptyData = {
      item: [],
      quantity: []
    }

    expect(() => new DataContainer(emptyData)).toThrow()
  })

  test('columns with only missing values throw an error', () => {
    const data = {
      a: [1, 2, 3, 4],
      b: [NaN, null, undefined, NaN]
    }

    expect(() => new DataContainer(data)).toThrow()
  })

  test('column names cannot contain \'$\'', () => {
    const data = {
      $fruit: ['apple', 'banana', 'coconut'],
      quantity: [1, 2, 3]
    }

    expect(() => new DataContainer(data)).toThrow()
  })

  test('column names cannot contain \'/\'', () => {
    const data = {
      day: [new Date(2019, 4, 19), new Date(2019, 4, 20), new Date(2019, 4, 21)],
      'daily/sales': [10, 20, 15]
    }

    expect(() => new DataContainer(data)).toThrow()
  })
})

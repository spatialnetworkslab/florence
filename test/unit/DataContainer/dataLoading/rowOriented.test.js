import { DataContainer } from '../../../../'

describe('loading row-oriented data', () => {
  test('valid row-oriented data throws no error', () => {
    const validData = [
      { fruit: 'apple', quantity: 1 },
      { fruit: 'banana', quantity: 2 },
      { fruit: 'coconut', quantity: 3 }
    ]

    expect(() => new DataContainer(validData)).not.toThrow()
  })

  test('row-oriented data with unequal column lengths throws an error', () => {
    const unequalColumnData = [
      { city: 'Amsterdam', population: 700000 },
      { city: 'Rotterdam', population: 600000 },
      { city: 'Den Haag', population: 500000 },
      { population: 400000 }
    ]

    expect(() => new DataContainer(unequalColumnData)).toThrow()
  })

  test('columns are loaded correctly', () => {
    const data = [
      { day: new Date(2019, 4, 19), sales: 10 },
      { day: new Date(2019, 4, 20), sales: NaN },
      { day: null, sales: 20 },
      { day: new Date(2019, 4, 21), sales: 15 }
    ]

    let dataContainer = new DataContainer(data)

    expect(dataContainer.column('day')).toEqual([new Date(2019, 4, 19), new Date(2019, 4, 20), null, new Date(2019, 4, 21)])
    expect(dataContainer.column('sales')).toEqual([10, NaN, 20, 15])
  })

  test('row-oriented data cannot be empty', () => {
    const emptyData = []

    expect(() => new DataContainer(emptyData)).toThrow()
  })

  test('columns with only missing values throw an error', () => {
    const data = [
      { a: 1, b: NaN },
      { a: 2, b: null },
      { a: 3, b: undefined },
      { a: 4, b: NaN }
    ]

    expect(() => new DataContainer(data)).toThrow()
  })

  test('column names cannot contain \'$\'', () => {
    const data = [
      { $fruit: 'apple', quantity: 1 },
      { $fruit: 'banana', quantity: 2 },
      { $fruit: 'coconut', quantity: 3 }
    ]

    expect(() => new DataContainer(data)).toThrow()
  })

  test('column names cannot contain \'/\'', () => {
    const data = [
      { day: new Date(2019, 4, 19), 'daily/sales': 10 },
      { day: new Date(2019, 4, 20), 'daily/sales': 20 },
      { day: new Date(2019, 4, 21), 'daily/sales': 15 }
    ]

    expect(() => new DataContainer(data)).toThrow()
  })
})

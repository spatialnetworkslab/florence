import DataContainer from '../../index.js'

describe('loading row-oriented data', () => {
  test('valid row-oriented data throws no error', () => {
    const validData = [
      { food: 'fries', rating: 7 },
      { food: 'kebab', rating: 8 },
      { food: 'nutella pancake', rating: 6 }
    ]

    expect(() => new DataContainer(validData)).not.toThrow()
  })

  test('row-oriented data with unequal column lengths throws an error', () => {
    const invalidData = [
      { name: 'Tim', born: new Date(1994, 8, 7) },
      { name: 'Tammy', born: new Date(1991, 3, 3) },
      { born: new Date(2000, 2, 26) }
    ]

    expect(() => new DataContainer(invalidData)).toThrow()
  })

  test('columns are loaded correctly', () => {
    const data = [
      { food: 'fries', rating: 7 },
      { food: 'kebab', rating: 8 },
      { food: 'nutella pancake', rating: 6 }
    ]

    let dataContainer = new DataContainer(data)

    expect(dataContainer.column('food')).toEqual(['fries', 'kebab', 'nutella pancake'])
    expect(dataContainer.column('rating')).toEqual([7, 8, 6])
  })

  test('row-oriented data cannot be empty', () => {
    const emptyData = []
    
    expect(() => new DataContainer(emptyData)).toThrow()
  })
})

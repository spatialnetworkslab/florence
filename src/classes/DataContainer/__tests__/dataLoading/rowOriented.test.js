import DataContainer from '../../index.js'

const mockSetRowDataframe = jest.fn()
const mockSetColumnDataframe = jest.fn()
jest.mock('../../index.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      _setRowDataframe: mockSetRowDataframe,
      _setColumnDataFrame: mockSetColumnDataframe
    }
  })
})

describe.skip('row-oriented data is converted to column-oriented data', () => {
  beforeEach(() => {
    DataContainer.mockClear()
  })

  test('valid row-oriented data calls right methods', () => {
    const validData = [
      { food: 'fries', rating: 7 },
      { food: 'kebab', rating: 8 },
      { food: 'nutella pancake', rating: 6 }
    ]

    const dataContainer = new DataContainer(validData)

    expect(mockSetRowDataframe).toHaveBeenCalledTimes(1)
    expect(mockSetColumnDataframe).toHaveBeenCalledTimes(1)
  })
})

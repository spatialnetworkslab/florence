import DataContainer from '../../index.js'

describe('calculating domains', () => {
  // quantitative
  test('the lowest and highest Numbers in a column are the domain', () => {
    const data = { quantity: [20, 1, -200, 50, 12] }
    const dataContainer = new DataContainer(data)
    const domain = dataContainer.domain('quantity')

    expect(domain[0]).toBe(-200)
    expect(domain[1]).toBe(50)
  })

  test('quantitative domain ignores Infinity', () => {
    const data = { quantity: [-20, Infinity, 199, 31, -1, -Infinity] }
    const dataContainer = new DataContainer(data)
    const domain = dataContainer.domain('quantity')

    expect(domain[0]).toBe(-20)
    expect(domain[1]).toBe(199)
  })

  // categorical

  // temporal

  // interval

  // geometry

  // nested
})
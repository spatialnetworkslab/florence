import { applyPadding, getCells } from '../../../../../src/components/core/grid/cells.js'

describe('applyPadding', () => {
  it('works correctly when x1 < x2 and y1 < y2', () => {
    const output = applyPadding(
      { x1: 0, x2: 100, y1: 0, y2: 100 },
      10
    )

    expect(output).toEqual({ x1: 10, x2: 90, y1: 10, y2: 90 })
  })

  it('works correctly when x1 < x2 and y1 > y2', () => {
    const output = applyPadding(
      { x1: 0, x2: 100, y1: 100, y2: 0 },
      10
    )

    expect(output).toEqual({ x1: 10, x2: 90, y1: 90, y2: 10 })
  })

  it('works correctly when x1 > x2 and y1 < y2', () => {
    const output = applyPadding(
      { x1: 100, x2: 0, y1: 0, y2: 100 },
      10
    )

    expect(output).toEqual({ x1: 90, x2: 10, y1: 10, y2: 90 })
  })

  it('works correctly when x1 > x2 and y1 > y2', () => {
    const output = applyPadding(
      { x1: 100, x2: 0, y1: 100, y2: 0 },
      10
    )

    expect(output).toEqual({ x1: 90, x2: 10, y1: 90, y2: 10 })
  })
})

describe('getCells', () => {
  it('works correctly when x1 < x2 and y1 < y2', () => {
    const output = getCells(
      { x1: 0, x2: 100, y1: 0, y2: 100 },
      2,
      2
    )

    const expectedOutput = [
      { x1: 0, x2: 50, y1: 0, y2: 50 },
      { x1: 50, x2: 100, y1: 0, y2: 50 },
      { x1: 0, x2: 50, y1: 50, y2: 100 },
      { x1: 50, x2: 100, y1: 50, y2: 100 }
    ]

    expect(output).toEqual(expectedOutput)
  })

  it('works correctly when x1 < x2 and y1 > y2', () => {
    const output = getCells(
      { x1: 0, x2: 100, y1: 100, y2: 0 },
      2,
      2
    )

    const expectedOutput = [
      { x1: 0, x2: 50, y1: 100, y2: 50 },
      { x1: 50, x2: 100, y1: 100, y2: 50 },
      { x1: 0, x2: 50, y1: 50, y2: 0 },
      { x1: 50, x2: 100, y1: 50, y2: 0 }
    ]

    expect(output).toEqual(expectedOutput)
  })

  it('works correctly when x1 > x2 and y1 < y2', () => {
    const output = getCells(
      { x1: 100, x2: 0, y1: 0, y2: 100 },
      2,
      2
    )

    const expectedOutput = [
      { x1: 100, x2: 50, y1: 0, y2: 50 },
      { x1: 50, x2: 0, y1: 0, y2: 50 },
      { x1: 100, x2: 50, y1: 50, y2: 100 },
      { x1: 50, x2: 0, y1: 50, y2: 100 }
    ]

    expect(output).toEqual(expectedOutput)
  })

  it('works correctly when x1 > x2 and y1 > y2', () => {
    const output = getCells(
      { x1: 100, x2: 0, y1: 100, y2: 0 },
      2,
      2
    )

    const expectedOutput = [
      { x1: 100, x2: 50, y1: 100, y2: 50 },
      { x1: 50, x2: 0, y1: 100, y2: 50 },
      { x1: 100, x2: 50, y1: 50, y2: 0 },
      { x1: 50, x2: 0, y1: 50, y2: 0 }
    ]

    expect(output).toEqual(expectedOutput)
  })
})

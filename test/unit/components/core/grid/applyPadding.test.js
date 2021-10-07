import { applyPadding } from '../../../../../src/components/Core/Grid/cells.js'

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

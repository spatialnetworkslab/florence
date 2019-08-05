import { findLambda, getParallelPoints } from '../../src/components/Marks/Line/representLineAsPolygon.js'

describe('representLineAsPolygon', () => {
  test('findLambda works correctly', () => {
    let p1 = [1, 1]
    let v1 = [-1, 0]
    let p2 = [3, 3]
    let v2 = [0, 1]

    expect(findLambda(p1, v1, p2, v2)).toBe(-2)

    p1 = [0, 0]
    v1 = [0.6, 0.8]
    p2 = [5, 4]
    v2 = [1, 0]

    expect(findLambda(p1, v1, p2, v2)).toBe(5)
  })

  test('getParallelPoints works correctly', () => {
    const segment = [[2, 1], [2, 4]]
    const point = [2, 1]
    const distance = 1

    expect(getParallelPoints(segment, point, distance)).toEqual([[1, 1], [3, 1]])
  })
})

import { renderMark } from '../../../utils.js'
import { Point } from '../../../../../src/index.js'

describe('Point (svg)', () => {
  it('renders', () => {
    const { getAllByTestId } = renderMark(
      Point,
      { x: 0.5, y: 0.5 }
    )

    expect(getAllByTestId('point').length).toEqual(1)
  })
})

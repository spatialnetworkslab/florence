import { renderMark } from '../../../utils.js'
import { Point } from '../../../../../src/index.js'

describe('Point (svg)', () => {
  it('renders', () => {
    const { getByTestId } = renderMark(
      Point,
      { x: 0.5, y: 0.5 }
    )

    expect(getByTestId('point')).toBeInTheDocument()
  })
})

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

describe('Point (canvas)', () => {
  it('calls onClick when clicked', () => {
    const onClick = jest.fn()

    const { dummyRoot } = renderMark(
      Point,
      { x: 0.5, y: 0.5, onClick },
      { renderer: 'canvas' }
    )

    dummyRoot.trigger('click', { x: 250, y: 250 })
    expect(onClick).toHaveBeenCalled()
  })
})

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

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()

    const { dummyRoot } = renderMark(
      Point,
      { x: 0.5, y: 0.5, onClick }
    )

    dummyRoot.trigger('click', { clientX: 20, clientY: 400 })
    expect(onClick).not.toHaveBeenCalled()

    dummyRoot.trigger('click', { clientX: 250, clientY: 250 })
    expect(onClick).toHaveBeenCalled()
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

    dummyRoot.trigger('click', { clientX: 20, clientY: 400 })
    expect(onClick).not.toHaveBeenCalled()

    dummyRoot.trigger('click', { clientX: 250, clientY: 250 })
    expect(onClick).toHaveBeenCalled()
  })
})

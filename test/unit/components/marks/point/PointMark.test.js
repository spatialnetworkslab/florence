import { renderMark } from '../../../utils.js'
import { Point } from '../../../../../src/index.js'
import { tick } from 'svelte'

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

    tick().then(() => {
      dummyRoot.trigger('click', 20, 400)
      expect(onClick).not.toHaveBeenCalled()

      dummyRoot.trigger('click', 250, 250)
      expect(onClick).toHaveBeenCalled()
    })
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

    tick().then(() => {
      dummyRoot.trigger('click', 20, 400)
      expect(onClick).not.toHaveBeenCalled()

      dummyRoot.trigger('click', 250, 250)
      expect(onClick).toHaveBeenCalled()
    })
  })
})

import { renderMark } from '../../../utils.js'
import { Rectangle } from '../../../../../src/index.js'

describe('Rectangle (svg)', () => {
  it('renders', () => {
    const { getByTestId } = renderMark(Rectangle, {
      x1: 0.25,
      x2: 0.5,
      y1: 0.25,
      y2: 0.5
    })

    expect(getByTestId('rectangle')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()

    const { dummyRoot } = renderMark(Rectangle, {
      x1: 0.25,
      x2: 0.5,
      y1: 0.25,
      y2: 0.5,
      onClick
    })

    dummyRoot.trigger('click', 400, 400)
    expect(onClick).not.toHaveBeenCalled()

    dummyRoot.trigger('click', 200, 200)
    expect(onClick).toHaveBeenCalled()
  })
})

import { renderLayer } from '../../../utils.js'
import { RectangleLayer } from '../../../../../src/index.js'
import { tick } from 'svelte'

describe('RectangleLayer (svg)', () => {
  it('renders', () => {
    const { getByTestId, getAllByTestId } = renderLayer(
      RectangleLayer,
      {
        x1: [0.25, 0.5],
        x2: [0.5, 0.75],
        y1: [0.25, 0.5],
        y2: [0.5, 0.75]
      }
    )

    expect(getByTestId('rectangle-layer')).toBeInTheDocument()
    expect(getAllByTestId('rectangle-layer-mark').length).toEqual(2)
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()

    const { dummyRoot } = renderLayer(
      RectangleLayer,
      {
        x1: [0, 0.5],
        x2: [0.5, 1],
        y1: [0, 0.5],
        y2: [0.5, 1],
        onClick
      }
    )

    tick().then(() => {
      dummyRoot.trigger('click', 125, 125)
      dummyRoot.trigger('click', 125, 375)
      dummyRoot.trigger('click', 375, 375)
      dummyRoot.trigger('click', 375, 125)

      expect(onClick).toHaveBeenCalledTimes(2)
    })
  })
})

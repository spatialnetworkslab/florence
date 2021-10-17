import { renderLayer } from '../../../utils.js'
import { PointLayer } from '../../../../../src/index.js'

describe('PointLayer (svg)', () => {
  it('renders', () => {
    const { getByTestId, getAllByTestId } = renderLayer(
      PointLayer,
      {
        x: [0.25, 0.5, 0.75],
        y: [0.25, 0.5, 0.75]
      }
    )

    expect(getByTestId('point-layer')).toBeInTheDocument()
    expect(getAllByTestId('point-layer-mark').length).toEqual(3)
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()

    const { dummyRoot } = renderLayer(
      PointLayer,
      {
        x: [0.25, 0.5, 0.75],
        y: [0.25, 0.5, 0.75],
        onClick
      }
    )

    dummyRoot.trigger('click', 125, 125)
    dummyRoot.trigger('click', 250, 250)
    dummyRoot.trigger('click', 375, 375)

    dummyRoot.trigger('click', 400, 100)

    expect(onClick).toHaveBeenCalledTimes(3)
  })
})

describe('PointLayer (canvas)', () => {
  it('calls onClick when clicked', () => {
    const onClick = jest.fn()

    const { dummyRoot } = renderLayer(
      PointLayer,
      {
        x: [0.25, 0.5, 0.75],
        y: [0.25, 0.5, 0.75],
        onClick
      },
      { renderer: 'canvas' }
    )

    dummyRoot.trigger('click', 125, 125)
    dummyRoot.trigger('click', 250, 250)
    dummyRoot.trigger('click', 375, 375)

    dummyRoot.trigger('click', 400, 100)

    expect(onClick).toHaveBeenCalledTimes(3)
  })
})

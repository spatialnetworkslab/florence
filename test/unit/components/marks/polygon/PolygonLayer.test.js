import { renderLayer } from '../../../utils.js'
import { PolygonLayer } from '../../../../../src/index.js'

describe('PolygonLayer (svg)', () => {
  it('renders with x/y coordinates', () => {
    const { getByTestId, getAllByTestId } = renderLayer(
      PolygonLayer,
      {
        x: [[0.2, 0.8, 0.5, 0.2], [0.2, 0.8, 0.5, 0.2]],
        y: [[0.2, 0.2, 0.5, 0.2], [0.8, 0.8, 0.5, 0.8]]
      }
    )

    expect(getByTestId('polygon-layer')).toBeInTheDocument()
    expect(getAllByTestId('polygon-layer-mark').length).toEqual(2)
  })

  it('renders with geojson', () => {
    const geometry1 = {
      type: 'Polygon',
      coordinates: [
        [[[0.2, 0.2], [0.8, 0.2], [0.5, 0.5], [0.2, 0.2]]]
      ]
    }

    const geometry2 = {
      type: 'Polygon',
      coordinates: [
        [[[0.2, 0.8], [0.8, 0.8], [0.5, 0.5], [0.2, 0.8]]]
      ]
    }

    const { getByTestId, getAllByTestId } = renderLayer(
      PolygonLayer,
      { geometry: [geometry1, geometry2] }
    )

    expect(getByTestId('polygon-layer')).toBeInTheDocument()
    expect(getAllByTestId('polygon-layer-mark').length).toEqual(2)
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()

    const { dummyRoot } = renderLayer(
      PolygonLayer,
      {
        x: [[0.2, 0.8, 0.5, 0.2], [0.2, 0.8, 0.5, 0.2]],
        y: [[0.2, 0.2, 0.5, 0.2], [0.8, 0.8, 0.5, 0.8]],
        onClick
      }
    )

    dummyRoot.trigger('click', { clientX: 0, clientY: 250 })
    dummyRoot.trigger('click', { clientX: 250, clientY: 200 })
    dummyRoot.trigger('click', { clientX: 250, clientY: 300 })

    expect(onClick).toHaveBeenCalledTimes(2)
  })
})

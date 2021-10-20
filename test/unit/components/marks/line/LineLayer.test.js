import { renderLayer } from '../../../utils.js'
import { LineLayer } from '../../../../../src/index.js'

describe('LineLayer (svg)', () => {
  it('renders with x/y coordinates', () => {
    const { getByTestId, getAllByTestId } = renderLayer(
      LineLayer,
      {
        x: [[0.2, 0.8, 0.5, 0.2], [0.2, 0.8, 0.5, 0.2]],
        y: [[0.2, 0.2, 0.5, 0.2], [0.8, 0.8, 0.5, 0.8]]
      }
    )

    expect(getByTestId('line-layer')).toBeInTheDocument()
    expect(getAllByTestId('line-layer-mark').length).toEqual(2)
  })

  it('renders with geojson', () => {
    const geometry1 = {
      type: 'LineString',
      coordinates: [
        [0.2, 0.2], [0.8, 0.2], [0.5, 0.5], [0.2, 0.2]
      ]
    }

    const geometry2 = {
      type: 'LineString',
      coordinates: [
        [0.2, 0.8], [0.8, 0.8], [0.5, 0.5], [0.2, 0.8]
      ]
    }

    const { getByTestId, getAllByTestId } = renderLayer(
      LineLayer,
      { geometry: [geometry1, geometry2] }
    )

    expect(getByTestId('line-layer')).toBeInTheDocument()
    expect(getAllByTestId('line-layer-mark').length).toEqual(2)
  })
})

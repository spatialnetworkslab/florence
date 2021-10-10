import { renderLayer } from '../../../utils.js'
import { PolygonLayer } from '../../../../../src/index.js'

describe('PointLayer (svg)', () => {
  it('renders', () => {
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
})

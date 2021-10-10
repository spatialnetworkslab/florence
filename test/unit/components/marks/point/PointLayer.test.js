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
})

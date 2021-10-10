import { renderLayer } from '../../../utils.js'
import { PointLayer } from '../../../../../src/index.js'

describe('PointLayer (svg)', () => {
  it('renders', () => {
    const { getAllByTestId } = renderLayer(
      PointLayer,
      {
        x: [0.25, 0.5, 0.75],
        y: [0.25, 0.5, 0.75]
      }
    )

    expect(getAllByTestId('point-layer').length).toEqual(1)
    expect(getAllByTestId('point-layer-mark').length).toEqual(3)
  })
})

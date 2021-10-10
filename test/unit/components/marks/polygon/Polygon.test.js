import { renderMark } from '../../../utils.js'
import { Polygon } from '../../../../../src/index.js'

describe('Polygon', () => {
  it('renders with x/y coordinates', () => {
    const { getByTestId } = renderMark(Polygon, {
      x: [0.2, 0.8, 0.5, 0.2],
      y: [0.2, 0.2, 0.8, 0.2]
    })

    expect(getByTestId('polygon')).toBeInTheDocument()
  })
})

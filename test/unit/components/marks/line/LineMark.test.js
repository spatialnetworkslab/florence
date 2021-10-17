import { renderMark } from '../../../utils.js'
import { Line } from '../../../../../src/index.js'

describe('Line (svg)', () => {
  it('renders with x/y coordinates', () => {
    const { getByTestId } = renderMark(Line, {
      x: [0.2, 0.8, 0.5, 0.2],
      y: [0.2, 0.2, 0.8, 0.2]
    })

    expect(getByTestId('line')).toBeInTheDocument()
  })

  it('renders with geojson', () => {
    const geometry = {
      type: 'LineString',
      coordinates: [
        [0.2, 0.2], [0.8, 0.2], [0.5, 0.8], [0.2, 0.2]
      ]
    }

    const { getByTestId } = renderMark(Line, { geometry })

    expect(getByTestId('line')).toBeInTheDocument()
  })
})

import { renderMark } from '../../../utils.js'
import { Polygon } from '../../../../../src/index.js'
import { tick } from 'svelte'

describe('Polygon (svg)', () => {
  it('renders with x/y coordinates', () => {
    const { getByTestId } = renderMark(Polygon, {
      x: [0.2, 0.8, 0.5, 0.2],
      y: [0.2, 0.2, 0.8, 0.2]
    })

    expect(getByTestId('polygon')).toBeInTheDocument()
  })

  it('renders with geojson', () => {
    const geometry = {
      type: 'Polygon',
      coordinates: [
        [[[0.2, 0.2], [0.8, 0.2], [0.5, 0.8], [0.2, 0.2]]]
      ]
    }

    const { getByTestId } = renderMark(Polygon, { geometry })

    expect(getByTestId('polygon')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()

    const { dummyRoot } = renderMark(Polygon, {
      x: [0.2, 0.8, 0.5, 0.2],
      y: [0.2, 0.2, 0.8, 0.2],
      onClick
    })

    dummyRoot.trigger('click', 10, 10)
    expect(onClick).not.toHaveBeenCalled()

    dummyRoot.trigger('click', 250, 250)
    expect(onClick).toHaveBeenCalled()
  })
})

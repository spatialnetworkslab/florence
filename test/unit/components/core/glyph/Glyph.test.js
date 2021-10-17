import TestComponent from './TestComponent.svelte'
import { render } from '../../../utils.js'

describe('Glyph', () => {
  it('works without scales', () => {
    const { getByTestId } = render(TestComponent, {
      point: { x: 0.5, y: 0.5, radius: 10 }
    })

    expect(getByTestId('point')).toHaveAttribute('d', 'M260,250A10,10,0,1,1,240,250A10,10,0,1,1,260,250')
  })

  it('works with scales', () => {
    const { getByTestId } = render(TestComponent, {
      glyph: { scaleX: [0, 10], scaleY: [0, 10] },
      point: { x: 5, y: 5, radius: 10 }
    })

    expect(getByTestId('point')).toHaveAttribute('d', 'M260,250A10,10,0,1,1,240,250A10,10,0,1,1,260,250')
  })

  it('works with padding', () => {
    const { getByTestId } = render(TestComponent, {
      glyph: { padding: { left: 100, top: 100 } },
      point: { x: 0.375, y: 0.375, radius: 10 }
    })

    expect(getByTestId('point')).toHaveAttribute('d', 'M260,250A10,10,0,1,1,240,250A10,10,0,1,1,260,250')
  })
})

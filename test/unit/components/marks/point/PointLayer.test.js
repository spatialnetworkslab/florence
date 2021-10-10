import { render } from '@testing-library/svelte'
import { PointLayer } from '../../../../../src/index.js'
import TestComponent from '../TestComponent.svelte'

describe('PointLayer (svg)', () => {
  it('renders', () => {
    const { getAllByTestId } = render(TestComponent, {
      component: PointLayer,
      componentProps: {
        x: [0.25, 0.5, 0.75],
        y: [0.25, 0.5, 0.75]
      }
    })

    expect(getAllByTestId('point-layer').length).toEqual(1)
    expect(getAllByTestId('point-layer-mark').length).toEqual(3)
  })
})

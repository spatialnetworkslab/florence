import { render } from '@testing-library/svelte'
import { Point } from '../../../../../src/index.js'
import TestComponent from '../TestComponent.svelte'

describe('Point (svg)', () => {
  it('renders', () => {
    const { getAllByTestId } = render(TestComponent, {
      component: Point,
      componentProps: { x: 0.5, y: 0.5 }
    })

    expect(getAllByTestId('point').length).toEqual(1)
  })
})

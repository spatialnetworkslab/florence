import { render } from '@testing-library/svelte'
import { Point } from '../../../../../src/index.js'
import TestMark from '../TestMark.svelte'

describe('Point', () => {
  it('renders (SVG)', () => {
    const { getAllByTestId } = render(TestMark, {
      mark: Point,
      markProps: { x: 0.5, y: 0.5 }
    })

    expect(getAllByTestId('point').length).toEqual(1)
  })
})

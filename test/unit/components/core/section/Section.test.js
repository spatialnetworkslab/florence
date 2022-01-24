import TestComponent from './TestComponent.svelte'
import { render, createDummyNode } from '../../../utils.js'
import { waitFor } from '@testing-library/svelte'

describe('Section', () => {
  it('works without scales', () => {
    const { getByTestId } = render(TestComponent, {
      point: { x: 0.5, y: 0.5, radius: 10 }
    })

    expect(getByTestId('point')).toHaveAttribute('d', 'M260,250A10,10,0,1,1,240,250A10,10,0,1,1,260,250')
  })

  it('works with scales', () => {
    const { getByTestId } = render(TestComponent, {
      section: { scaleX: [0, 10], scaleY: [0, 10] },
      point: { x: 5, y: 5, radius: 10 }
    })

    expect(getByTestId('point')).toHaveAttribute('d', 'M260,250A10,10,0,1,1,240,250A10,10,0,1,1,260,250')
  })

  it('works with padding', () => {
    const { getByTestId, ...rest } = render(TestComponent, {
      section: { padding: { left: 100, top: 100 } },
      point: { x: 0.375, y: 0.375, radius: 10 }
    })

    expect(getByTestId('point')).toHaveAttribute('d', 'M260,250A10,10,0,1,1,240,250A10,10,0,1,1,260,250')
  })

  it('pans', async () => {
    const dummyRoot = createDummyNode()
    const dummyWindow = createDummyNode()

    const _testDummies = { dummyRoot, dummyWindow }

    const { getByTestId } = render(TestComponent, {
      graphic: { _testDummies },
      section: { pannable: true },
      point: { x: 0.5, y: 0.5, radius: 10 }
    })

    dummyRoot.trigger('mousedown', { clientX: 100, clientY: 100 })
    dummyWindow.trigger('mousemove', { clientX: 200, clientY: 200 })
    dummyWindow.trigger('mouseup', { clientX: 200, clientY: 200 })

    const expectedPath = 'M360,350A10,10,0,1,1,340,350A10,10,0,1,1,360,350'
    await waitFor(() => expect(getByTestId('point')).toHaveAttribute('d', expectedPath))
  })

  it('pans until viewportFence is reached', async () => {
    const dummyRoot = createDummyNode()
    const dummyWindow = createDummyNode()

    const _testDummies = { dummyRoot, dummyWindow }

    const viewportFence = {
      left: { x: -0.2, y: 0 },
      right: { x: 0, y: 0 },
      top: { x: 0, y: -0.2 },
      bottom: { x: 0, y: 0 }
    }

    const { getByTestId } = render(TestComponent, {
      graphic: { _testDummies },
      section: { pannable: true, zoomPanSettings: { viewportFence } },
      point: { x: 0.5, y: 0.5, radius: 10 }
    })

    dummyRoot.trigger('mousedown', { clientX: 100, clientY: 100 })
    dummyWindow.trigger('mousemove', { clientX: 300, clientY: 300 })
    dummyWindow.trigger('mouseup', { clientX: 300, clientY: 300 })

    const expectedPath = 'M360,350A10,10,0,1,1,340,350A10,10,0,1,1,360,350'
    await waitFor(() => expect(getByTestId('point')).toHaveAttribute('d', expectedPath))
  })
})

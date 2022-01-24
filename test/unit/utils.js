import TestComponent from './components/marks/TestComponent.svelte'
import {
  render,
  fireEvent
} from '@testing-library/svelte'
import { tick } from 'svelte'

export function renderMark (
  component,
  componentProps,
  graphicProps,
  renderOptions
) {
  const dummyRoot = createDummyNode()
  const dummyWindow = createDummyNode()

  const output = render(
    TestComponent,
    {
      component,
      componentProps,
      graphicProps,
      dummyRoot,
      dummyWindow
    },
    renderOptions
  )

  return { ...output, dummyRoot, dummyWindow }
}

export const renderLayer = renderMark

export {
  render,
  fireEvent
}

const EVENT_NAMES = [
  'mousedown', 'mouseup', 'mousemove', 'mouseout', 'click', 'wheel',
  'touchstart', 'touchend', 'touchmove', 'touchcancel'
]

export function createDummyNode () {
  const eventHandlers = {}
  EVENT_NAMES.forEach(e => { eventHandlers[e] = new Set() })

  return {
    addEventListener (name, handler) {
      eventHandlers[name].add(handler)
    },

    removeEventListener (name, handler) {
      eventHandlers[name].delete(handler)
    },

    getBoundingBoxClientRect () {
      return {
        top: 0,
        left: 0
      }
    },

    trigger (name, x, y) {
      const event = createEvent(x, y)
      eventHandlers[name].forEach(h => h(event))
    },

    _getHandlers () { return eventHandlers },

    createSVGPoint () {
      return {
        x: 0,
        y: 0,
        matrixTransform () {
          return { x: this.x, y: this.y }
        }
      }
    },

    getScreenCTM () { return { inverse () {} } }
  }
}

function createEvent (x, y) {
  return {
    clientX: x,
    clientY: y,
    preventDefault: () => null
  }
}

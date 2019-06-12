import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

class GraphicContext {
  constructor ({ renderer, eventManager }) {
    if (!renderer) {
      this._rendererOptions = { output: 'svg' }
    }

    if (renderer) {
      validateRendererOptions(renderer)
      this._rendererOptions = renderer
    }

    this._eventManager = eventManager
  }

  output () {
    return this._rendererOptions.output
  }

  eventManager () {
    return this._eventManager
  }
}

function validateRendererOptions (options) {
  if (!(
    options.constructor === Object &&
    options.hasOwnProperty('output') &&
    ['svg'].includes(options.output)
  )) {
    throw new Error(`Invalid renderer options: ${JSON.stringify(options)}`)
  }
}

const key = {}

export function subscribe () {
  return getContext(key)
}

export function init () {
  let graphicContext = writable()
  setContext(key, graphicContext)

  return graphicContext
}

export function update (graphicContext, options) {
  graphicContext.set(new GraphicContext(options))
}

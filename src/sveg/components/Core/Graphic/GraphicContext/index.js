import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

class GraphicContext {
  constructor ({ renderer, rootNode }) {
    if (!renderer) {
      this._rendererOptions = { output: 'svg' }
    }

    if (renderer) {
      validateRendererOptions(renderer)
      this._rendererOptions = renderer
    }

    this._rootNode = rootNode
  }

  output () {
    return this._rendererOptions.output
  }

  rootNode () {
    return this._rootNode
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

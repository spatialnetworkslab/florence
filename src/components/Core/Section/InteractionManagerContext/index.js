import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

const key = {}

export function subscribe () {
  return getContext(key)
}

export function init () {
  const interactionManagerContext = writable()
  setContext(key, interactionManagerContext)

  return interactionManagerContext
}

export function update (interactionManagerContext, interactionManager) {
  interactionManagerContext.set(interactionManager)
}

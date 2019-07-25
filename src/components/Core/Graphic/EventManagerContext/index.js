import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

const key = {}

export function subscribe () {
  return getContext(key)
}

export function init () {
  const eventManagerContext = writable()
  setContext(key, eventManagerContext)

  return eventManagerContext
}

export function update (eventManagerContext, eventManager) {
  eventManagerContext.set(eventManager)
}

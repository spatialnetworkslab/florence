import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'
import { createSectionContext } from './createSectionContext'

const key = {}

export function subscribe () {
  return getContext(key)
}

export function init () {
  const sectionContext = writable()
  setContext(key, sectionContext)

  return sectionContext
}

export function update (sectionContext, options) {
  sectionContext.set(createSectionContext(options))
}

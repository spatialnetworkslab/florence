import DataContainer from './packages/DataContainer.js'
import florence from './packages/florence.js'

export const preloadable = {
  DataContainer,
  florence
}

export { default as REPL } from './repl/REPL.svelte'
export { default as preloadPackages } from './preload/preloadPackages.js'

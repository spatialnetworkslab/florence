import preloadPackages from '@snlab/florence-repl/src/preload/preloadPackages'

import florence from '@snlab/florence-repl/src/packages/florence'
import DataContainer from '@snlab/florence-repl/src/packages/DataContainer'

let preloadedPackages

export async function preload () {
  /* eslint-disable-next-line */
  preloadedPackages = await preloadPackages([florence, DataContainer])
}

export function getPreloadedPackages () {
  return preloadedPackages
}

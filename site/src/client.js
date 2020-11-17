import * as sapper from '@sapper/app'
import { preload } from './preloadPackages.js'

(async function () {
  await preload()

  sapper.start({
    target: document.querySelector('#sapper')
  })
})()

<script>
  import { getContext, setContext, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import { coordinateContextKey } from '../../contextKeys.js'
  import CoordinateContext from '../../../classes/CoordinateContext'
  import { generatePixelCoordinates } from '../../../rendering/rectangle'

  export let x = undefined
  export let w = undefined
  export let y = undefined
  export let h = undefined

  export let scaleX = undefined
  export let scaleY = undefined

  let parentCoordinateContext

  const unsubscribe = getContext(coordinateContextKey).subscribe(coordinateContext => {
    parentCoordinateContext = coordinateContext
  })

  const coordinates = { x, w, y, h }
  const pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)

  const rangeX = [pixelCoordinates.x, pixelCoordinates.x + pixelCoordinates.w]
  const rangeY = [pixelCoordinates.y, pixelCoordinates.y + pixelCoordinates.h]

  const coordinateContext = writable(new CoordinateContext({ rangeX, rangeY, scaleX, scaleY }))
  
  setContext(coordinateContextKey, coordinateContext)

  $: {
    if (parentCoordinateContext) {
      coordinateContext.set(new CoordinateContext({ rangeX, rangeY, scaleX, scaleY }))
    }
  }

  onDestroy(unsubscribe)
</script>

<g>
  <slot />
</g>
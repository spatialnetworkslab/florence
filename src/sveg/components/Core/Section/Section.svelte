<script>
  import { getContext, setContext, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import { coordinateContextKey } from '../../contextKeys.js'
  import CoordinateContext from '../../../classes/CoordinateContext'
  import { generatePixelCoordinates } from '../../../rendering/rectangle'

  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  export let scaleX = undefined
  export let scaleY = undefined

  let parentCoordinateContext

  const unsubscribe = getContext(coordinateContextKey).subscribe(coordinateContext => {
    parentCoordinateContext = coordinateContext
  })

  $: coordinates = { x1, x2, y1, y2 }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, parentCoordinateContext)

  $: rangeX = [pixelCoordinates.x1, pixelCoordinates.x2]
  $: rangeY = [pixelCoordinates.y1, pixelCoordinates.y2]

  const coordinateContext = writable()
  
  setContext(coordinateContextKey, coordinateContext)

  $: {
    coordinateContext.set(new CoordinateContext({ rangeX, rangeY, scaleX, scaleY }))
  }

  onDestroy(unsubscribe)
</script>

<g>
  <slot />
</g>
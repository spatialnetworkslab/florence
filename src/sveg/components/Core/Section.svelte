<script>
  import { getContext, setContext, onDestroy } from 'svelte'
  import { writable } from 'svelte/store'
  import { coordinateContextKey } from '../contextKeys.js'
  import CoordinateContext from '../../classes/CoordinateContext'
  import { generatePixelCoordinates } from '../Marks/Rectangle/generatePoints.js'

  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let scaleX = undefined
  export let scaleY = undefined

  let coordinateContext

  const unsubscribeCoordinateContext = getContext(coordinateContextKey)
    .subscribe(ctx => {
    coordinateContext = ctx
  })

  $: coordinates = { x1, x2, y1, y2 }
  $: pixelCoordinates = generatePixelCoordinates(coordinates, coordinateContext)

  $: rangeX = [pixelCoordinates.x1, pixelCoordinates.x2]
  $: rangeY = [pixelCoordinates.y1, pixelCoordinates.y2]

  const newCoordinateContext = writable()
  
  setContext(coordinateContextKey, newCoordinateContext)

  $: {
    newCoordinateContext.set(new CoordinateContext({ rangeX, rangeY, scaleX, scaleY }))
  }

  onDestroy(unsubscribeCoordinateContext)
</script>

<g>
  <slot />
</g>
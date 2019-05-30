<script>
  import { getContext, onDestroy } from 'svelte'
  import { coordinateContextKey, transformationContextKey } from '../contextKeys.js'
  import { generatePixelCoordinates, generatePath } from '../../rendering/rectangle'

  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  let coordinateContext

  const unsubscribeCoordinateContext = getContext(coordinateContextKey)
    .subscribe(ctx => {
    coordinateContext = ctx
  })

  $: coordinates = { x1, x2, y1, y2 }
  $: pixelCoordinates = generatePixelCoordinates(
    coordinates, 
    coordinateContext
  )
  $: path = generatePath(pixelCoordinates)

  onDestroy(unsubscribeCoordinateContext)
</script>

<path d={path} />

<script>
  import { getContext, onDestroy } from 'svelte'
  import { coordinateContextKey, transformationContextKey } from '../contextKeys.js'
  import { generatePixelCoordinates, generatePath } from '../../rendering/rectangle'

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  // Contexts
  let coordinateContext
  let transformationContext // TODO

  const unsubscribeCoordinateContext = getContext(coordinateContextKey)
    .subscribe(ctx => {
    coordinateContext = ctx
  })

  $: coordinates = { x1, x2, y1, y2 }
  $: pixelCoordinates = generatePixelCoordinates(
    coordinates, 
    coordinateContext
  )

  // SVG specific
  $: path = generatePath(pixelCoordinates)

  onDestroy(unsubscribeCoordinateContext)
</script>

<path d={path} />

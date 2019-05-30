<script>
  import { getContext, onDestroy } from 'svelte'
  import { coordinateContextKey, transformationContextKey } from '../contextKeys.js'
  import { generatePixelCoordinates } from '../../rendering/point'

  export let x
  export let y
  export let radius = 3
  export let fill = 'black'

  let coordinateContext

  const unsubscribeCoordinateContext = getContext(coordinateContextKey)
    .subscribe(ctx => {
    coordinateContext = ctx
  })

  $: coordinates = { x, y }
  $: pixelCoordinates = generatePixelCoordinates(
    coordinates, 
    coordinateContext
  )

  $: cx = pixelCoordinates.x
  $: cy = pixelCoordinates.y

  onDestroy(unsubscribeCoordinateContext)
</script>

<circle {cx} {cy} r={radius} {fill} />
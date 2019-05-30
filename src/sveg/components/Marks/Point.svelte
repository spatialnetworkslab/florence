<script>
  import { getContext, onDestroy } from 'svelte'
  import { coordinateContextKey, transformationContextKey } from '../contextKeys.js'
  import { generatePixelCoordinates } from '../../rendering/point'

  // Props
  export let x
  export let y
  export let radius = 3
  export let fill = 'black'

  // Contexts
  let coordinateContext
  let transformationContext

  const unsubscribeCoordinateContext = getContext(coordinateContextKey)
    .subscribe(ctx => {
    coordinateContext = ctx
  })

  let unsubscribeTransformationContext

  if (getContext(transformationContextKey)) {
    unsubscribeTransformationContext = getContext(transformationContextKey)
      .subscribe(ctx => {
        transformationContext = ctx
    })
  }

  // Pixel coordinates
  $: pixelCoordinates = generatePixelCoordinates(
    { x, y }, 
    coordinateContext,
    transformationContext
  )

  // SVG specific
  $: cx = pixelCoordinates[0]
  $: cy = pixelCoordinates[1]

  onDestroy(() => {
    unsubscribeCoordinateContext()
    unsubscribeTransformationContext()
  })
</script>

<circle {cx} {cy} r={radius} {fill} />
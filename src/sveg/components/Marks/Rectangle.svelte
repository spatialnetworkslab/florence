<script>
  import { getContext, onDestroy } from 'svelte'
  import { coordinateContextKey, transformationContextKey } from '../contextKeys.js'
  import { generatePoints, generatePath } from '../../rendering/rectangle'

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
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
  $: points = generatePoints(
    { x1, x2, y1, y2 }, 
    coordinateContext,
    transformationContext
  )

  // SVG specific
  $: path = generatePath(points)

  onDestroy(() => {
    unsubscribeCoordinateContext()
    unsubscribeTransformationContext()
  })
</script>

<path d={path} {fill} />

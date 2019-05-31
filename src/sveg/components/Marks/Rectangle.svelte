<script>
  import { getContext, onDestroy } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import _interpolatePath from 'd3-interpolate-path'

  const { interpolatePath } = _interpolatePath

  import { coordinateContextKey, transformationContextKey } from '../contextKeys.js'
  import { generatePoints, generatePath } from '../../rendering/rectangle'

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let fill = 'black'
  export let transition = undefined

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
  let points = generatePoints(
    { x1, x2, y1, y2 }, 
    coordinateContext,
    transformationContext
  )

  // SVG specific
  let path = tweened(generatePath(points), {
    duration: 1000,
    easing: cubicOut,
    interpolate: interpolatePath
  })

  $: {
    if (transition) {
      let points = generatePoints(
        { x1, x2, y1, y2 }, 
        coordinateContext,
        transformationContext
      )

      path.set(generatePath(points))
    }
  }

  onDestroy(() => {
    unsubscribeCoordinateContext()
    unsubscribeTransformationContext()
  })
</script>

<path d={$path} {fill} />

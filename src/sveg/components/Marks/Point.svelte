<script>
  import { getContext, onDestroy } from 'svelte'
  import { coordinateContextKey, transformationContextKey } from '../contextKeys.js'
  import { generateCoordinates } from '../../rendering/point'

  // Props
  export let x
  export let y
  export let radius = 3
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
  $: coordinates = generateCoordinates(
    { x, y }, 
    coordinateContext,
    transformationContext
  )

  // Transition logic
  if (transition) {
    if (!transition.constructor === Number) throw new Error('Transition must be number')


  }

  // SVG specific
  $: cx = coordinates[0]
  $: cy = coordinates[1]

  // Cleanup
  onDestroy(() => {
    unsubscribeCoordinateContext()
    unsubscribeTransformationContext()
  })
</script>

<circle {cx} {cy} r={radius} {fill} />
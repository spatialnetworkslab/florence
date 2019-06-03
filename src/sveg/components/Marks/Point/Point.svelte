<script>
  import { getContext, onDestroy } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { coordinateContextKey, transformationContextKey } from '../contextKeys.js'
  import { generateCoordinates } from './generateCoordinates.js'

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
  let coordinates = generateCoordinates(
    { x, y }, 
    coordinateContext,
    transformationContext
  )

  // SVG specific
  const cx = tweened(coordinates[0], {
    duration: 1000,
    easing: cubicOut
  })
  const cy = tweened(coordinates[1], {
    duration: 1000,
    easing: cubicOut
  })

  $: {
    if (transition) {
      let coordinates = generateCoordinates(
        { x, y }, 
        coordinateContext,
        transformationContext
      )

      cx.set(coordinates[0])
      cy.set(coordinates[1])
    }
  }

  // Cleanup
  onDestroy(() => {
    unsubscribeCoordinateContext()
    unsubscribeTransformationContext()
  })
</script>

<circle cx={$cx} cy={$cy} r={radius} {fill} />
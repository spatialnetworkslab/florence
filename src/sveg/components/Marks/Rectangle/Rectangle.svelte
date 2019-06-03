<script>
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import d3interpolatePath from 'd3-interpolate-path'
  const interpolatePath = d3interpolatePath.interpolatePath

  import * as SectionContext from '../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../Core/CoordinateTransformation/CoordinateTransformationContext'
  import generatePoints from '/generatePoints.js'
  import generatePath from './generatePath.js'

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let fill = 'black'
  export let transition = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()

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
</script>

<path d={$path} {fill} />

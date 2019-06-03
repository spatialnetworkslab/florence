<script>
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  import generateCoordinates from './generateCoordinates.js'

  // Props
  export let x
  export let y
  export let radius = 3
  export let fill = 'black'
  export let transition = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()

  // Pixel coordinates
  let coordinates = generateCoordinates(
    { x, y }, 
    $sectionContext,
    $coordinateTransformationContext
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
        $sectionContext,
        $coordinateTransformationContext
      )

      cx.set(coordinates[0])
      cy.set(coordinates[1])
    }
  }
</script>

<circle cx={$cx} cy={$cy} r={radius} {fill} />
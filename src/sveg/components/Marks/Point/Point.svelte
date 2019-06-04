<script>
  import { beforeUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import scaleCoordinates from './scaleCoordinates.js'
  import applyCoordinateTransformation from '../utils/applyCoordinateTransformation'

  import { createTransitionableAesthetic, createOptions } from './transitions.js'

  // Props
  export let x
  export let y
  export let radius = 3
  export let fill = 'black'
  export let transition = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()

  // Convert coordinates
  let scaledCoordinates = scaleCoordinates({ x, y }, $sectionContext)
  let transformedCoordinates = applyCoordinateTransformation(
    [scaledCoordinates.x, scaledCoordinates.y], $coordinateTransformationContext
  )

  // Aesthetics
  let aes_x = createTransitionableAesthetic('x', transformedCoordinates[0], transition)
  let aes_y = createTransitionableAesthetic('y', transformedCoordinates[1], transition)
  let aes_radius = createTransitionableAesthetic('radius', radius, transition)
  let aes_fill = createTransitionableAesthetic('fill', fill, transition)

  $: {
    let scaledCoordinates = scaleCoordinates({ x, y }, $sectionContext)
    let transformedCoordinates = applyCoordinateTransformation(
      [scaledCoordinates.x, scaledCoordinates.y], $coordinateTransformationContext
    )

    aes_x.set(transformedCoordinates[0])
    aes_y.set(transformedCoordinates[1])
  }

  $: {
    aes_radius.set(radius)
    aes_fill.set(fill)
  }

  beforeUpdate(() => {
    aes_x.update(_ => _, createOptions('x', transition))
    aes_y.update(_ => _, createOptions('y', transition))
    aes_radius.update(_ => _, createOptions('radius', transition))
    aes_fill.update(_ => _, createOptions('fill', transition))
  })
</script>

{#if $graphicContext.output() === 'svg'}

  <circle 
    cx={$aes_x} 
    cy={$aes_y} 
    r={$aes_radius} 
    fill={$aes_fill} 
  />

{/if}
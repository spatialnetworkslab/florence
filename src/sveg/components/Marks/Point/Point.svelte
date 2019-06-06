<script>
  import { beforeUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import { generateCoordinates } from './generateCoordinates.js'
  import { createTransitionableAesthetic, createOptions } from '../utils/transitions'

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
  let coordinates = generateCoordinates({ x, y }, $sectionContext, $coordinateTransformationContext)

  // Aesthetics
  let aes_x = createTransitionableAesthetic('x', coordinates[0], transition)
  let aes_y = createTransitionableAesthetic('y', coordinates[1], transition)
  let aes_radius = createTransitionableAesthetic('radius', radius, transition)
  let aes_fill = createTransitionableAesthetic('fill', fill, transition)

  $: {
    let coordinates = generateCoordinates({ x, y }, $sectionContext, $coordinateTransformationContext)

    aes_x.set(coordinates[0])
    aes_y.set(coordinates[1])
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
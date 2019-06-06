<script>
  import { beforeUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import { generateCoordinates } from './generateCoordinates.js'
  import applyCoordinateTransformation from '../utils/applyCoordinateTransformation'
  import { createTransitionableAesthetic, transitionsEqual } from '../utils/transitions'
  import generatePath from '../utils/generatePath.js'

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let fill = 'black'
  export let transition = undefined
  export let interpolate = true

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()

  // Convert coordinates
  let coordinates = generateCoordinates(
    { x1, x2, y1, y2 },
    $sectionContext,
    $coordinateTransformationContext,
    interpolate
  )

  // Aesthetics
  let aes_coordinates = createTransitionableAesthetic('coordinates', coordinates, transition)
  let aes_fill = createTransitionableAesthetic('fill', fill, transition)

  $: {
    let coordinates = generateCoordinates(
      { x1, x2, y1, y2 },
      $sectionContext,
      $coordinateTransformationContext,
      interpolate
    )

    aes_coordinates.set(coordinates)
  }

  $: { aes_fill.set(fill) }

  let previousTransition

  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      aes_coordinates = createTransitionableAesthetic('coordinates', $aes_coordinates, transition)
      aes_fill = createTransitionableAesthetic('fill', $aes_fill, transition)
    }
  })
</script>

{#if $graphicContext.output() === 'svg'}

  <path 
    d={generatePath($aes_coordinates)} 
    fill={$aes_fill} 
  />

{/if}
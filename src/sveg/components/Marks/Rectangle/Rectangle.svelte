<script>
  import { beforeUpdate, afterUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import { generateCoordinates } from './generateCoordinates.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'
  import generatePath from '../utils/generatePath.js'

  let initPhase = true
  const initDone = () => !initPhase

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let fill = 'black'
  export let opacity = 1
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

  // Create transitionables
  let tr_coordinates = createTransitionable('coordinates', coordinates, transition)
  let tr_fill = createTransitionable('fill', fill, transition)
  let tr_opacity = createTransitionable('opacity', opacity, transition)

  $: {
    if (initDone()) {
      let coordinates = generateCoordinates(
        { x1, x2, y1, y2 },
        $sectionContext,
        $coordinateTransformationContext,
        interpolate
      )

      tr_coordinates.set(coordinates)
    }
  }

  $: { if (initDone()) tr_fill.set(fill) }
  $: { if (initDone()) tr_opacity.set(opacity) }

  let previousTransition

  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_coordinates = createTransitionable('coordinates', $tr_coordinates, transition)
      tr_fill = createTransitionable('fill', $tr_fill, transition)
      tr_opacity = createTransitionable('opacity', $tr_opacity, transition)
    }
  })

  afterUpdate(() => {
    initPhase = false
  })
</script>

{#if $graphicContext.output() === 'svg'}

  <path 
    d={generatePath($tr_coordinates)} 
    fill={$tr_fill}
    style={`opacity: ${$tr_opacity}`}
  />

{/if}
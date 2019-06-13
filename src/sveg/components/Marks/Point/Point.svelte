<script context="module">
  let idCounter = -1
  function getId () {
    return 'pt' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  
  import { generateCoordinates } from './generateCoordinates.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'

  let id = getId()

  let initPhase = true
  const initDone = () => !initPhase

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

  // Create transitionables
  let tr_x = createTransitionable('x', coordinates[0], transition)
  let tr_y = createTransitionable('y', coordinates[1], transition)
  let tr_radius = createTransitionable('radius', radius, transition)
  let tr_fill = createTransitionable('fill', fill, transition)

  $: {
    if (initDone()) {
      let coordinates = generateCoordinates({ x, y }, $sectionContext, $coordinateTransformationContext)
      tr_x.set(coordinates[0])
      tr_y.set(coordinates[1])
    }
  }

  $: { if (initDone()) tr_radius.set(radius) }
  $: { if (initDone()) tr_fill.set(fill) }

  let previousTransition

  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_x = createTransitionable('x', $tr_x, transition)
      tr_y = createTransitionable('y', $tr_y, transition)
      tr_radius = createTransitionable('radius', $tr_radius, transition)
      tr_fill = createTransitionable('fill', $tr_fill, transition)
    }
  })

  afterUpdate(() => {
    initPhase = false
  })
</script>

{#if $graphicContext.output() === 'svg'}

  <circle 
    cx={$tr_x} 
    cy={$tr_y} 
    r={$tr_radius} 
    fill={$tr_fill} 
  />

{/if}
<script>
<<<<<<< HEAD
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'
  
  import { transformGeometry } from 'geometryUtils'
  import generateScreenGeometry from './generateScreenGeometry.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'

  let markId = getId()
=======
  import Mark from '../Mark/Mark.svelte'
>>>>>>> dce9377a55a6a8857144259233e6558678791518

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

  // Aesthetics: other
  export let radius = undefined
  export let fill = undefined
  export let opacity = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
<<<<<<< HEAD

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  // Create screenGeometry
  let unzoomedSceenGeometry = generateScreenGeometry(
    { x, y, geometry }, $sectionContext, $coordinateTransformationContext
  )
  let screenGeometry

  // Initiate transitionables
  let tr_screenGeometry = createTransitionable('geometry', getZoomedScreenGeometry(), transition)
  let tr_radius = createTransitionable('radius', radius, transition)
  let tr_fill = createTransitionable('fill', fill, transition)

  // Handle zooming
  $: {
    if ($zoomContext) {
      tr_screenGeometry.set(getZoomedScreenGeometry())
    }
  }

  // Handle screenGeometry transitions
  $: {
    if (initDone()) {
      unzoomedSceenGeometry = generateScreenGeometry(
        { x, y, geometry }, $sectionContext, $coordinateTransformationContext
      )

      tr_screenGeometry.set(getZoomedScreenGeometry())
      tr_radius.set(radius)

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other transitions
  $: { if (initDone()) tr_fill.set(fill) }

  let previousTransition

  // Update transitionables
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometry = createTransitionable('geometry', $tr_screenGeometry, transition)
      tr_radius = createTransitionable('radius', $tr_radius, transition)
      tr_fill = createTransitionable('fill', $tr_fill, transition)
    }
  })

  afterUpdate(() => {
    initPhase = false
  })

  // Interactivity
  $: isInteractive = onClick !== undefined || onMouseover !== undefined || onMouseout !== undefined

  onMount(() => {
    updateInteractionManagerIfNecessary()
  })

  onDestroy(() => {
    removeMarkFromSpatialIndexIfNecessary()
  })

  // Helpers
  function getZoomedScreenGeometry () {
    if ($zoomContext) {
      screenGeometry = transformGeometry(unzoomedSceenGeometry, $zoomContext)
    } else {
      screenGeometry = unzoomedSceenGeometry
    }

    return screenGeometry
  }

  function updateInteractionManagerIfNecessary () {
    removeMarkFromSpatialIndexIfNecessary()

    if (isInteractive) {
      $interactionManagerContext.loadMark('Point', createMarkData())

      if (onClick) $interactionManagerContext.addMarkInteraction('click', markId, onClick)
      if (onMouseover) $interactionManagerContext.addMarkInteraction('mouseover', markId, onMouseover)
      if (onMouseout) $interactionManagerContext.addMarkInteraction('mouseout', markId, onMouseout)
    }
  }

  function removeMarkFromSpatialIndexIfNecessary () {
    if ($interactionManagerContext.markIsLoaded(markId)) {
      $interactionManagerContext.removeAllMarkInteractions(markId)
      $interactionManagerContext.removeMark(markId)
    }
  }

  function createMarkData () {
    return {
      attributes: { screenGeometry, radius },
      markId
    }
  }
=======
>>>>>>> dce9377a55a6a8857144259233e6558678791518
</script>

<Mark
  type="Point"
  {x} {y} {geometry} {radius} 
  {fill} {opacity} 
  {transition} {onClick} {onMouseover} {onMouseout}
  _asPolygon={false}
/>
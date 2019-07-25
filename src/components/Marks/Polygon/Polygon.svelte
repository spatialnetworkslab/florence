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
  import generatePath from '../utils/generatePath.js'
=======
  import Mark from '../Mark/Mark.svelte'
>>>>>>> dce9377a55a6a8857144259233e6558678791518

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

  // Aesthetics: other
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
    { x, y, geometry },
    $sectionContext,
    $coordinateTransformationContext,
    interpolate
  )
  let screenGeometry

  // Initiate transitionables
  let tr_screenGeometry = createTransitionable('geometry', getZoomedScreenGeometry(), transition)
  let tr_fill = createTransitionable('fill', fill, transition)
  let tr_opacity = createTransitionable('opacity', opacity, transition)

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
        { x, y, geometry },
        $sectionContext,
        $coordinateTransformationContext,
        interpolate
      )

      tr_screenGeometry.set(getZoomedScreenGeometry())

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other transitions
  $: { if (initDone()) tr_fill.set(fill) }
  $: { if (initDone()) tr_opacity.set(opacity) }

  let previousTransition

  // Update transitionables
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometry = createTransitionable('geometry', $tr_screenGeometry, transition)
      tr_fill = createTransitionable('fill', $tr_fill, transition)
      tr_opacity = createTransitionable('opacity', $tr_opacity, transition)
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
    removeLayerFromSpatialIndexIfNecessary()
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
    removeLayerFromSpatialIndexIfNecessary()

    if (isInteractive) {
      $interactionManagerContext.loadMark('Polygon', createMarkData())

      if (onClick) $interactionManagerContext.addMarkInteraction('click', markId, onClick)
      if (onMouseover) $interactionManagerContext.addMarkInteraction('mouseover', markId, onMouseover)
      if (onMouseout) $interactionManagerContext.addMarkInteraction('mouseout', markId, onMouseout)
    }
  }

  function removeLayerFromSpatialIndexIfNecessary () {
    if ($interactionManagerContext.markIsLoaded(markId)) {
      $interactionManagerContext.removeAllMarkInteractions(markId)
      $interactionManagerContext.removeMark(markId)
    }
  }

  function createMarkData () {
    return {
      attributes: { screenGeometry },
      markId
    }
  }
=======
  // Other
  export let interpolate = false
>>>>>>> dce9377a55a6a8857144259233e6558678791518
</script>

<Mark
  type="Polygon"
  {x} {y} {geometry}
  {fill} {opacity}
  {transition} {onClick} {onMouseover} {onMouseout}
  {interpolate}
/>
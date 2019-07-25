<script>
<<<<<<< HEAD
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'
  
  import { transformGeometries } from 'geometryUtils'
  import generateScreenGeometryObject from './generateScreenGeometryObject.js'
  import { createTransitionableLayer, transitionsEqual } from '../utils/transitions'
  import { generatePropObject } from '../utils/generatePropObject.js'
  import generatePath from '../utils/generatePath.js'

  let layerId = getId()

  let initPhase = true
  const initDone = () => !initPhase
=======
  import Layer from '../Mark/Layer.svelte'
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

  // Generate screenGeometryObject and index array
  let _ = generateScreenGeometryObject(
    { x, y, geometry },
    $sectionContext,
    $coordinateTransformationContext,
    interpolate,
    index
  )
  let indexArray = _.indexArray
  let unzoomedScreenGeometryObject = _.screenGeometryObject
  let screenGeometryObject

  // Generate other prop arrays
  let fillObject = generatePropObject(fill, indexArray)
  let opacityObject = generatePropObject(opacity, indexArray)

  // Initiate transitionables
  let tr_screenGeometryObject = createTransitionableLayer('geometry', getZoomedScreenGeometryObject(), transition)
  let tr_fillObject = createTransitionableLayer('fill', fillObject, transition)
  let tr_opacityObject = createTransitionableLayer('opacity', opacityObject, transition)

  // Handle zooming
  $: {
    if ($zoomContext) {
      tr_screenGeometryObject.set(getZoomedScreenGeometryObject())
    }
  }

  // Handle coordinate/geometry prop transitions
  $: {
    if (initDone()) {
      let _ = generateScreenGeometryObject(
        { x, y, geometry },
        $sectionContext,
        $coordinateTransformationContext,
        interpolate,
        index
      )

      indexArray = _.indexArray
      unzoomedScreenGeometryObject = _.screenGeometryObject

      tr_screenGeometryObject.set(getZoomedScreenGeometryObject())

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other prop transitions
  $: { if (initDone()) tr_fillObject.set(generatePropObject(fill, indexArray)) }
  $: { if (initDone()) tr_opacityObject.set(generatePropObject(opacity, indexArray)) }

  let previousTransition

  // Update transition parameters
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometryObject = createTransitionableLayer('geometry', $tr_screenGeometryObject, transition)
      tr_fillObject = createTransitionableLayer('fill', $tr_fillObject, transition)
      tr_opacityObject = createTransitionableLayer('opacity', $tr_opacityObject, transition)
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
  function getZoomedScreenGeometryObject () {
    if ($zoomContext) {
      screenGeometryObject = transformGeometries(unzoomedScreenGeometryObject, $zoomContext)
    } else {
      screenGeometryObject = unzoomedScreenGeometryObject
    }

    return screenGeometryObject
  }

  function updateInteractionManagerIfNecessary () {
    removeLayerFromSpatialIndexIfNecessary()

    if (isInteractive) {
      $interactionManagerContext.loadLayer('Polygon', createLayerData())

      if (onClick) $interactionManagerContext.addLayerInteraction('click', layerId, onClick)
      if (onMouseover) $interactionManagerContext.addLayerInteraction('mouseover', layerId, onMouseover)
      if (onMouseout) $interactionManagerContext.addLayerInteraction('mouseout', layerId, onMouseout)
    }
  }

  function removeLayerFromSpatialIndexIfNecessary () {
    if ($interactionManagerContext.layerIsLoaded(layerId)) {
      $interactionManagerContext.removeAllLayerInteractions(layerId)
      $interactionManagerContext.removeLayer(layerId)
    }
  }

  function createLayerData () {
    return {
      layerAttributes: { screenGeometryObject },
      layerId,
      indexArray
    }
  }
=======
  // Other
  export let interpolate = false
  export let index = undefined
>>>>>>> dce9377a55a6a8857144259233e6558678791518
</script>

<Layer 
  type="Polygon"
  {x} {y} {geometry}
  {fill} {opacity}
  {transition} {onClick} {onMouseover} {onMouseout}
  {index} {interpolate}
/>
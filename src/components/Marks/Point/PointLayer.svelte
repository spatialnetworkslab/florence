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

  // Generate screenGeometryObject and index array
  let _ = generateScreenGeometryObject(
    { x, y, geometry }, 
    $sectionContext,
    $coordinateTransformationContext,
    index
  )
  let indexArray = _.indexArray
  let unzoomedScreenGeometryObject = _.screenGeometryObject
  let screenGeometryObject

  // Generate other prop objects
  let radiusObject = generatePropObject(radius, indexArray)
  let fillObject = generatePropObject(fill, indexArray)

  // Initiate transitionables
  let tr_screenGeometryObject = createTransitionableLayer('geometry', getZoomedScreenGeometryObject(), transition)
  let tr_radiusObject = createTransitionableLayer('radius', radiusObject, transition)
  let tr_fillObject = createTransitionableLayer('fill', fillObject, transition)

  // Handle zooming
  $: {
    if ($zoomContext) {
      tr_screenGeometryObject.set(getZoomedScreenGeometryObject())
    }
  }

  // Handle screenGeometryObject transitions
  $: {
    if (initDone()) {
      _ = generateScreenGeometryObject(
        { x, y, geometry }, 
        $sectionContext,
        $coordinateTransformationContext,
        index
      )
      
      indexArray = _.indexArray
      unzoomedScreenGeometryObject = _.screenGeometryObject

      radiusObject = generatePropObject(radius, indexArray)

      tr_screenGeometryObject.set(getZoomedScreenGeometryObject())
      tr_radiusObject.set(radiusObject)

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other transitions
  $: { if (initDone()) tr_fillObject.set(generatePropObject(fill, indexArray)) }

  let previousTransition

  // Update transitionables
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometryObject = createTransitionableLayer('geometry', $tr_screenGeometryObject, transition)
      tr_radiusObject = createTransitionableLayer('radius', $tr_radiusObject, transition)
      tr_fillObject = createTransitionableLayer('fill', $tr_fillObject, transition)
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
      $interactionManagerContext.loadLayer('Point', createLayerData())

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
      layerAttributes: { screenGeometryObject, radiusObject },
      layerId,
      indexArray
    }
  }
=======
  // Other
  export let index = undefined
>>>>>>> dce9377a55a6a8857144259233e6558678791518
</script>

<Layer 
  type="Point"
  {x} {y} {geometry} {radius}
  {fill} {opacity}
  {transition} {onClick} {onMouseover} {onMouseout}
  {index} _asPolygon={false}
/>
<script context="module">
  let idCounter = 0
  function getId () {
    return 'layer' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/CoordinateTransformation/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'
  
  import validateAesthetics from './validateAesthetics.js'
  import { transformGeometries } from '../../../utils/geometryUtils/index.js'
  import { layerCoordSysGeometryFuncs } from './coordSysGeometryFuncs.js'
  import { layerRepresentAsPolygonFuncs } from './representAsPolygonFuncs.js'
  import { createTransitionableLayer, transitionsEqual } from '../utils/transitions'
  import { generatePropObject } from '../utils/generatePropObject.js'
  import { createDataNecessaryForIndexingLayer } from './createDataNecessaryForIndexing.js'
  import generatePath from '../utils/generatePath.js'
  import textAnchorPoint from '../utils/textAnchorPoint.js'

  let layerId = getId()

  let initPhase = true
  const initDone = () => !initPhase

  export let type

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let geometry = undefined

  // Aesthetics: other
  export let radius = undefined
  export let fill = undefined
  export let stroke = undefined
  export let strokeWidth = undefined
  export let strokeOpacity = undefined
  export let fillOpacity = undefined
  export let opacity = undefined

  // Aesthetics: text-specific
  export let text = undefined
  export let fontFamily = undefined
  export let fontSize = undefined
  export let fontWeight = undefined
  export let rotation = undefined
  export let anchorPoint = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Other
  export let index = undefined
  export let interpolate = undefined
  export let _asPolygon = true

  // Validate aesthetics every time input changes
  let aesthetics = validateAesthetics(
    type,
    {
      x, y, x1, x2, y1, y2, geometry, 
      radius, fill, stroke, strokeWidth, strokeOpacity,
      fillOpacity, opacity,
      text, fontFamily, fontSize, fontWeight, rotation, anchorPoint 
    }
  )
  $: {
    if (initDone()) {
      aesthetics = validateAesthetics(
        type,
        {
          x, y, x1, x2, y1, y2, geometry, 
          radius, fill, stroke, strokeWidth, strokeOpacity,
          fillOpacity, opacity,
          text, fontFamily, fontSize, fontWeight, rotation, anchorPoint 
        }
      )
    }
  }

  // Create 'positioning' aesthetics object
  let positioningAesthetics = { x, y, x1, x2, y1, y2, geometry }
  $: {
    if (initDone()) {
      positioningAesthetics = { x, y, x1, x2, y1, y2, geometry }
    }
  }

  // Select appriopriate geometry conversion functions
  let createCoordSysGeometryObject = layerCoordSysGeometryFuncs[type]
  let representAsPolygonObject = layerRepresentAsPolygonFuncs[type]

  $: {
    if (initDone()) {
      createCoordSysGeometryObject = layerCoordSysGeometryFuncs[type]
      representAsPolygonObject = layerRepresentAsPolygonFuncs[type]
    }
  }

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  // Initiate geometry objects and index array
  let coordSysGeometryObject
  let pixelGeometryObject
  let screenGeometryObject

  updateCoordSysGeometryObject()
  updatePixelGeometryObject()
  
  let indexArray = Object.keys(coordSysGeometryObject)

  // Generate other prop objects
  let radiusObject = generatePropObject(aesthetics.radius, indexArray)
  let fillObject = generatePropObject(aesthetics.fill, indexArray)
  let strokeObject = generatePropObject(aesthetics.stroke, indexArray)
  let strokeWidthObject = generatePropObject(aesthetics.strokeWidth, indexArray)
  let strokeOpacityObject = generatePropObject(aesthetics.strokeOpacity, indexArray)
  let fillOpacityObject = generatePropObject(aesthetics.fillOpacity, indexArray)
  let opacityObject = generatePropObject(aesthetics.opacity, indexArray)
  let textObject = generatePropObject(aesthetics.text, indexArray)
  let fontFamilyObject = generatePropObject(aesthetics.fontFamily, indexArray)
  let fontSizeObject = generatePropObject(aesthetics.fontSize, indexArray)
  let fontWeightObject = generatePropObject(aesthetics.fontWeight, indexArray)
  let rotationObject = generatePropObject(aesthetics.rotation, indexArray)
  let anchorPointObject = generatePropObject(aesthetics.anchorPoint, indexArray)


  // This uses the radiusObject/strokeWidthObject in some cases, so must be done after the prop objects
  updateScreenGeometryObject()

  // Initiate transitionables
  let tr_screenGeometryObject = createTransitionableLayer('geometry', screenGeometryObject, transition)
  let tr_radiusObject = createTransitionableLayer('radius', radiusObject, transition)
  let tr_fillObject = createTransitionableLayer('fill', fillObject, transition)
  let tr_strokeObject = createTransitionableLayer('stroke', strokeObject, transition)
  let tr_strokeWidthObject = createTransitionableLayer('strokeWidth', strokeWidthObject, transition)
  let tr_strokeOpacityObject = createTransitionableLayer('strokeOpacity', strokeOpacityObject, transition)
  let tr_fillOpacityObject = createTransitionableLayer('fillOpacity', fillOpacityObject, transition)
  let tr_opacityObject = createTransitionableLayer('opacity', opacityObject, transition)

  // text transtitionables
  let tr_fontSizeObject = createTransitionableLayer('fontSize', fontSizeObject, transition)
  let tr_fontWeightObject = createTransitionableLayer('fontWeight', fontWeightObject, transition)
  let tr_rotationObject = createTransitionableLayer('rotation', rotationObject, transition)

  // Handle coordSysGeometryObject changes
  $: {
    if (initDone()) {
      scheduleUpdateCoordSysGeometryObject(
        positioningAesthetics, 
        $sectionContext,
        $coordinateTransformationContext,
        index,
        interpolate
      )
    }
  }

  // Handle zooming changes
  $: {
    if (initDone()) {
      scheduleUpdatePixelGeometryObject($zoomContext)
    }
  }

  // Handle radius/strokeWidth changes
  $: {
    if (initDone()) {
      radiusObject = generatePropObject(aesthetics.radius, indexArray)
      strokeWidthObject = generatePropObject(aesthetics.strokeWidth, indexArray)

      if (!_asPolygon) {
        tr_radiusObject.set(radiusObject)
        tr_strokeWidthObject.set(strokeWidthObject)
      }

      if (_asPolygon) {
        scheduleUpdateScreenGeometryObject()
      }
    }
  }

  // Handle other changes
  $: { if (initDone()) tr_fillObject.set(generatePropObject(aesthetics.fill, indexArray)) }
  $: { if (initDone()) tr_strokeObject.set(generatePropObject(aesthetics.stroke, indexArray)) }
  $: { if (initDone()) tr_strokeOpacityObject.set(generatePropObject(aesthetics.strokeOpacity, indexArray)) }
  $: { if (initDone()) tr_fillOpacityObject.set(generatePropObject(aesthetics.fillOpacity, indexArray)) }
  $: { if (initDone()) tr_opacityObject.set(generatePropObject(aesthetics.opacity, indexArray)) }

  // text aes changes
  $: { if (initDone()) tr_fontSizeObject.set(generatePropObject(aesthetics.fontSize, indexArray)) }
  $: { if (initDone()) tr_fontWeightObject.set(generatePropObject(aesthetics.fontWeight, indexArray)) }
  $: { if (initDone()) tr_rotationObject.set(generatePropObject(aesthetics.rotation, indexArray)) }

  // non-transitionable aesthetics
  $: { if (initDone()) textObject = generatePropObject(aesthetics.text, indexArray)}
  $: { if (initDone()) fontFamilyObject = generatePropObject(aesthetics.fontFamily, indexArray)}
  $: { if (initDone()) anchorPointObject = generatePropObject(aesthetics.anchorPoint, indexArray)}

  let previousTransition

  let coordSysGeometryObjectRecalculationNecessary = false
  let pixelGeometryObjectRecalculationNecessary = false
  let screenGeometryObjectRecalculationNecessary = false

  $: {
    if (coordSysGeometryObjectRecalculationNecessary) {
      updateCoordSysGeometryObject()
      indexArray = Object.keys(coordSysGeometryObject)
    }
    
    if (pixelGeometryObjectRecalculationNecessary) updatePixelGeometryObject()

    if (screenGeometryObjectRecalculationNecessary) {
      updateScreenGeometryObject()
      updateScreenGeometryObjectTransitionable()

      updateInteractionManagerIfNecessary()
    }

    coordSysGeometryObjectRecalculationNecessary = false
    pixelGeometryObjectRecalculationNecessary = false
    screenGeometryObjectRecalculationNecessary = false
  }

  beforeUpdate(() => {
    // Update transitionables
    if (!transitionsEqual(previousTransition, transition) && initDone()) {
      tr_screenGeometryObject = createTransitionableLayer('geometry', $tr_screenGeometryObject, transition)
      tr_radiusObject = createTransitionableLayer('radius', $tr_radiusObject, transition)
      tr_fillObject = createTransitionableLayer('fill', $tr_fillObject, transition)
      tr_strokeObject = createTransitionableLayer('stroke', $tr_strokeObject, transition)
      tr_strokeWidthObject = createTransitionableLayer('strokeWidth', $tr_strokeWidthObject, transition)
      tr_strokeOpacityObject = createTransitionableLayer('strokeOpacity', $tr_strokeOpacityObject, transition)
      tr_fillOpacityObject = createTransitionableLayer('fillOpacity', $tr_fillOpacityObject, transition)
      tr_opacityObject = createTransitionableLayer('opacity', $tr_opacityObject, transition)

      tr_fontSizeObject = createTransitionableLayer('fontSize', $tr_fontSizeObject, transition)
      tr_fontWeightObject = createTransitionableLayer('fontWeight', $tr_fontWeightObject, transition)
      tr_rotationObject = createTransitionableLayer('rotation', $tr_rotationObject, transition)
    }

    previousTransition = transition
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
  function scheduleUpdateCoordSysGeometryObject () {
    coordSysGeometryObjectRecalculationNecessary = true
    pixelGeometryObjectRecalculationNecessary = true
    screenGeometryObjectRecalculationNecessary = true
  }

  function updateCoordSysGeometryObject () {
    coordSysGeometryObject = createCoordSysGeometryObject(
      positioningAesthetics, 
      $sectionContext,
      $coordinateTransformationContext,
      index,
      interpolate
    )
  }

  function scheduleUpdatePixelGeometryObject () {
    pixelGeometryObjectRecalculationNecessary = true
    screenGeometryObjectRecalculationNecessary = true
  }

  function updatePixelGeometryObject () {
    if ($zoomContext) {
      pixelGeometryObject = transformGeometries(coordSysGeometryObject, $zoomContext)
    } else {
      pixelGeometryObject = coordSysGeometryObject
    }
  }

  function scheduleUpdateScreenGeometryObject () {
    screenGeometryObjectRecalculationNecessary = true
  }

  function updateScreenGeometryObject () {
    if (_asPolygon) {
      // console.log(Object.keys(pixelGeometryObject))
      // console.log(Object.keys(radiusObject))

      screenGeometryObject = representAsPolygonObject(pixelGeometryObject, { radiusObject, strokeWidthObject })
    } else {
      screenGeometryObject = pixelGeometryObject
    }
  }

  function updateScreenGeometryObjectTransitionable () {
    tr_screenGeometryObject.set(screenGeometryObject)
  }

  function updateInteractionManagerIfNecessary () {
    removeLayerFromSpatialIndexIfNecessary()

    if (isInteractive) {
      $interactionManagerContext.loadLayer(type, createDataNecessaryForIndexing())

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

  function createDataNecessaryForIndexing () {
    return createDataNecessaryForIndexingLayer(
      type, layerId, indexArray, { pixelGeometryObject, screenGeometryObject }, { radiusObject, strokeWidthObject }
    )
  }

  $: renderPolygon = !['Point', 'Line', 'Label'].includes(type) || _asPolygon
  $: renderCircle = type === 'Point' && !_asPolygon
  $: renderLine = type === 'Line' && !_asPolygon
  $: renderLabel = type === 'Label'
</script>

{#if $graphicContext.output() === 'svg'}

  {#if renderPolygon}
    <g class={`${type.toLowerCase()}-layer`}>
      {#each Object.keys($tr_screenGeometryObject) as $index ($index)}

        <path
          class={type.toLowerCase()}
          d={generatePath($tr_screenGeometryObject[$index])}
          fill={$tr_fillObject[$index]}
          stroke={$tr_strokeObject[$index]}
          stroke-width={$tr_strokeWidthObject[$index]}
          fill-opacity={$tr_fillOpacityObject[$index]}
          stroke-opacity={$tr_strokeOpacityObject[$index]}
          opacity={$tr_opacityObject[$index]}
        />

      {/each}
    </g>

  {/if}

  {#if renderCircle}
    <g class="point-layer">
      {#each Object.keys($tr_screenGeometryObject) as $index ($index)}

        <circle
          class="point"
          cx={$tr_screenGeometryObject[$index].coordinates[0]}
          cy={$tr_screenGeometryObject[$index].coordinates[1]}
          r={$tr_radiusObject[$index]}
          fill={$tr_fillObject[$index]}
          stroke={$tr_strokeObject[$index]}
          stroke-width={$tr_strokeWidthObject[$index]}
          fill-opacity={$tr_fillOpacityObject[$index]}
          stroke-opacity={$tr_strokeOpacityObject[$index]}
          opacity={$tr_opacityObject[$index]}
        />

      {/each}
    </g>
  {/if}

  {#if renderLine}
    <g class="line-layer">
      {#each Object.keys($tr_screenGeometryObject) as $index ($index)}

        <path
          class="line"
          d={generatePath($tr_screenGeometryObject[$index])}
          fill="none"
          stroke-width={$tr_strokeWidthObject[$index]}
          stroke={$tr_strokeObject[$index]}
          style={`opacity: ${$tr_opacityObject[$index]}`}
        />

      {/each}
    </g>
  {/if}

  {#if renderLabel}
    <g class="label-layer">
      {#each Object.keys($tr_screenGeometryObject) as $index ($index)}

        <text 
          class="label"
          x={$tr_screenGeometryObject[$index].coordinates[0]}
          y={$tr_screenGeometryObject[$index].coordinates[1]}
          fill={$tr_fillObject[$index]}
          stroke={$tr_strokeObject[$index]}
          stroke-width={$tr_strokeWidthObject[$index]}
          fill-opacity={$tr_fillOpacityObject[$index]}
          stroke-opacity={$tr_strokeOpacityObject[$index]}
          opacity={$tr_opacityObject[$index]}
          transform={`
            rotate(${$tr_rotationObject[$index]}, 
            ${$tr_screenGeometryObject[$index].coordinates[0]}, 
            ${$tr_screenGeometryObject[$index].coordinates[1]})
          `}
          font-family={fontFamilyObject[$index]}
          font-size={$tr_fontSizeObject[$index] + 'px'}
          font-weight={$tr_fontWeightObject[$index]}
          text-anchor={textAnchorPoint(anchorPointObject[$index]).textAnchor}
          dominant-baseline={textAnchorPoint(anchorPointObject[$index]).dominantBaseline}
        >
          {textObject[$index]}
        </text>
      
      {/each}
    </g>

  {/if}

{/if}
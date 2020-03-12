<script context="module">
  let idCounter = 0
  function getId () {
    return 'layer' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy, tick } from 'svelte'
  import detectIt from 'detect-it'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  
  import validateAesthetics from './validateAesthetics.js'
  import { layerPixelGeometryFuncs } from './pixelGeometryFuncs.js'
  import { layerRepresentAsPolygonFuncs } from './representAsPolygonFuncs.js'
  import { createTransitionableLayer, transitionsEqual } from '../utils/transitions'
  import { generatePropObject } from '../utils/generatePropObject.js'
  import { createDataNecessaryForIndexingLayer } from './createDataNecessaryForIndexing.js'
  import generatePath from '../utils/generatePath.js'
  import textAnchorPoint from '../utils/textAnchorPoint.js'
  import any from '../utils/any.js'
  import parseRenderSettings from '../utils/parseRenderSettings.js' 

  const layerId = getId()

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
  export let shape = undefined
  export let size = undefined
  export let independentAxis = undefined

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

  // Transitions
  export let transition = undefined

  // Mouse interactions
  export let onClick = undefined
  export let onMousedown = undefined
  export let onMouseup = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
  export let onMousedrag = undefined

  // Touch interactions
  export let onTouchdown = undefined
  export let onTouchup = undefined
  export let onTouchover = undefined
  export let onTouchout = undefined
  export let onTouchdrag = undefined

  // Select interactions
  export let onSelect = undefined
  export let onDeselect = undefined

  // Other
  export let key = undefined
  export let renderSettings = undefined
  export let blockReindexing = false
  export let _asPolygon = true

  // Validate aesthetics every time input changes
  let aesthetics = validateAesthetics(
    type,
    {
      x,
      y,
      x1,
      x2,
      y1,
      y2,
      geometry,
      shape,
      size,
      independentAxis,
      radius,
      fill,
      stroke,
      strokeWidth,
      strokeOpacity,
      fillOpacity,
      opacity,
      text,
      fontFamily,
      fontSize,
      fontWeight,
      rotation,
      anchorPoint
    }
  )
  $: {
    if (initDone()) {
      aesthetics = validateAesthetics(
        type,
        {
          x,
          y,
          x1,
          x2,
          y1,
          y2,
          geometry,
          shape,
          size,
          independentAxis,
          radius,
          fill,
          stroke,
          strokeWidth,
          strokeOpacity,
          fillOpacity,
          opacity,
          text,
          fontFamily,
          fontSize,
          fontWeight,
          rotation,
          anchorPoint
        }
      )
    }
  }

  // Create 'positioning' aesthetics object
  let positioningAesthetics = { x, y, x1, x2, y1, y2, geometry, shape, size, independentAxis }
  $: {
    if (initDone()) {
      positioningAesthetics = { x, y, x1, x2, y1, y2, geometry, shape, size, independentAxis }
    }
  }

  // Select appriopriate geometry conversion functions
  let createPixelGeometryObject = layerPixelGeometryFuncs[type]
  let representAsPolygonObject = layerRepresentAsPolygonFuncs[type]

  $: {
    if (initDone()) {
      createPixelGeometryObject = layerPixelGeometryFuncs[type]
      representAsPolygonObject = layerRepresentAsPolygonFuncs[type]
    }
  }

  let asPolygon = _asPolygon === true && layerRepresentAsPolygonFuncs[type] !== undefined

  $: {
    if (initDone()) {
      asPolygon = _asPolygon === true && layerRepresentAsPolygonFuncs[type] !== undefined
    }
  }

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()

  // Initiate geometry objects and key array
  let pixelGeometryObject
  let screenGeometryObject

  updatePixelGeometryObject()
  
  let keyArray = Object.keys(pixelGeometryObject)

  // Generate other prop objects
  let radiusObject = generatePropObject(aesthetics.radius, keyArray)
  const fillObject = generatePropObject(aesthetics.fill, keyArray)
  const strokeObject = generatePropObject(aesthetics.stroke, keyArray)
  let strokeWidthObject = generatePropObject(aesthetics.strokeWidth, keyArray)
  const strokeOpacityObject = generatePropObject(aesthetics.strokeOpacity, keyArray)
  const fillOpacityObject = generatePropObject(aesthetics.fillOpacity, keyArray)
  const opacityObject = generatePropObject(aesthetics.opacity, keyArray)
  let textObject = generatePropObject(aesthetics.text, keyArray)
  let fontFamilyObject = generatePropObject(aesthetics.fontFamily, keyArray)
  const fontSizeObject = generatePropObject(aesthetics.fontSize, keyArray)
  const fontWeightObject = generatePropObject(aesthetics.fontWeight, keyArray)
  const rotationObject = generatePropObject(aesthetics.rotation, keyArray)
  let anchorPointObject = generatePropObject(aesthetics.anchorPoint, keyArray)

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

  // Handle changes to geometry
  $: {
    if (initDone()) {
      scheduleUpdatePixelGeometryObject(
        positioningAesthetics,
        key,
        $sectionContext,
        parseRenderSettings(renderSettings)
      )
    }
  }

  // Handle radius and strokeWidth changes if Points or Lines are not represented as Polygons
  $: {
    if (initDone()) {
      if (!asPolygon) {
        tr_radiusObject.set(generatePropObject(aesthetics.radius, keyArray))
        tr_strokeWidthObject.set(generatePropObject(aesthetics.strokeWidth, keyArray))
      }
    }
  }

  // Handle other changes
  $: { if (initDone()) tr_fillObject.set(generatePropObject(aesthetics.fill, keyArray)) }
  $: { if (initDone()) tr_strokeObject.set(generatePropObject(aesthetics.stroke, keyArray)) }
  $: { if (initDone()) tr_strokeOpacityObject.set(generatePropObject(aesthetics.strokeOpacity, keyArray)) }
  $: { if (initDone()) tr_fillOpacityObject.set(generatePropObject(aesthetics.fillOpacity, keyArray)) }
  $: { if (initDone()) tr_opacityObject.set(generatePropObject(aesthetics.opacity, keyArray)) }

  // text aes changes
  $: { if (initDone()) tr_fontSizeObject.set(generatePropObject(aesthetics.fontSize, keyArray)) }
  $: { if (initDone()) tr_fontWeightObject.set(generatePropObject(aesthetics.fontWeight, keyArray)) }
  $: { if (initDone()) tr_rotationObject.set(generatePropObject(aesthetics.rotation, keyArray)) }

  // non-transitionable aesthetics
  $: { if (initDone()) textObject = generatePropObject(aesthetics.text, keyArray) }
  $: { if (initDone()) fontFamilyObject = generatePropObject(aesthetics.fontFamily, keyArray) }
  $: { if (initDone()) anchorPointObject = generatePropObject(aesthetics.anchorPoint, keyArray) }

  let previousTransition

  let pixelGeometryObjectRecalculationNecessary = false
  let screenGeometryObjectRecalculationNecessary = false

  $: {
    tick().then(() => {
      if (pixelGeometryObjectRecalculationNecessary) {
        updatePixelGeometryObject()
        keyArray = Object.keys(pixelGeometryObject)

        if (asPolygon) {
          updateRadiusAndStrokeWidth()
        }
      }

      if (screenGeometryObjectRecalculationNecessary) {
        updateScreenGeometryObject()
        updateScreenGeometryObjectTransitionable()

        updateInteractionManagerIfNecessary()
      }

      pixelGeometryObjectRecalculationNecessary = false
      screenGeometryObjectRecalculationNecessary = false
    })
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
  $: isInteractiveMouse = detectIt.hasMouse && any(onClick, onMousedown, onMouseup, onMouseover, onMouseout, onMousedrag)
  $: isInteractiveTouch = detectIt.hasTouch && any(onTouchdown, onTouchup, onTouchover, onTouchout, onTouchdrag)

  $: isSelectable = onSelect !== undefined || onDeselect !== undefined

  onMount(() => {
    updateInteractionManagerIfNecessary()
  })

  onDestroy(() => {
    removeLayerFromSpatialIndexIfNecessary()
  })

  // Helpers
  function scheduleUpdatePixelGeometryObject () {
    pixelGeometryObjectRecalculationNecessary = true
    screenGeometryObjectRecalculationNecessary = true
  }

  function updatePixelGeometryObject () {
    pixelGeometryObject = createPixelGeometryObject(
      positioningAesthetics,
      key,
      $sectionContext,
      parseRenderSettings(renderSettings)
    )
  }

  function scheduleUpdateScreenGeometryObject () {
    screenGeometryObjectRecalculationNecessary = true
  }

  function updateScreenGeometryObject () {
    if (asPolygon) {
      screenGeometryObject = representAsPolygonObject(pixelGeometryObject, { radiusObject, strokeWidthObject })
    } else {
      screenGeometryObject = pixelGeometryObject
    }
  }

  function updateScreenGeometryObjectTransitionable () {
    tr_screenGeometryObject.set(screenGeometryObject)
  }

  function updateRadiusAndStrokeWidth () {
    radiusObject = generatePropObject(aesthetics.radius, keyArray)
    strokeWidthObject = generatePropObject(aesthetics.strokeWidth, keyArray)
  }

  function updateInteractionManagerIfNecessary () {
    if (initPhase || !(blockReindexing || $sectionContext.blockReindexing)) {
      removeLayerFromSpatialIndexIfNecessary()

      if (isInteractiveMouse) {
        const markInterface = $interactionManagerContext.mouse().marks()
  
        markInterface.loadLayer(type, createDataNecessaryForIndexing())

        if (onClick) markInterface.addLayerInteraction('click', layerId, onClick)
        if (onMousedown) markInterface.addLayerInteraction('mousedown', layerId, onMousedown)
        if (onMouseup) markInterface.addLayerInteraction('mouseup', layerId, onMouseup)
        if (onMouseout) markInterface.addLayerInteraction('mouseout', layerId, onMouseout)
        if (onMouseover) markInterface.addLayerInteraction('mouseover', layerId, onMouseover)
        if (onMousedrag) markInterface.addLayerInteraction('mousedrag', layerId, onMousedrag)
      }

      if (isInteractiveTouch) {
        const markInterface = $interactionManagerContext.touch().marks()

        markInterface.loadLayer(type, createDataNecessaryForIndexing())

        if (onTouchdown) markInterface.addLayerInteraction('touchdown', layerId, onTouchdown)
        if (onTouchup) markInterface.addLayerInteraction('touchup', layerId, onTouchup)
        if (onTouchover) markInterface.addLayerInteraction('touchover', layerId, onTouchover)
        if (onTouchout) markInterface.addLayerInteraction('touchout', layerId, onTouchout)
        if (onTouchdrag) markInterface.addLayerInteraction('touchdrag', layerId, onTouchdrag)
      }
    }

    removeLayerFromSelectIfNecessary()
  
    if (isSelectable) {
      const selectManager = $interactionManagerContext.select()

      selectManager.loadLayer(
        type, createDataNecessaryForIndexing(), { onSelect, onDeselect }
      )
    }
  }

  function removeLayerFromSpatialIndexIfNecessary () {
    if (detectIt.hasMouse) {
      const markMouseInterface = $interactionManagerContext.mouse().marks()

      if (markMouseInterface.layerIsLoaded(layerId)) {
        markMouseInterface.removeAllLayerInteractions(layerId)
        markMouseInterface.removeLayer(layerId)
      }
    }

    if (detectIt.hasTouch) {
      const markTouchInterface = $interactionManagerContext.touch().marks()

      if (markTouchInterface.layerIsLoaded(layerId)) {
        markTouchInterface.removeAllLayerInteractions(layerId)
        markTouchInterface.removeLayer(layerId)
      }
    }
  }

  function removeLayerFromSelectIfNecessary () {
    const selectManager = $interactionManagerContext.select()

    if (selectManager.layerIsLoaded(layerId)) {
      selectManager.removeLayer(layerId)
    }
  }

  function createDataNecessaryForIndexing () {
    return createDataNecessaryForIndexingLayer(
      type, layerId, keyArray, { pixelGeometryObject, screenGeometryObject }, { radiusObject, strokeWidthObject }
    )
  }

  $: renderPolygon = !['Point', 'Line', 'Label'].includes(type) || asPolygon
  $: renderCircle = type === 'Point' && !asPolygon
  $: renderLine = type === 'Line' && !asPolygon
  $: renderLabel = type === 'Label'
</script>

{#if $graphicContext.output() === 'svg'}

  {#if renderPolygon}
    <g class={`${type.toLowerCase()}-layer`}>
      {#each Object.keys($tr_screenGeometryObject) as $key ($key)}

        <path
          class={type.toLowerCase()}
          d={generatePath($tr_screenGeometryObject[$key])}
          fill={$tr_fillObject[$key]}
          stroke={$tr_strokeObject[$key]}
          stroke-width={$tr_strokeWidthObject[$key]}
          fill-opacity={$tr_fillOpacityObject[$key]}
          stroke-opacity={$tr_strokeOpacityObject[$key]}
          opacity={$tr_opacityObject[$key]}
        />

      {/each}
    </g>

  {/if}

  {#if renderCircle}
    <g class="point-layer">
      {#each Object.keys($tr_screenGeometryObject) as $key ($key)}

        <circle
          class="point"
          cx={$tr_screenGeometryObject[$key].coordinates[0]}
          cy={$tr_screenGeometryObject[$key].coordinates[1]}
          r={$tr_radiusObject[$key]}
          fill={$tr_fillObject[$key]}
          stroke={$tr_strokeObject[$key]}
          stroke-width={$tr_strokeWidthObject[$key]}
          fill-opacity={$tr_fillOpacityObject[$key]}
          stroke-opacity={$tr_strokeOpacityObject[$key]}
          opacity={$tr_opacityObject[$key]}
        />

      {/each}
    </g>
  {/if}

  {#if renderLine}
    <g class="line-layer">
      {#each Object.keys($tr_screenGeometryObject) as $key ($key)}

        <path
          class="line"
          d={generatePath($tr_screenGeometryObject[$key])}
          fill="none"
          stroke-width={$tr_strokeWidthObject[$key]}
          stroke={$tr_strokeObject[$key]}
          style={`opacity: ${$tr_opacityObject[$key]}`}
        />

      {/each}
    </g>
  {/if}

{/if}

{#if renderLabel}
  <g class="label-layer">
    {#each Object.keys($tr_screenGeometryObject) as $key ($key)}

      <text 
        class="label"
        x={$tr_screenGeometryObject[$key].coordinates[0]}
        y={$tr_screenGeometryObject[$key].coordinates[1]}
        fill={$tr_fillObject[$key]}
        stroke={$tr_strokeObject[$key]}
        stroke-width={$tr_strokeWidthObject[$key]}
        fill-opacity={$tr_fillOpacityObject[$key]}
        stroke-opacity={$tr_strokeOpacityObject[$key]}
        opacity={$tr_opacityObject[$key]}
        transform={`
          rotate(${$tr_rotationObject[$key]}, 
          ${$tr_screenGeometryObject[$key].coordinates[0]}, 
          ${$tr_screenGeometryObject[$key].coordinates[1]})
        `}
        font-family={fontFamilyObject[$key]}
        font-size={$tr_fontSizeObject[$key] + 'px'}
        font-weight={$tr_fontWeightObject[$key]}
        text-anchor={textAnchorPoint(anchorPointObject[$key]).textAnchor}
        dominant-baseline={textAnchorPoint(anchorPointObject[$key]).dominantBaseline}
      >
        {textObject[$key]}
      </text>
      
    {/each}
  </g>

{/if}

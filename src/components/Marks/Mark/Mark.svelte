<script context="module">
  let idCounter = 0
  function getId () {
    return 'mark' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'
  import detectIt from 'detect-it'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  
  import validateAesthetics from './validateAesthetics.js'
  import { markPixelGeometryFuncs } from './pixelGeometryFuncs.js'
  import { markRepresentAsPolygonFuncs } from './representAsPolygonFuncs.js'
  import { createDataNecessaryForIndexingMark } from './createDataNecessaryForIndexing.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'
  import any from '../utils/any.js'
  import parseRenderSettings from '../utils/parseRenderSettings.js'

  import generatePath from '../utils/generatePath.js'

  import textAnchorPoint from '../utils/textAnchorPoint.js'

  const markId = getId()

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
  let createPixelGeometry = markPixelGeometryFuncs[type]
  let representAsPolygon = markRepresentAsPolygonFuncs[type]

  $: {
    if (initDone()) {
      createPixelGeometry = markPixelGeometryFuncs[type]
      representAsPolygon = markRepresentAsPolygonFuncs[type]
    }
  }

  // Check if mark must be represented as polygon
  let asPolygon = _asPolygon === true && markRepresentAsPolygonFuncs[type] !== undefined
  $: {
    if (initDone()) {
      asPolygon = _asPolygon === true && markRepresentAsPolygonFuncs[type] !== undefined
    }
  }

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()

  // Initiate geometries
  let pixelGeometry
  let screenGeometry

  updatePixelGeometry()
  updateScreenGeometry()

  // Initiate transitionables
  let tr_screenGeometry = createTransitionable('geometry', screenGeometry, transition)
  let tr_radius = createTransitionable('radius', aesthetics.radius, transition)
  let tr_fill = createTransitionable('fill', aesthetics.fill, transition)
  let tr_stroke = createTransitionable('stroke', aesthetics.stroke, transition)
  let tr_strokeWidth = createTransitionable('strokeWidth', aesthetics.strokeWidth, transition)
  let tr_fillOpacity = createTransitionable('fillOpacity', aesthetics.fillOpacity, transition)
  let tr_strokeOpacity = createTransitionable('strokeOpacity', aesthetics.strokeOpacity, transition)
  let tr_opacity = createTransitionable('opacity', aesthetics.opacity, transition)
  
  // text transtitionables
  let tr_fontSize = createTransitionable('fontSize', aesthetics.fontSize, transition)
  let tr_fontWeight = createTransitionable('fontWeight', aesthetics.fontWeight, transition)
  let tr_rotation = createTransitionable('rotation', aesthetics.rotation, transition)

  // Handle changes to geometry
  $: {
    if (initDone()) {
      scheduleUpdatePixelGeometry(
        positioningAesthetics,
        $sectionContext,
        parseRenderSettings(renderSettings)
      )
    }
  }

  // Handle radius and strokeWidth changes if Point or Line is not represented as Polygon
  $: {
    if (initDone()) {
      if (!asPolygon) {
        tr_radius.set(aesthetics.radius)
        tr_strokeWidth.set(aesthetics.strokeWidth)
      }

      if (asPolygon) {
        scheduleUpdateScreenGeometry()
      }
    }
  }

  // Handle other changes
  $: { if (initDone()) tr_fill.set(aesthetics.fill) }
  $: { if (initDone()) tr_stroke.set(aesthetics.stroke) }
  $: { if (initDone()) tr_strokeWidth.set(aesthetics.strokeWidth) }
  $: { if (initDone()) tr_fillOpacity.set(aesthetics.fillOpacity) }
  $: { if (initDone()) tr_strokeOpacity.set(aesthetics.strokeOpacity) }
  $: { if (initDone()) tr_opacity.set(aesthetics.opacity) }
  
  // text aes changes
  $: { if (initDone()) tr_fontSize.set(aesthetics.fontSize) }
  $: { if (initDone()) tr_fontWeight.set(aesthetics.fontWeight) }
  $: { if (initDone()) tr_rotation.set(aesthetics.rotation) }

  // non-transitionable aesthetics that need additional calculation
  let rotateTransform = `rotate(${$tr_rotation}, ${$tr_screenGeometry.coordinates[0]}, ${$tr_screenGeometry.coordinates[1]})`
  let parsedTextAnchorPoint = textAnchorPoint(aesthetics.anchorPoint)

  let previousTransition

  let pixelGeometryRecalculationNecessary = false
  let screenGeometryRecalculationNecessary = false

  $: {
    if (initDone()) {
      if (pixelGeometryRecalculationNecessary) updatePixelGeometry()

      if (screenGeometryRecalculationNecessary) {
        updateScreenGeometry()
        tr_screenGeometry.set(screenGeometry)
  
        updateInteractionManagerIfNecessary()
      }

      pixelGeometryRecalculationNecessary = false
      screenGeometryRecalculationNecessary = false
    }
  }

  $: { if (initDone()) rotateTransform = `rotate(${$tr_rotation}, ${$tr_screenGeometry.coordinates[0]}, ${$tr_screenGeometry.coordinates[1]})` };
  $: { if (initDone()) parsedTextAnchorPoint = textAnchorPoint(aesthetics.anchorPoint) }

  // Update transitionables when transition settings change
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition
      tr_screenGeometry = createTransitionable('geometry', $tr_screenGeometry, transition)
      tr_radius = createTransitionable('radius', $tr_radius, transition)
      tr_fill = createTransitionable('fill', $tr_fill, transition)
      tr_stroke = createTransitionable('stroke', $tr_stroke, transition)
      tr_strokeWidth = createTransitionable('strokeWidth', $tr_strokeWidth, transition)
      tr_fillOpacity = createTransitionable('fillOpacity', $tr_fillOpacity, transition)
      tr_strokeOpacity = createTransitionable('strokeOpacity', $tr_strokeOpacity, transition)
      tr_opacity = createTransitionable('opacity', $tr_opacity, transition)

      tr_fontSize = createTransitionable('fontSize', $tr_fontSize, transition)
      tr_fontWeight = createTransitionable('fontWeight', $tr_fontWeight, transition)
      tr_rotation = createTransitionable('rotation', $tr_rotation, transition)
    }
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
    removeMarkFromSpatialIndexIfNecessary()
  })

  // Helpers
  function scheduleUpdatePixelGeometry () {
    pixelGeometryRecalculationNecessary = true
    screenGeometryRecalculationNecessary = true
  }

  function updatePixelGeometry () {
    pixelGeometry = createPixelGeometry(
      positioningAesthetics,
      $sectionContext,
      parseRenderSettings(renderSettings)
    )
  }

  function scheduleUpdateScreenGeometry () {
    screenGeometryRecalculationNecessary = true
  }

  function updateScreenGeometry () {
    if (asPolygon) {
      screenGeometry = representAsPolygon(pixelGeometry, aesthetics)
    } else {
      screenGeometry = pixelGeometry
    }
  }

  function updateInteractionManagerIfNecessary () {
    if (initPhase || !(blockReindexing || $sectionContext.blockReindexing)) {
      removeMarkFromSpatialIndexIfNecessary()

      if (isInteractiveMouse) {
        const markInterface = $interactionManagerContext.mouse().marks()

        markInterface.loadMark(type, createDataNecessaryForIndexing())

        if (onClick) markInterface.addMarkInteraction('click', markId, onClick)
        if (onMousedown) markInterface.addMarkInteraction('mousedown', markId, onMousedown)
        if (onMouseup) markInterface.addMarkInteraction('mouseup', markId, onMouseup)
        if (onMouseout) markInterface.addMarkInteraction('mouseout', markId, onMouseout)
        if (onMouseover) markInterface.addMarkInteraction('mouseover', markId, onMouseover)
        if (onMousedrag) markInterface.addMarkInteraction('mousedrag', markId, onMousedrag)
      }

      if (isInteractiveTouch) {
        const markInterface = $interactionManagerContext.touch().marks()

        markInterface.loadMark(type, createDataNecessaryForIndexing())

        if (onTouchdown) markInterface.addMarkInteraction('touchdown', markId, onTouchdown)
        if (onTouchup) markInterface.addMarkInteraction('touchup', markId, onTouchup)
        if (onTouchover) markInterface.addMarkInteraction('touchover', markId, onTouchover)
        if (onTouchout) markInterface.addMarkInteraction('touchout', markId, onTouchout)
        if (onTouchdrag) markInterface.addMarkInteraction('touchdrag', markId, onTouchdrag)
      }
    }

    removeMarkFromSelectIfNecessary()
  
    if (isSelectable) {
      const selectManager = $interactionManagerContext.select()

      selectManager.loadMark(
        type, createDataNecessaryForIndexing(), { onSelect, onDeselect }
      )
    }
  }

  function removeMarkFromSpatialIndexIfNecessary () {
    if (detectIt.hasMouse) {
      const markMouseInterface = $interactionManagerContext.mouse().marks()

      if (markMouseInterface.markIsLoaded(markId)) {
        markMouseInterface.removeAllMarkInteractions(markId)
        markMouseInterface.removeMark(markId)
      }
    }

    if (detectIt.hasTouch) {
      const markTouchInterface = $interactionManagerContext.touch().marks()

      if (markTouchInterface.markIsLoaded(markId)) {
        markTouchInterface.removeAllMarkInteractions(markId)
        markTouchInterface.removeMark(markId)
      }
    }
  }

  function removeMarkFromSelectIfNecessary () {
    const selectManager = $interactionManagerContext.select()

    if (selectManager.markIsLoaded(markId)) {
      selectManager.removeMark(markId)
    }
  }

  function createDataNecessaryForIndexing () {
    return createDataNecessaryForIndexingMark(
      type, markId, { screenGeometry, pixelGeometry }, aesthetics
    )
  }

  $: renderPolygon = !['Point', 'Line', 'Label'].includes(type) || asPolygon
  $: renderCircle = type === 'Point' && !asPolygon
  $: renderLine = type === 'Line' && !asPolygon
  $: renderLabel = type === 'Label'
</script>

{#if $graphicContext.output() === 'svg'}

  {#if renderPolygon}

    <path
      class={type.toLowerCase()}
      d={generatePath($tr_screenGeometry)}
      fill={$tr_fill}
      stroke={$tr_stroke}
      stroke-width={$tr_strokeWidth}
      fill-opacity={$tr_fillOpacity}
      stroke-opacity={$tr_strokeOpacity}
      opacity={$tr_opacity}
    />

  {/if}

  {#if renderCircle}

    <circle 
      class="point"
      cx={$tr_screenGeometry.coordinates[0]}
      cy={$tr_screenGeometry.coordinates[1]}
      r={$tr_radius}
      fill={$tr_fill}
      stroke={$tr_stroke}
      stroke-width={$tr_strokeWidth}
      fill-opacity={$tr_fillOpacity}
      stroke-opacity={$tr_strokeOpacity}
      opacity={$tr_opacity}
    />

  {/if}

  {#if renderLine}

    <path
      class="line"
      d={generatePath($tr_screenGeometry)}
      fill="none"
      stroke-width={$tr_strokeWidth}
      stroke={$tr_stroke}
      opacity={$tr_opacity}
    />
  
  {/if}

  {#if renderLabel}

    <text 
      class="label"
      x={$tr_screenGeometry.coordinates[0]}
      y={$tr_screenGeometry.coordinates[1]}
      fill={$tr_fill}
      stroke={$tr_stroke}
      stroke-width={$tr_strokeWidth}
      fill-opacity={$tr_fillOpacity}
      stroke-opacity={$tr_strokeOpacity}
      opacity={$tr_opacity}
      transform={rotateTransform}
      font-family={fontFamily}
      font-size={$tr_fontSize + 'px'}
      font-weight={$tr_fontWeight}
      text-anchor={parsedTextAnchorPoint.textAnchor}
      dominant-baseline={parsedTextAnchorPoint.dominantBaseline}
    >
      {aesthetics.text}
    </text>

  {/if}

{/if}

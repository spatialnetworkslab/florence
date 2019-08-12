<script context="module">
  let idCounter = 0
  function getId () {
    return 'mark' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/Section/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'
  
  import validateAesthetics from './validateAesthetics.js'
  import { markCoordSysGeometryFuncs } from './coordSysGeometryFuncs.js'
  import { markRepresentAsPolygonFuncs } from './representAsPolygonFuncs.js'
  import { createDataNecessaryForIndexingMark } from './createDataNecessaryForIndexing.js'
  import { transformGeometry } from '../../../utils/geometryUtils/index.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'

  import generatePath from '../utils/generatePath.js'

  import textAnchorPoint from '../utils/textAnchorPoint.js'

  let markId = getId()

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
  export let interpolate = false
  export let _asPolygon = true
  export let zoomIdentity = undefined

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
  let createCoordSysGeometry = markCoordSysGeometryFuncs[type]
  let representAsPolygon = markRepresentAsPolygonFuncs[type]

  $: {
    if (initDone()) {
      createCoordSysGeometry = markCoordSysGeometryFuncs[type]
      representAsPolygon = markRepresentAsPolygonFuncs[type]
    }
  }

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  // Initiate geometries
  let coordSysGeometry
  let pixelGeometry
  let screenGeometry

  updateCoordSysGeometry()
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

  // Handle coordSysGeometry changes
  $: {
    if (initDone()) {
      scheduleUpdateCoordSysGeometry(
        positioningAesthetics, 
        $sectionContext, 
        $coordinateTransformationContext,
        interpolate
      )
    }
  }

  // Handle zooming changes
  $: {
    if (initDone()) {
      scheduleUpdatePixelGeometry($zoomContext)
    }
  }

  // Handle radius and strokeWidth changes
  $: {
    if (initDone()) {
      if (!_asPolygon) {
        tr_radius.set(aesthetics.radius)
        tr_strokeWidth.set(aesthetics.strokeWidth)
      }

      if (_asPolygon) {
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
  let rotateTransform = `rotate(${$tr_rotation}, ${$tr_screenGeometry.coordinates[0]}, ${$tr_screenGeometry.coordinates[1]})`;
  let parsedTextAnchorPoint = textAnchorPoint(aesthetics.anchorPoint);

  let previousTransition

  let coordSysGeometryRecalculationNecessary = false
  let pixelGeometryRecalculationNecessary = false
  let screenGeometryRecalculationNecessary = false

  $: {
    if (initDone()) {
      if (coordSysGeometryRecalculationNecessary) updateCoordSysGeometry()

      if (pixelGeometryRecalculationNecessary) updatePixelGeometry()

      if (screenGeometryRecalculationNecessary) {
        updateScreenGeometry()
        tr_screenGeometry.set(screenGeometry)
        
        updateInteractionManagerIfNecessary()
      }

      coordSysGeometryRecalculationNecessary = false
      pixelGeometryRecalculationNecessary = false
      screenGeometryRecalculationNecessary = false
    }
  }

  $: { if (initDone()) rotateTransform = `rotate(${$tr_rotation}, ${$tr_screenGeometry.coordinates[0]}, ${$tr_screenGeometry.coordinates[1]})`};
  $: { if (initDone()) parsedTextAnchorPoint = textAnchorPoint(aesthetics.anchorPoint)}


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
  $: isInteractive = onClick !== undefined || onMouseover !== undefined || onMouseout !== undefined

  onMount(() => {
    updateInteractionManagerIfNecessary()
  })

  onDestroy(() => {
    removeMarkFromSpatialIndexIfNecessary()
  })

  // Helpers
  function scheduleUpdateCoordSysGeometry () {
    coordSysGeometryRecalculationNecessary = true
    pixelGeometryRecalculationNecessary = true
    screenGeometryRecalculationNecessary = true
  }

  function updateCoordSysGeometry () {
    coordSysGeometry = createCoordSysGeometry(
      positioningAesthetics, 
      $sectionContext, 
      $coordinateTransformationContext,
      interpolate
    )
  }

  function scheduleUpdatePixelGeometry () {
    pixelGeometryRecalculationNecessary = true
    screenGeometryRecalculationNecessary = true
  }

  function updatePixelGeometry () {
    const zoomTransformation = ZoomContext.createZoomTransformation(zoomIdentity, $zoomContext)

    if (zoomTransformation) {
      pixelGeometry = transformGeometry(coordSysGeometry, zoomTransformation)
    } else {
      pixelGeometry = coordSysGeometry
    }
  }

  function scheduleUpdateScreenGeometry () {
    screenGeometryRecalculationNecessary = true
  }

  function updateScreenGeometry () {
    if (_asPolygon) {
      screenGeometry = representAsPolygon(pixelGeometry, aesthetics)
    } else {
      screenGeometry = pixelGeometry
    }
  }

  function updateInteractionManagerIfNecessary () {
    removeMarkFromSpatialIndexIfNecessary()

    if (isInteractive) {
      $interactionManagerContext.loadMark(type, createDataNecessaryForIndexing())

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

  function createDataNecessaryForIndexing () {
    return createDataNecessaryForIndexingMark(
      type, markId, { screenGeometry, pixelGeometry }, aesthetics
    )
  }

  $: renderPolygon = !['Point', 'Line', 'Label'].includes(type) || _asPolygon
  $: renderCircle = type === 'Point' && !_asPolygon
  $: renderLine = type === 'Line' && !_asPolygon
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

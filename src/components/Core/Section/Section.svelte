<script context="module">
  let idCounter = 0
  function getId () {
    return 'sc' + idCounter++
  }
</script>

<script>
  import { beforeUpdate } from 'svelte'
  import detectIt from 'detect-it'
  import * as SectionContext from './SectionContext'
  import * as CoordinateTransformationContext from './CoordinateTransformationContext'
  import * as EventManagerContext from '../Graphic/EventManagerContext'
  import * as InteractionManagerContext from './InteractionManagerContext'
  import * as ZoomContext from './ZoomContext'

  import InteractionManager from '../../../interactivity/interactions/InteractionManager'
  import { scaleCoordinates } from '../../Marks/Rectangle/createCoordSysGeometry.js'
  import { parsePadding, applyPadding } from '../utils/padding.js'

  const sectionId = getId()

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let padding = 0
  export let scaleX = undefined
  export let scaleY = undefined
  export let flipX = false
  export let flipY = false
  export let zoomIdentity = undefined
  export let transformation = undefined
  export let blockReindexing = false

  // Aesthetics
  export let backgroundColor = undefined
  export let paddingColor = undefined

  // Mouse interactions
  export let onClick = undefined
  export let onWheel = undefined
  export let onMousedown = undefined
  export let onMouseup = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
  export let onMousemove = undefined

  // Touch interactions
  export let onPinch = undefined
  export let onTouchdown = undefined
  export let onTouchmove = undefined
  export let onTouchup = undefined
  export let onTouchover = undefined
  export let onTouchout = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const newSectionContext = SectionContext.init()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const newCoordinateTransformationContext = CoordinateTransformationContext.init()
  const eventManagerContext = EventManagerContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.init()
  const zoomContext = ZoomContext.init()

  let scaledCoordinates
  let rangeX
  let rangeY

  // Set up InteractionManager
  const interactionManager = new InteractionManager()
  interactionManager.setId(sectionId)
  interactionManager.linkEventManager($eventManagerContext)
  InteractionManagerContext.update(
    interactionManagerContext,
    interactionManager
  )

  // Keep SectionContext and CoordinateTransformationContext up to date
  let _padding

  $: {
    scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
    rangeX = [scaledCoordinates.x1, scaledCoordinates.x2]
    rangeY = [scaledCoordinates.y1, scaledCoordinates.y2]

    if (flipX) rangeX.reverse()
    if (flipY) rangeY.reverse()

    _padding = parsePadding(padding)
    rangeX = applyPadding(rangeX, _padding.left, _padding.right)
    rangeY = applyPadding(rangeY, _padding.top, _padding.bottom)

    const updatedSectionContext = {
      sectionId,
      rangeX,
      rangeY,
      scaleX,
      scaleY,
      padding: _padding,
      flipX,
      flipY,
      blockReindexing
    }

    SectionContext.update(newSectionContext, updatedSectionContext)

    CoordinateTransformationContext.update(newCoordinateTransformationContext, {
      rangeX,
      rangeY,
      transformation
    })

    $interactionManagerContext.loadSection($newSectionContext)
    $interactionManagerContext.loadCoordinateTransformation(
      $newCoordinateTransformationContext
    )
  }

  // Change callbacks if necessary
  $: {
    removeSectionInteractionsIfNecessary(
      onWheel,
      onClick,
      onMousedown,
      onMouseup,
      onMouseover,
      onMouseout,
      onTouchdown,
      onTouchmove,
      onTouchup,
      onTouchover,
      onTouchout,
      onPinch
    )
  }

  // Update zooming and panning
  $: {
    ZoomContext.update(zoomContext, zoomIdentity)
    $interactionManagerContext.loadZoom($zoomContext)
  }

  beforeUpdate(() => {
    CoordinateTransformationContext.ensureNotParent(
      $coordinateTransformationContext
    )
  })

  function removeSectionInteractionsIfNecessary () {
    if (detectIt.hasMouse) {
      const sectionInterface = $interactionManagerContext.mouse().section()
      sectionInterface.removeAllInteractions()

      if (onWheel) sectionInterface.addInteraction('wheel', onWheel)
      if (onClick) sectionInterface.addInteraction('click', onClick)
      if (onMousedown) { sectionInterface.addInteraction('mousedown', onMousedown) }
      if (onMouseup) sectionInterface.addInteraction('mouseup', onMouseup)
      if (onMouseover) { sectionInterface.addInteraction('mouseover', onMouseover) }
      if (onMouseout) sectionInterface.addInteraction('mouseout', onMouseout)
      if (onMousemove) { sectionInterface.addInteraction('mousemove', onMousemove) }
    }

    if (detectIt.hasTouch) {
      const sectionInterface = $interactionManagerContext.touch().section()
      sectionInterface.removeAllInteractions()

      if (onTouchdown) { sectionInterface.addInteraction('touchdown', onTouchdown) }
      if (onTouchmove) { sectionInterface.addInteraction('touchmove', onTouchmove) }
      if (onTouchup) sectionInterface.addInteraction('touchup', onTouchup)
      if (onTouchover) { sectionInterface.addInteraction('touchover', onTouchover) }
      if (onTouchout) sectionInterface.addInteraction('touchout', onTouchout)
      if (onPinch) sectionInterface.addInteraction('pinch', onPinch)
    }
  }
  export function selectRectangle (rectangle) {
    $interactionManagerContext.select().selectRectangle(rectangle)
  }

  export function updateSelectRectangle (rectangle) {
    $interactionManagerContext.select().updateSelectRectangle(rectangle)
  }

  export function resetSelectRectangle () {
    $interactionManagerContext.select().resetSelectRectangle()
  }

  export function startSelectPolygon (startCoordinates) {
    $interactionManagerContext.select().startSelectPolygon(startCoordinates)
  }

  export function addPointToSelectPolygon (pointCoordinates) {
    $interactionManagerContext
      .select()
      .addPointToSelectPolygon(pointCoordinates)
  }

  export function moveSelectPolygon (delta) {
    $interactionManagerContext.select().moveSelectPolygon(delta)
  }

  export function getSelectPolygon () {
    return $interactionManagerContext.select().getSelectPolygon()
  }

  export function resetSelectPolygon () {
    $interactionManagerContext.select().resetSelectPolygon()
  }
</script>

<defs>
  <clipPath id={`clip-${sectionId}`}>
    <rect
      x={Math.min(scaledCoordinates.x1, scaledCoordinates.x2)}
      y={Math.min(scaledCoordinates.y1, scaledCoordinates.y2)}
      width={Math.abs(scaledCoordinates.x2 - scaledCoordinates.x1)}
      height={Math.abs(scaledCoordinates.y2 - scaledCoordinates.y1)} />
  </clipPath>
  <clipPath id={`clip-${sectionId}-data`}>
    <rect
      x={Math.min(...rangeX)}
      y={Math.min(...rangeY)}
      width={Math.abs(rangeX[0] - rangeX[1])}
      height={Math.abs(rangeY[0] - rangeY[1])}
      fill="white" />
  </clipPath>
</defs>

<g class="section" clip-path={`url(#clip-${sectionId})`}>
  {#if paddingColor}
    <rect
      class="padding-background"
      mask={`url(#clip-${sectionId}-data)`}
      width="100%"
      height="100%"
      fill={paddingColor} />
  {/if}
  {#if backgroundColor}
    <rect
      class="content-background"
      x={Math.min(...rangeX)}
      y={Math.min(...rangeY)}
      width={Math.abs(rangeX[0] - rangeX[1])}
      height={Math.abs(rangeY[0] - rangeY[1])}
      fill={backgroundColor} />
  {/if}
  <slot />
</g>

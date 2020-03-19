<script context="module">
  let idCounter = 0
  function getId () {
    return 'sc' + idCounter++
  }
</script>

<script>
  import detectIt from 'detect-it'
  import * as SectionContext from './SectionContext'
  import * as EventManagerContext from '../Graphic/EventManagerContext'
  import * as InteractionManagerContext from './InteractionManagerContext'

  import InteractionManager from '../../../interactivity/interactions/InteractionManager'
  import { getPixelCoordinates } from './getPixelCoordinates.js'
  import { getClipPropsNoPadding, getClipPropsPadding } from './getClipProps.js'

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
  const eventManagerContext = EventManagerContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.init()
  
  // Set up InteractionManager
  const interactionManager = new InteractionManager()
  interactionManager.setId(sectionId)
  interactionManager.linkEventManager($eventManagerContext)
  InteractionManagerContext.update(
    interactionManagerContext,
    interactionManager
  )

  // Keep SectionContext and InteractionManagerContext up to date
  $: coordinates = getPixelCoordinates({ x1, x2, y1, y2 }, $sectionContext)

  $: {
    const sectionData = {
      sectionId,
      coordinates,
      scaleX,
      scaleY,
      padding,
      flipX,
      flipY,
      blockReindexing,
      transformation,
      zoomIdentity
    }

    SectionContext.update(newSectionContext, sectionData)
    $interactionManagerContext.loadSection($newSectionContext)
  }

  $: clipPropsNoPadding = getClipPropsNoPadding(coordinates)
  $: clipPropsPadding = getClipPropsPadding(coordinates, padding)

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
    <rect {...clipPropsNoPadding} />
  </clipPath>

  <mask id={`mask-${sectionId}-padding-bg`}>
    <rect {...clipPropsNoPadding} fill="white" />
    <rect {...clipPropsPadding} fill="black" />
  </mask>
</defs>

<g class="section" clip-path={`url(#clip-${sectionId})`} >
  {#if backgroundColor}
    <rect 
      class="content-background"
      {...clipPropsPadding}
      fill={backgroundColor}
    />
  {/if}

  {#if paddingColor}
    <rect 
      class="padding-background"
      mask={`url(#mask-${sectionId}-padding-bg)`}
      {...clipPropsNoPadding}
      fill={paddingColor} />
  {/if}
  <slot />
</g>

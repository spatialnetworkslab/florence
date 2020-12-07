<script context="module">
  let idCounter = 0
  function getId () {
    return 'gr' + idCounter++
  }
</script>

<script>
  import { onMount } from 'svelte'
  import * as GraphicContext from './GraphicContext'
  import * as SectionContext from '../Section/SectionContext'
  import * as EventManagerContext from './EventManagerContext'
  import * as InteractionManagerContext from '../Section/InteractionManagerContext'

  import EventManager from '../../../interactivity/events/EventManager.js'
  import InteractionManager from '../../../interactivity/interactions/InteractionManager.js'

  import { getClipPropsPadding, getClipPropsNoPadding } from '../Section/getClipProps.js'

  const graphicId = getId()

  // Positioning
  export let width = 500
  export let height = 500
  export let viewBox = undefined
  export let preserveAspectRatio = 'xMidYMid meet'

  // Local coordinates
  export let scaleX = undefined
  export let scaleY = undefined
  export let flipX = false
  export let flipY = false
  export let padding = 0
  export let zoomIdentity = undefined

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

  // Aesthetics
  export let backgroundColor = undefined
  export let paddingColor = undefined

  // Other
  export let transformation = undefined
  export let blockReindexing = false
  export let clip = true
  export let renderer = undefined

  // Contexts
  const graphicContext = GraphicContext.init()
  const sectionContext = SectionContext.init()
  const eventManagerContext = EventManagerContext.init()
  const interactionManagerContext = InteractionManagerContext.init()

  $: {
    GraphicContext.update(graphicContext, { renderer })
  }

  let rootNode

  // set up event and interaction manager
  const eventManager = new EventManager()
  EventManagerContext.update(eventManagerContext, eventManager)
  
  const interactionManager = new InteractionManager()
  interactionManager.setId(graphicId)
  interactionManager.linkEventManager(eventManager)
  InteractionManagerContext.update(interactionManagerContext, interactionManager)

  // Keep SectionContext and InteractionManagerContext up to date
  let numberWidth = width
  let numberHeight = height
  $: coordinates = { x1: 0, y1: 0, x2: numberWidth, y2: numberHeight }

  $: {
    const sectionData = {
      sectionId: graphicId,
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

    SectionContext.update(sectionContext, sectionData)
    $interactionManagerContext.loadSection($sectionContext)
  }

  $: clipPropsPadding = getClipPropsPadding(coordinates, padding)
  $: clipPropsNoPadding = getClipPropsNoPadding(coordinates)

  const originalViewBox = viewBox
  let originalViewBoxArray
  
  if (originalViewBox !== undefined) {
    originalViewBoxArray = originalViewBox.split(' ')
  }
  $: {
    if (width.constructor === Number && height.constructor === Number) {
      numberWidth = width
      numberHeight = height
    } else if (originalViewBox !== undefined) {
      numberWidth = Number(originalViewBoxArray[2])
      numberHeight = Number(originalViewBoxArray[3])
    } else if (originalViewBox === undefined) {
      numberWidth = 100
      numberHeight = 100
    }
  }
  $: {
    if (originalViewBox === undefined) {
      viewBox = `0 0 ${numberWidth} ${numberHeight}`
    }
  }

  onMount(() => {
    // Only on mount can we bind the svg root node and attach actual event listeners.
    // Sometimes rootNode is undefined for some weird reason. In this case,
    // we will use document.getElementById instead
    let _rootNode = rootNode
      ? rootNode
      : document.getElementById(graphicId)

    eventManager.addRootNode(_rootNode)
    eventManager.attachEventListeners()
  })

  // Interactions
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
    if (detectIt.primaryInput === 'mouse') {
      const sectionInterface = $interactionManagerContext.mouse().section()
      sectionInterface.removeAllInteractions()

      if (onWheel) sectionInterface.addInteraction('wheel', onWheel)
      if (onClick) sectionInterface.addInteraction('click', onClick)
      if (onMousedown) sectionInterface.addInteraction('mousedown', onMousedown)
      if (onMouseup) sectionInterface.addInteraction('mouseup', onMouseup)
      if (onMouseover) sectionInterface.addInteraction('mouseover', onMouseover)
      if (onMouseout) sectionInterface.addInteraction('mouseout', onMouseout)
      if (onMousemove) sectionInterface.addInteraction('mousemove', onMousemove)
    }

    if (detectIt.primaryInput === 'touch') {
      const sectionInterface = $interactionManagerContext.touch().section()
      sectionInterface.removeAllInteractions()

      if (onTouchdown) sectionInterface.addInteraction('touchdown', onTouchdown)
      if (onTouchmove) sectionInterface.addInteraction('touchmove', onTouchmove)
      if (onTouchup) sectionInterface.addInteraction('touchup', onTouchup)
      if (onTouchover) sectionInterface.addInteraction('touchover', onTouchover)
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

<svg
  id={graphicId}
  {width}
  {height}
  {viewBox}
  {preserveAspectRatio}
  bind:this={rootNode}
>
  {#if clip}

    <clipPath id={`clip-${graphicId}`}>
      <rect {...clipPropsPadding} />
    </clipPath>

  {/if}

  <defs>
    <mask id={`${graphicId}-mask-padding-bg`}>
      <rect {...clipPropsNoPadding} fill="white" />
      <rect {...clipPropsPadding} fill="black" />
    </mask>
  </defs>

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
      mask={`url(#${graphicId}-mask-padding-bg)`}
      {...clipPropsNoPadding}
      fill={paddingColor} 
    />
  {/if}

  <slot />
</svg>
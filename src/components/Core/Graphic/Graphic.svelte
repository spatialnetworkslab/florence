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

  export let renderer = undefined
  
  export let width = 500
  export let height = 500
  export let viewBox = undefined
  export let preserveAspectRatio = 'xMidYMid meet'

  export let scaleX = undefined
  export let scaleY = undefined
  export let transformation = undefined
  export let flipX = false
  export let flipY = false
  export let padding = 0
  export let zoomIdentity = undefined
  export let blockReindexing = false

  export let backgroundColor = undefined
  export let paddingColor = undefined

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
    // only on mount can we bind the svg root node and attach actual event listeners
    eventManager.addRootNode(rootNode)
    eventManager.attachEventListeners()
  })
</script>

<svg
  {width}
  {height}
  {viewBox}
  {preserveAspectRatio}
  bind:this={rootNode}
>
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
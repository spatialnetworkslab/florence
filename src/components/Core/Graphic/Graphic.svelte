<script>
  import { onMount } from 'svelte'

  import * as GraphicContext from './GraphicContext'
  import * as SectionContext from '../Section/SectionContext'
  import * as EventManagerContext from './EventManagerContext'
  import * as InteractionManagerContext from '../Section/InteractionManagerContext'

  import EventManager from '../../../interactivity/events/EventManager.js'
  import InteractionManager from '../../../interactivity/interactions/InteractionManager.js'

  export let renderer = undefined
  
  export let width = 500
  export let height = 500
  export let viewBox = undefined
  export let preserveAspectRatio = 'xMidYMid meet'

  export let padding = 0
  export let scaleX = undefined
  export let scaleY = undefined
  export let flipX = false
  export let flipY = false
  export let zoomIdentity = undefined
  export let transformation = undefined
  export let blockReindexing = false

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
  interactionManager.setId('graphic')
  interactionManager.linkEventManager(eventManager)

  InteractionManagerContext.update(interactionManagerContext, interactionManager)

  // Keep SectionContext and InteractionManagerContext up to date
  $: coordinates = { x1: 0, y1: 0, x2: width, y2: height }

  $: {
    const sectionData = {
      sectionId: 'graphic',
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

  $: {
    if (viewBox === undefined) {
      if (width.constructor === Number && height.constructor === Number) {
        viewBox = `0 0 ${width} ${height}`
      } else {
        viewBox = `0 0 100 100`
      }
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
  <slot />
</svg>

<script context="module">
  let idCounter = 0

  function getId () {
    return 'gr' + idCounter++
  }
</script>

<script>
  import { onMount, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { createSection, EventManager, InteractionManager } from 'rendervous'
  import Clipper from './Clipper.svelte'

  // Positioning
  export let width = 500
  export let height = 500

  // Local coordinates
  export let coordinates = undefined
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

  // Other options
  export let clip = 'padding'
  export let renderer = 'svg'

  const id = getId()

  // Initiate contexts
  const graphicContext = writable()
  const sectionContext = writable()
  const eventManagerContext = writable()
  const interactionManagerContext = writable()
  setContext('graphic', graphicContext)
  setContext('section', sectionContext)
  setContext('eventManager', eventManagerContext)
  setContext('interactionManager', interactionManagerContext)

  // Section data
  let section

  $: {
    section = createSection({
      x1: 0,
      x2: width,
      y1: 0,
      y2: height,
      coordinates,
      scaleX,
      scaleY,
      flipX,
      flipY,
      padding,
      zoomIdentity,
      clip,
      id
    })
  }

  // Interactivity: set up globally
  const eventManager = new EventManager()
  const interactionManager = new InteractionManager()

  interactionManager.setId(id)
  interactionManager.linkEventManager(eventManager)

  let rootNode

  onMount(() => {
    // Only on mount can we bind the svg root node and attach actual event listeners.
    // Sometimes rootNode is undefined for some weird reason. In this case,
    // we will use document.getElementById instead
    let _rootNode = rootNode
      ? rootNode
      : document.getElementById(id)

    eventManager.addRootNode(_rootNode, renderer)
    eventManager.attachEventListeners()
  })

  // Interactivity: component-specific
  $: {
    interactionManager.loadSection(section)
  }

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
    if (interactionManager.getPrimaryInput() === 'mouse') {
      const sectionInterface = interactionManager.mouse().section()
      sectionInterface.removeAllInteractions()

      if (onWheel) sectionInterface.addInteraction('wheel', onWheel)
      if (onClick) sectionInterface.addInteraction('click', onClick)
      if (onMousedown) sectionInterface.addInteraction('mousedown', onMousedown)
      if (onMouseup) sectionInterface.addInteraction('mouseup', onMouseup)
      if (onMouseover) sectionInterface.addInteraction('mouseover', onMouseover)
      if (onMouseout) sectionInterface.addInteraction('mouseout', onMouseout)
      if (onMousemove) sectionInterface.addInteraction('mousemove', onMousemove)
    }

    if (interactionManager.getPrimaryInput() === 'touch') {
      const sectionInterface = interactionManager.touch().section()
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
    interactionManager.select().selectRectangle(rectangle)
  }

  export function updateSelectRectangle (rectangle) {
    interactionManager.select().updateSelectRectangle(rectangle)
  }

  export function resetSelectRectangle () {
    interactionManager.select().resetSelectRectangle()
  }

  export function startSelectPolygon (startCoordinates) {
    interactionManager.select().startSelectPolygon(startCoordinates)
  }

  export function addPointToSelectPolygon (pointCoordinates) {
    interactionManager
      .select()
      .addPointToSelectPolygon(pointCoordinates)
  }

  export function moveSelectPolygon (delta) {
    interactionManager.select().moveSelectPolygon(delta)
  }

  export function getSelectPolygon () {
    return interactionManager.select().getSelectPolygon()
  }

  export function resetSelectPolygon () {
    interactionManager.select().resetSelectPolygon()
  }

  // Expose contexts
  $: { graphicContext.set({ renderer, rootNode }) }
  $: { sectionContext.set(section) }
  $: { eventManagerContext.set(eventManager) }
  $: { interactionManagerContext.set(interactionManager) }
</script>

{#if renderer === 'svg'}

  <svg {id} {width} {height} bind:this={rootNode}>
    <Clipper {section} />
    <slot />
  </svg>

{/if}

{#if renderer === 'canvas'}

  <canvas {id} {width} {height} bind:this={rootNode} />
  <slot />

{/if}

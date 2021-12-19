<script>
  import { getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { InteractionManager } from '@snlab/rendervous'
  import Clipper from './_Clipper.svelte'
  import Rectangle from '../marks/rectangle/Rectangle.svelte'
  import { createHandler, getDeltas } from './utils.js'

  export let props
  export let id
  export let createFunction

  export let backgroundColor = undefined

  // Zooming and panning
  export let pannable = false
  export let panExtents = undefined

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

  // Get parent contexts
  const { renderer } = getContext('graphic')
  const parentSection = getContext('section')
  const eventManager = getContext('eventManager')

  // Initiate child contexts
  const sectionContext = writable()
  const interactionManagerContext = writable()
  setContext('section', sectionContext)
  setContext('interactionManager', interactionManagerContext)

  let zoomingOrPanning = writable(false)
  setContext('zoomingOrPanning', zoomingOrPanning)

  // Zooming/panning logic
  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }
  let previousCoordinates

  let onDownPan = (e) => {
    zoomingOrPanning.set(true)
    previousCoordinates = e.screenCoordinates
  }

  let onMovePan = (e) => {
    if (!$zoomingOrPanning) return;
    const currentCoordinates = e.screenCoordinates
    const { dx, dy } = getDeltas(previousCoordinates, currentCoordinates, panExtents)
    previousCoordinates = currentCoordinates

    zoomIdentity.x -= dx
    zoomIdentity.y -= dy
    zoomIdentity = zoomIdentity
  }

  let onUpPan = (e) => {
    zoomingOrPanning.set(false)
    previousCoordinates = undefined
  }

  $: mousedownHandler = createHandler(pannable, onDownPan, onMousedown)
  $: mousemoveHandler = createHandler(pannable, onMovePan, onMousemove)
  $: mouseupHandler = createHandler(pannable, onUpPan, onMouseup)

  $: touchdownHandler = createHandler(pannable, onDownPan, onTouchdown)
  $: touchmoveHandler = createHandler(pannable, onMovePan, onTouchmove)
  $: touchupHandler = createHandler(pannable, onUpPan, onTouchup)
  

  // Section data
  let section
  $: { section = createFunction({ ...props, zoomIdentity }, $parentSection) }

  // Interactivity
  const interactionManager = new InteractionManager()

  interactionManager.setId(id)
  interactionManager.linkEventManager(eventManager)

  $: { interactionManager.loadSection(section) }

  $: {
    removeSectionInteractionsIfNecessary(
      mousedownHandler,
      mouseupHandler,
      mousemoveHandler,
      touchdownHandler,
      touchupHandler,
      touchmoveHandler,

      onWheel,
      onClick,
      onMouseover,
      onMouseout,
      onTouchover,
      onTouchout,
      onPinch
    )
  }

  function removeSectionInteractionsIfNecessary () {
    if (interactionManager.getPrimaryInput() === 'mouse') {
      const sectionInterface = interactionManager.mouse().section()
      sectionInterface.removeAllInteractions()
      
      if (mousedownHandler) sectionInterface.addInteraction('mousedown', mousedownHandler)
      if (mouseupHandler) sectionInterface.addInteraction('mouseup', mouseupHandler)
      if (mousemoveHandler) sectionInterface.addInteraction('mousemove', mousemoveHandler)
      
      if (onWheel) sectionInterface.addInteraction('wheel', onWheel)
      if (onClick) sectionInterface.addInteraction('click', onClick)
      if (onMouseover) sectionInterface.addInteraction('mouseover', onMouseover)
      if (onMouseout) sectionInterface.addInteraction('mouseout', onMouseout)
    }

    if (interactionManager.getPrimaryInput() === 'touch') {
      const sectionInterface = interactionManager.touch().section()
      sectionInterface.removeAllInteractions()

      if (touchdownHandler) sectionInterface.addInteraction('touchdown', touchdownHandler)
      if (touchmoveHandler) sectionInterface.addInteraction('touchmove', touchmoveHandler)
      if (touchupHandler) sectionInterface.addInteraction('touchup', touchupHandler)

      if (onTouchover) sectionInterface.addInteraction('touchover', onTouchover)
      if (onTouchout) sectionInterface.addInteraction('touchout', onTouchout)
      if (onPinch) sectionInterface.addInteraction('pinch', onPinch)
    }
  }

  export const getSM = () => interactionManager.select()

  // Expose contexts
  $: { sectionContext.set(section) }
  $: { interactionManagerContext.set(interactionManager) }
</script>

{#if renderer === 'svg'}
  <Clipper {section} />

  {#if backgroundColor}
    <Rectangle fill={backgroundColor} />
  {/if}

  <g class="section">
    <slot />
  </g>
{/if}

{#if renderer === 'canvas'}
  {#if backgroundColor}
    <Rectangle fill={backgroundColor} />
  {/if}

  <slot />
{/if}

<script>
  import { getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { InteractionManager } from '@snlab/rendervous'
  import Clipper from './_Clipper.svelte'
  import Rectangle from '../marks/rectangle/Rectangle.svelte'
  import { panStart, panMove, panEnd, createHandler } from './utils.js'

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

  let zoomingOrPanning = writable()
  setContext('zoomingOrPanning', zoomingOrPanning)

  // Zooming/panning logic
  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }
  let previousCoordinates

  let pan = (dx, dy) => {
    zoomIdentity.x -= dx
    zoomIdentity.y -= dy
    zoomIdentity = zoomIdentity
  }

  let setPreviousCoordinates = coordinates => { previousCoordinates = coordinates }
  
  // Desktop
  $: onMousedownPan = pannable ? panStart(zoomingOrPanning, setPreviousCoordinates) : null
  $: onMouseupPan = pannable ? panEnd(zoomingOrPanning, setPreviousCoordinates) : null
  $: onMousemovePan = pannable ? panMove(
    $zoomingOrPanning,
    zoomIdentity,
    previousCoordinates,
    panExtents,
    setPreviousCoordinates,
    pan
  ) : null

  $: mousedownHandler = createHandler(onMousedownPan, onMousedown)
  $: mouseupHandler = createHandler(onMouseupPan, onMouseup)
  $: mousemoveHandler = createHandler(onMousemovePan, onMousemove)

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

      if (onTouchdown) sectionInterface.addInteraction('touchdown', onTouchdown)
      if (onTouchmove) sectionInterface.addInteraction('touchmove', onTouchmove)
      if (onTouchup) sectionInterface.addInteraction('touchup', onTouchup)
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

<script>
  import { getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import {
    parseZoomPanSettings,
    getZoomIdentityOnPan,
    getZoomIdentityOnZoom,
    createHandler,
    debounce,
    InteractionManager
  } from '@snlab/rendervous'
  import Clipper from './_Clipper.svelte'
  import Rectangle from '../marks/rectangle/Rectangle.svelte'

  export let props
  export let id
  export let createFunction

  export let backgroundColor = undefined

  // Zooming and panning
  export let pannable = false
  export let zoomable = false
  export let zoomPanSettings = undefined
  export let blockZoomPan = false

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
  const { 
    zoomingOrPanning: parentZoomingOrPanning
  } = getContext('zoomingOrPanning')

  // Initiate child contexts
  const sectionContext = writable()
  const interactionManagerContext = writable()
  setContext('section', sectionContext)
  setContext('interactionManager', interactionManagerContext)

  let zoomingOrPanning = writable(false)
  setContext('zoomingOrPanning', { zoomingOrPanning })

  // Zooming/panning logic
  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }

  $: parsedZoomPanSettings = parseZoomPanSettings(zoomPanSettings)

  // Panning
  let panning = false
  let previousCoordinates

  let onDownPan = (e) => {
    if (blockZoomPan) return
    panning = true
    previousCoordinates = e.screenCoordinates
  }

  let onMovePan = (e) => {
    if (blockZoomPan || !panning || zooming) return

    const newZoomIdentity = getZoomIdentityOnPan(
      previousCoordinates,
      e.screenCoordinates,
      zoomIdentity,
      section,
      parsedZoomPanSettings
    )

    if (newZoomIdentity) {
      zoomIdentity = newZoomIdentity
    }
  }

  let onUpPan = (e) => {
    panning = false
    previousCoordinates = undefined
  }

  $: mousedownHandler = createHandler(pannable, onDownPan, onMousedown)
  $: mousemoveHandler = createHandler(pannable, onMovePan, onMousemove)
  $: mouseupHandler = createHandler(pannable, onUpPan, onMouseup)

  $: touchdownHandler = createHandler(pannable, onDownPan, onTouchdown)
  $: touchmoveHandler = createHandler(pannable, onMovePan, onTouchmove)
  $: touchupHandler = createHandler(pannable, onUpPan, onTouchup)

  // Zooming
  let zooming = false
  const disableZooming = () => { zooming = false }

  $: disableZoomingDebounced = debounce(
    disableZooming,
    parsedZoomPanSettings.debounceReindexing
  )

  let onZoom = (e) => {
    if (blockZoomPan || panning) return
    zooming = true
    
    const newZoomIdentity = getZoomIdentityOnZoom(
      e,
      zoomIdentity,
      section,
      parsedZoomSettings
    )

    if (newZoomIdentity) {
      zoomIdentity = newZoomIdentity
    }

    disableZoomingDebounced()
  }

  $: wheelHandler = createHandler(zoomable, onZoom, onWheel)
  $: pinchHandler = createHandler(zoomable, onZoom, onPinch)

  $: {
    if (zooming || panning || $parentZoomingOrPanning) {
      zoomingOrPanning.set(true)
    } else {
      zoomingOrPanning.set(false)
    }
  }

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
      // pan handlers
      mousedownHandler,
      mouseupHandler,
      mousemoveHandler,
      touchdownHandler,
      touchupHandler,
      touchmoveHandler,

      // zoom handlers
      wheelHandler,
      pinchHandler,

      // other event handlers
      onClick,
      onMouseover,
      onMouseout,
      onTouchover,
      onTouchout
    )
  }

  function removeSectionInteractionsIfNecessary () {
    if (interactionManager.getPrimaryInput() === 'mouse') {
      const sectionInterface = interactionManager.mouse().section()
      sectionInterface.removeAllInteractions()
      
      if (mousedownHandler) sectionInterface.addInteraction('mousedown', mousedownHandler)
      if (mouseupHandler) sectionInterface.addInteraction('mouseup', mouseupHandler)
      if (mousemoveHandler) sectionInterface.addInteraction('mousemove', mousemoveHandler)
      
      if (wheelHandler) sectionInterface.addInteraction('wheel', wheelHandler)

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
      
      if (pinchHandler) sectionInterface.addInteraction('pinch', pinchHandler)

      if (onTouchover) sectionInterface.addInteraction('touchover', onTouchover)
      if (onTouchout) sectionInterface.addInteraction('touchout', onTouchout)
    }
  }

  // Expose instance methods
  export const getSM = () => interactionManager.select()
  export const startZoomPan = () => { !blockZoomPan && zoomingOrPanning.set(true) }
  export const setZoomIdentity = newZoomIdentity => { !blockZoomPan && (zoomIdentity = newZoomIdentity) }
  export const endZoomPan = () => { !blockZoomPan && zoomingOrPanning.set(false) }
  export const getZoomIdentity = () => zoomIdentity

  // Set contexts
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

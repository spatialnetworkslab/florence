<script context="module">
  let idCounter = 0

  function getId () {
    return 'sc' + idCounter++
  }
</script>

<script>
  import { getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { createSection, InteractionManager } from '@snlab/rendervous'
  import Clipper from './Clipper.svelte'

  const id = getId()

  // Positioning
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

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

  // Get parent contexts
  const { renderer } = getContext('graphic')
  const parentSection = getContext('section')
  const eventManager = getContext('eventManager')

  // Initiate child contexts
  const sectionContext = writable()
  const interactionManagerContext = writable()
  setContext('section', sectionContext)
  setContext('interactionManager', interactionManagerContext)

  // Section data
  let section

  $: {
    section = createSection({
      x1,
      x2,
      y1,
      y2,
      coordinates,
      scaleX,
      scaleY,
      flipX,
      flipY,
      padding,
      zoomIdentity,
      clip,
      id
    }, $parentSection)
  }

  // Interactivity
  const interactionManager = new InteractionManager()

  interactionManager.setId(id)
  interactionManager.linkEventManager(eventManager)

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
  $: { sectionContext.set(section) }
  $: { interactionManagerContext.set(interactionManager) }
</script>

{#if renderer === 'svg'}
  <Clipper {section} />

  <g class="section">
    <slot />
  </g>
{/if}

{#if renderer === 'canvas'}
  <slot />
{/if}

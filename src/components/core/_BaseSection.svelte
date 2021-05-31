<script>
  import { getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { InteractionManager } from '@snlab/rendervous'
  import Clipper from './_Clipper.svelte'
  import Rectangle from '../marks/rectangle/Rectangle.svelte'

  export let props
  export let id
  export let createFunction

  export let backgroundColor = undefined

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

  // Section data
  let section
  $: { section = createFunction(props, $parentSection) }

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

<script context="module">
  let idCounter = 0

  function getId () {
    return 'gr' + idCounter++
  }
</script>

<script>
  import { onMount, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { createSection, EventManager } from 'rendervous'
  import Section from '../Section/Section.svelte'

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
  const eventManagerContext = writable()
  setContext('graphic', graphicContext)
  setContext('eventManager', eventManagerContext)

  // Interactivity: set up globally
  const eventManager = new EventManager()
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

    // Expose contexts
  $: { graphicContext.set({ renderer, rootNode }) }
  $: { eventManagerContext.set(eventManager) }
</script>

{#if renderer === 'svg'}

  <svg {id} {width} {height} bind:this={rootNode}>

    <Section
      x1={0}
      x2={width}
      y1={0}
      y2={height}
      {coordinates}
      {scaleX}
      {scaleY}
      {flipX}
      {flipY}
      {padding}
      {zoomIdentity}
      {onClick}
      {onWheel}
      {onMousedown}
      {onMouseup}
      {onMouseover}
      {onMouseout}
      {onMousemove}
      {onPinch}
      {onTouchdown}
      {onTouchmove}
      {onTouchup}
      {onTouchover}
      {onTouchout}
      {clip}
    >
    
      <slot />

    </Section>

  </svg>

{/if}

{#if renderer === 'canvas'}

  <canvas {id} {width} {height} bind:this={rootNode} />
  
  <Section
    x1={0}
    x2={width}
    y1={0}
    y2={height}
    {coordinates}
    {scaleX}
    {scaleY}
    {flipX}
    {flipY}
    {padding}
    {zoomIdentity}
    {onClick}
    {onWheel}
    {onMousedown}
    {onMouseup}
    {onMouseover}
    {onMouseout}
    {onMousemove}
    {onPinch}
    {onTouchdown}
    {onTouchmove}
    {onTouchup}
    {onTouchover}
    {onTouchout}
    {clip}
  >
    
    <slot />

  </Section>

{/if}

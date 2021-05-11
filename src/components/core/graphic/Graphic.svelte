<script context="module">
  let idCounter = 0

  function getId () {
    return 'gr' + idCounter++
  }
</script>

<script>
  import { onMount, setContext, tick } from 'svelte'
  import { writable } from 'svelte/store'
  import { EventManager } from '@snlab/rendervous'
  import Section from '../section/Section.svelte'
  // import wrapContext from './wrapContext.js'

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
  // export let renderer = 'canvas'

  const id = getId()

  let rootNode
  let context
  let dirty = writable(false)
  const marksAndLayers = {}

  setContext('graphic', { renderer, dirty, marksAndLayers })

  // Set up EventManager for this Graphic
  const eventManager = new EventManager()
  setContext('eventManager', eventManager)

  onMount(() => {
    // Only on mount can we bind the svg root node and attach actual event listeners.
    // Sometimes rootNode is undefined for some weird reason. In this case,
    // we will use document.getElementById instead
    if (!rootNode) {
      rootNode = document.getElementById(id)
    }

    if (renderer === 'canvas') {
      // context = wrapContext(rootNode.getContext('2d'))
      context = rootNode.getContext('2d')
    }

    eventManager.addRootNode(rootNode, renderer)
    eventManager.attachEventListeners()
  })

  const isEmpty = id => [' ', ''].includes(id)

  function render () {
    context.clearRect(0, 0, width, height)
    const childArray = Array.from(document.getElementById(`div-${id}`).childNodes)

    for (let i = 0; i < childArray.length; i++) {
      const id = childArray[i].data

      if (!isEmpty(id)) {
        marksAndLayers[id].render(context)
      }
    }
  }

  $: {
    if ($dirty) {
      tick().then(() => {
        render()
        dirty.set(false)
      })
    }
  } 
</script>

{#if renderer === 'svg'}

  <svg {id} {width} {height} bind:this={rootNode}>

    <Section
      x1={0}
      x2={width}
      y1={0}
      y2={height}
      {coordinates}
      scaleX={scaleX ?? [0, width]}
      scaleY={scaleY ?? [0, height]}
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
    scaleX={scaleX ?? [0, width]}
    scaleY={scaleY ?? [0, height]}
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
    
    <div style="display: none;" id={`div-${id}`}>
      <slot />
    </div>

  </Section>

{/if}

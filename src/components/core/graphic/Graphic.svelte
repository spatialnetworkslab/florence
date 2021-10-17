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
  import { testId, TEST_ENV } from '../../../helpers/test.js'

  // Positioning
  export let width = 500
  export let height = 500

  // Aesthetics
  export let backgroundColor = undefined

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
  export let blockReindexing = undefined

  // testing
  export let _testDummies = undefined

  let mounted = false
  const isMounted = () => mounted

  const id = getId()

  let rootNode
  let context
  let dirty = writable(false)
  let globalBlockReindexing = writable(blockReindexing)
  $: { if (isMounted()) globalBlockReindexing.set(blockReindexing) }

  const marksAndLayers = {}

  setContext('graphic', { renderer, dirty, marksAndLayers, globalBlockReindexing })

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
      context = rootNode.getContext('2d')
    }
    
    if (TEST_ENV && _testDummies) {
      const { dummyRoot, dummyWindow } = _testDummies
      eventManager.addRootNode(dummyRoot, renderer, dummyWindow)
    } else {
      eventManager.addRootNode(rootNode, renderer)
    }

    eventManager.attachEventListeners()
    mounted = true
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

  let node

  export const selectRectangle = rect => node.getSM().selectRectangle(rect)
  export const updateSelectRectangle = rect => node.getSM().updateSelectRectangle(rect)
  export const resetSelectRectangle = () => node.getSM().resetSelectRectangle()
  export const startSelectPolygon = c => node.getSM().startSelectPolygon(c)
  export const addPointToSelectPolygon = c => node.getSM().addPointToSelectPolygon(c)
  export const moveSelectPolygon = delta => node.getSM().moveSelectPolygon(delta)
  export const getSelectPolygon = () => node.getSM().getSelectPolygon()
  export const resetSelectPolygon = () => node.getSM().resetSelectPolygon()
</script>

{#if renderer === 'svg'}

  <svg {id} {width} {height} bind:this={rootNode} data-testid={testId('root')}>

    <Section
      bind:this={node}
      x1={0}
      x2={width}
      y1={0}
      y2={height}
      {backgroundColor}
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

  <canvas {id} {width} {height} bind:this={rootNode} data-testid={testId('root')} />
  
  <Section
    bind:this={node}
    x1={0}
    x2={width}
    y1={0}
    y2={height}
    {backgroundColor}
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
    
    <div style="display: none;" id={`div-${id}`}>
      <slot />
    </div>

  </Section>

{/if}

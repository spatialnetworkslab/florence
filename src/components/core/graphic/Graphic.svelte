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
  import { getSectionPositioning, sectionPositioningEqual } from './sectionPositioning.js'

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

  // Other options
  export let clip = 'padding'
  export let renderer = 'svg'

  // testing
  export let _testDummies = undefined

  const id = getId()

  let mounted = false
  const isMounted = () => mounted

  let containerWidth
  let containerHeight
  let sectionPositioning = getSectionPositioning(
    width,
    height
  )

  function updateSectionPositioning (...args) {
    const newSectionPositioning = getSectionPositioning(...args)

    if (!sectionPositioningEqual(sectionPositioning, newSectionPositioning)) {
      sectionPositioning = newSectionPositioning
    }
  }

  $: {
    if (isMounted()) {
      updateSectionPositioning(
        width,
        height,
        containerWidth,
        containerHeight
      )
    }
  }

  let rootNode
  let context
  let dirty = writable(false)

  const marksAndLayers = {}

  setContext('graphic', { renderer, dirty, marksAndLayers })

  // Set up EventManager for this Graphic
  const eventManager = new EventManager()
  setContext('eventManager', eventManager)

  onMount(() => {
    updateSectionPositioning(
      width,
      height,
      containerWidth,
      containerHeight
    )

    tick().then(() => {
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

  // Expose instance methods
  let node

  export const selectRectangle = rect => node.selectRectangle(rect)
  export const updateSelectRectangle = rect => node.updateSelectRectangle(rect)
  export const resetSelectRectangle = () => node.resetSelectRectangle()
  export const startSelectPolygon = c => node.startSelectPolygon(c)
  export const addPointToSelectPolygon = c => node.addPointToSelectPolygon(c)
  export const moveSelectPolygon = delta => node.moveSelectPolygon(delta)
  export const getSelectPolygon = () => node.getSelectPolygon()
  export const resetSelectPolygon = () => node.resetSelectPolygon()

  export const startZoomPan = () => node.startZoomPan()
  export const setZoomIdentity = newZoomIdentity => node.setZoomIdentity(newZoomIdentity)
  export const endZoomPan = () => node.endZoomPan()
  export const getZoomIdentity = () => node.getZoomIdentity()

  // Adding dummy zoomingOrPanning context, so that child components don't
  // try to destructure undefined
  setContext('zoomingOrPanning', { zoomingOrPanning: writable(false) })

  $: props = {
    ...sectionPositioning, backgroundColor, coordinates,
    scaleX, scaleY, flipX, flipY, padding,
    pannable, zoomable, zoomPanSettings, blockZoomPan,
    onClick, onWheel, onMousedown, onMouseup, onMouseover, onMouseout, onMousemove,
    onPinch, onTouchdown, onTouchmove, onTouchup, onTouchover, onTouchout, 
    clip
  }
</script>

<div 
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
  style={`
    ${width.constructor === String ? `width: ${width};` : ''}
    ${height.constructor === String ? `height: ${height};` : ''}`
  }
>

  {#if renderer === 'svg' && sectionPositioning}

    <svg {id} {width} {height} bind:this={rootNode} data-testid={testId('root')}>

      <Section
        bind:this={node}
        {...props}
      >
    
        <slot />

      </Section>

    </svg>

  {/if}

  {#if renderer === 'canvas' && sectionPositioning}

    <canvas {id} {width} {height} bind:this={rootNode} data-testid={testId('root')} />
  
    <Section
      bind:this={node}
      {...props}
    >
    
      <div style="display: none;" id={`div-${id}`}>
        <slot />
      </div>

    </Section>

  {/if}

</div>

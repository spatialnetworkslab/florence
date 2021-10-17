<script context="module">
  let layerId = 0
  const getId = () => 'l' + layerId++
</script>

<script>
  import { getContext, onMount, onDestroy } from 'svelte'
  import { svgStyled, getClipPathURL } from '@snlab/rendervous'
  import any from '../utils/any.js'
  import merge from '../utils/merge.js'
  import { testId } from '../../../helpers/test.js'

  export let positioning
  export let aesthetics

  export let createLayer
  export let parseAesthetics
  export let className
  export let element = 'path'

  // Other
  export let outputSettings = undefined
  export let blockReindexing = undefined

  // Mouse interactions
  export let onClick = undefined
  export let onMousedown = undefined
  export let onMouseup = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
  export let onMousedrag = undefined

  // Touch interactions
  export let onTouchdown = undefined
  export let onTouchup = undefined
  export let onTouchover = undefined
  export let onTouchout = undefined
  export let onTouchdrag = undefined

  // Select interactions
  export let onSelect = undefined
  export let onDeselect = undefined

  // Get parent contexts
  const { renderer, marksAndLayers, dirty, globalBlockReindexing } = getContext('graphic')
  const section = getContext('section')
  const interactionManager = getContext('interactionManager')

  const id = getId()

  const createSVGContext = element === 'path'
    ? svgStyled.pathLayer
    : svgStyled.textLayer

  // Init
  let mounted

  onMount(() => {
     mounted = true
     if (renderer === 'canvas') { dirty.set(true) }
     updateInteractionManagerIfNecessary()
  })

  const isMounted = () => mounted

  let layer = create()
  marksAndLayers[id] = layer

  function create () {
    let _layer = createLayer(
      merge(positioning, aesthetics),
      $section,
      outputSettings
    )

    _layer.id = id

    return _layer
  }

  let svgContext
  let svgData

  if (renderer === 'svg') {
    svgContext = createSVGContext()
    layer.render(svgContext)
    svgData = svgContext.result()
  }

  // Handling of updates
  let updatePositioning = false
  let updateAesthetics = false

  function scheduleUpdatePositioning () { if (isMounted()) { updatePositioning = true } }
  function scheduleUpdateAesthetics () { if (isMounted()) { updateAesthetics = true } }

  $: { if (positioning) { scheduleUpdatePositioning() } }
  $: { if (aesthetics) { scheduleUpdateAesthetics() } }
  $: { if ($section || outputSettings) { scheduleUpdatePositioning() } }

  $: {
    if (updatePositioning) {
      layer = create()

      if (renderer === 'svg') {
        svgContext = createSVGContext()
        layer.render(svgContext)
        svgData = svgContext.result()
      }

      if (renderer === 'canvas') {
        marksAndLayers[id] = layer
        dirty.set(true)
      }

      updateInteractionManagerIfNecessary()
    }

    if (!updatePositioning && updateAesthetics) {
      const parsedAesthetics = parseAesthetics(aesthetics)

      const strokeWidthChanged = layer.props.strokeWidth !== parsedAesthetics.strokeWidth
      const clipChanged = layer.props.clip !== parsedAesthetics.clip

      layer.updateAesthetics(parsedAesthetics)

      if (strokeWidthChanged || clipChanged) {
        updateInteractionManagerIfNecessary()
      }

      if (renderer === 'svg') {
        svgContext = createSVGContext()
        layer.render(svgContext)
        svgData = svgContext.result()
      }

      if (renderer === 'canvas') {
        dirty.set(true)
      }
    }

    updatePositioning = false
    updateAesthetics = false
  }

  // Interactivity
  $: primaryInput = $interactionManager.getPrimaryInput()
  $: isInteractiveMouse = primaryInput === 'mouse' && any(onClick, onMousedown, onMouseup, onMouseover, onMouseout, onMousedrag)
  $: isInteractiveTouch = primaryInput === 'touch' && any(onTouchdown, onTouchup, onTouchover, onTouchout, onTouchdrag)
  $: isSelectable = any(onSelect, onDeselect)

  function updateInteractionManagerIfNecessary () {
    if (blockReindexing === undefined) {
      if ($globalBlockReindexing) return
    } else {
      if (blockReindexing === true) return
    }

    if (isInteractiveMouse || isInteractiveTouch) {
      removeLayerFromSpatialIndexIfNecessary()

      if (isInteractiveMouse) {
        const markInterface = $interactionManager.mouse().marks()

        markInterface.loadLayer(layer)

        if (onClick) markInterface.addLayerInteraction('click', layer, onClick)
        if (onMousedown) markInterface.addLayerInteraction('mousedown', layer, onMousedown)
        if (onMouseup) markInterface.addLayerInteraction('mouseup', layer, onMouseup)
        if (onMouseout) markInterface.addLayerInteraction('mouseout', layer, onMouseout)
        if (onMouseover) markInterface.addLayerInteraction('mouseover', layer, onMouseover)
        if (onMousedrag) markInterface.addLayerInteraction('mousedrag', layer, onMousedrag)
      }

      if (isInteractiveTouch) {
        const markInterface = $interactionManager.touch().marks()

        markInterface.loadLayer(layer)

        if (onTouchdown) markInterface.addLayerInteraction('touchdown', layer, onTouchdown)
        if (onTouchup) markInterface.addLayerInteraction('touchup', layer, onTouchup)
        if (onTouchover) markInterface.addLayerInteraction('touchover', layer, onTouchover)
        if (onTouchout) markInterface.addLayerInteraction('touchout', layer, onTouchout)
        if (onTouchdrag) markInterface.addLayerInteraction('touchdrag', layer, onTouchdrag)
      }
    }

    removeLayerFromSelectIfNecessary()
  
    if (isSelectable) {
      const selectManager = $interactionManager.select()

      selectManager.loadLayer(layer, { onSelect, onDeselect })
    }
  }

  function removeLayerFromSpatialIndexIfNecessary () {
    if (primaryInput === 'mouse') {
      const markMouseInterface = $interactionManager.mouse().marks()

      if (markMouseInterface.layerIsLoaded(layer)) {
        markMouseInterface.removeAllLayerInteractions(layer)
        markMouseInterface.removeLayer(layer)
      }
    }

    if (primaryInput === 'touch') {
      const markTouchInterface = $interactionManager.touch().marks()

      if (markTouchInterface.layerIsLoaded(layer)) {
        markTouchInterface.removeAllLayerInteractions(layer)
        markTouchInterface.removeLayer(layer)
      }
    }
  }

  function removeLayerFromSelectIfNecessary () {
    const selectManager = $interactionManager.select()

    if (selectManager.layerIsLoaded(layer)) {
      selectManager.removeLayer(layer)
    }
  }

  onDestroy(() => {
    if (renderer === 'canvas') {
      delete marksAndLayers[id]
      dirty.set(true)
    }
  })
</script>

{#if renderer === 'svg'}

  <g 
    class={className}
    clip-path={getClipPathURL(aesthetics, $section)}
    data-testid={testId(className)}
  >

    {#if element === 'path' && aesthetics.keys === undefined}
      {#each svgData as mark}
        <path 
          {...mark}
          data-testid={testId(`${className}-mark`)}
        />
      {/each}
    {/if}

    {#if element === 'path' && aesthetics.keys !== undefined}
      {#each svgData as mark, i (aesthetics.keys[i])}
        <path 
          {...mark}
          data-testid={testId(`${className}-mark`)}
        />
      {/each}
    {/if}

    {#if element === 'text' && aesthetics.keys === undefined}
      {#each svgData as mark}
        <text 
          {...mark}
          text={undefined}
          data-testid={testId(`${className}-mark`)}
        >
          {mark.text}
        </text>
      {/each}
    {/if}

    {#if element === 'text' && aesthetics.keys !== undefined}
      {#each svgData as mark, i (aesthetics.keys[i])}
        <text 
          {...mark}
          text={undefined}
          data-testid={testId(`${className}-mark`)}
        >
          {mark.text}
        </text>
      {/each}
    {/if}

  </g>

{/if}

{#if renderer === 'canvas'}
  {id}
{/if}

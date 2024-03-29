<script context="module">
  let markId = 0
  const getId = () => 'm' + markId++
</script>

<script>
  import { getContext, onMount, onDestroy } from 'svelte'
  import { svgStyled, getClipPathURL } from '@snlab/rendervous'
  import any from '../utils/any.js'
  import { testId } from '../../../utils/test.js'

  export let positioning
  export let aesthetics

  export let createMark
  export let parseAesthetics
  export let className
  export let element = 'path'

  // Other
  export let outputSettings = undefined

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
  const { renderer, marksAndLayers, dirty } = getContext('graphic')
  const section = getContext('section')
  const interactionManager = getContext('interactionManager')
  const { blockReindexing: parentBlockReindexing } = getContext('blockReindexing')

  const id = getId()

  const createSVGContext = element === 'path'
    ? svgStyled.path
    : svgStyled.text

  // Init
  let mounted

  onMount(() => {
     mounted = true
     if (renderer === 'canvas') { dirty.set(true) }
     updateInteractionManagerIfNecessary()
  })

  const isMounted = () => mounted

  let mark = create()
  marksAndLayers[id] = mark

  function create () {
    let _mark = createMark(
      { ...positioning, ...aesthetics },
      $section,
      outputSettings
    )

    _mark.id = id

    return _mark
  }

  let svgContext
  let svgData

  if (renderer === 'svg') {
    svgContext = createSVGContext()
    mark.render(svgContext)
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
      mark = create()

      if (renderer === 'svg') {
        svgContext = createSVGContext()
        mark.render(svgContext)
        svgData = svgContext.result()
      }

      if (renderer === 'canvas') {
        marksAndLayers[id] = mark
        dirty.set(true)
      }

      updateInteractionManagerIfNecessary()
    }

    if (!updatePositioning && updateAesthetics) {
      const parsedAesthetics = parseAesthetics(aesthetics)

      const strokeWidthChanged = mark.props.strokeWidth !== parsedAesthetics.strokeWidth
      const clipChanged = mark.props.clip !== parsedAesthetics.clip

      mark.updateAesthetics(parsedAesthetics)

      if (strokeWidthChanged || clipChanged) {
        updateInteractionManagerIfNecessary()
      }

      if (renderer === 'svg') {
        svgContext = createSVGContext()
        mark.render(svgContext)
        svgData = svgContext.result()
      }

      if (renderer === 'canvas') {
        dirty.set(true)
      }
    }

    updatePositioning = false
    updateAesthetics = false
  }

  $: {
    if (isMounted() && !$parentBlockReindexing && !blockReindexing) {
      updateInteractionManagerIfNecessary()
    }
  }

  // Interactivity
  let blockReindexing = false
  const setBlockReindexing = (bool) => { blockReindexing = bool }

  $: mouseDragHandler = onMousedrag && primaryInput === 'mouse'
    ? (e) => {
      switch(e.dragType) {
        case 'start':
          setBlockReindexing(true)
          break
        case 'end':
          setBlockReindexing(false)
          break;
      }

      onMousedrag(e)
    }
    : undefined
  
  $: touchDragHandler = onTouchdrag && primaryInput === 'touch'
    ? (e) => {
      switch(e.dragType) {
        case 'start':
          setBlockReindexing(true)
          break
        case 'end':
          setBlockReindexing(false)
          break;
      }

      onTouchdrag(e)
    }
    : undefined

  $: primaryInput = $interactionManager.getPrimaryInput()
  $: isInteractiveMouse = primaryInput === 'mouse' && any(onClick, onMousedown, onMouseup, onMouseover, onMouseout, onMousedrag)
  $: isInteractiveTouch = primaryInput === 'touch' && any(onTouchdown, onTouchup, onTouchover, onTouchout, onTouchdrag)
  $: isSelectable = any(onSelect, onDeselect)

  function updateInteractionManagerIfNecessary () {
    if ($parentBlockReindexing || blockReindexing) return

    if (isInteractiveMouse || isInteractiveTouch) {
      removeMarkFromSpatialIndexIfNecessary()

      if (isInteractiveMouse) {
        const markInterface = $interactionManager.mouse().marks()

        markInterface.loadMark(mark)

        if (mouseDragHandler) markInterface.addMarkInteraction('mousedrag', mark, mouseDragHandler)

        if (onClick) markInterface.addMarkInteraction('click', mark, onClick)
        if (onMousedown) markInterface.addMarkInteraction('mousedown', mark, onMousedown)
        if (onMouseup) markInterface.addMarkInteraction('mouseup', mark, onMouseup)
        if (onMouseout) markInterface.addMarkInteraction('mouseout', mark, onMouseout)
        if (onMouseover) markInterface.addMarkInteraction('mouseover', mark, onMouseover)
      }

      if (isInteractiveTouch) {
        const markInterface = $interactionManager.touch().marks()

        markInterface.loadMark(mark)
        
        if (touchDragHandler) markInterface.addMarkInteraction('touchdrag', mark, touchDragHandler)

        if (onTouchdown) markInterface.addMarkInteraction('touchdown', mark, onTouchdown)
        if (onTouchup) markInterface.addMarkInteraction('touchup', mark, onTouchup)
        if (onTouchover) markInterface.addMarkInteraction('touchover', mark, onTouchover)
        if (onTouchout) markInterface.addMarkInteraction('touchout', mark, onTouchout)
      }
    }

    removeMarkFromSelectIfNecessary()
  
    if (isSelectable) {
      const selectManager = $interactionManager.select()

      selectManager.loadMark(mark, { onSelect, onDeselect })
    }
  }

  function removeMarkFromSpatialIndexIfNecessary () {
    if (primaryInput === 'mouse') {
      const markMouseInterface = $interactionManager.mouse().marks()

      if (markMouseInterface.markIsLoaded(mark)) {
        markMouseInterface.removeAllMarkInteractions(mark)
        markMouseInterface.removeMark(mark)
      }
    }

    if (primaryInput === 'touch') {
      const markTouchInterface = $interactionManager.touch().marks()

      if (markTouchInterface.markIsLoaded(mark)) {
        markTouchInterface.removeAllMarkInteractions(mark)
        markTouchInterface.removeMark(mark)
      }
    }
  }

  function removeMarkFromSelectIfNecessary () {
    const selectManager = $interactionManager.select()

    if (selectManager.markIsLoaded(mark)) {
      selectManager.removeMark(mark)
    }
  }

  onDestroy(() => {
    if (renderer === 'canvas') {
      delete marksAndLayers[id]
      dirty.set(true)
    }
  })
</script>

{#if renderer === "svg"}
  {#if element === "path"}
    <path
      {...svgData}
      class={className}
      clip-path={getClipPathURL(aesthetics, $section)}
      data-testid={testId(className)}
    />
  {/if}

  {#if element === "text"}
    <text
      {...svgData}
      text={undefined}
      class={className}
      clip-path={getClipPathURL(aesthetics, $section)}
      data-testid={testId(className)}
    >
      {svgData.text}
    </text>
  {/if}
{/if}

{#if renderer === "canvas"}
  {id}
{/if}

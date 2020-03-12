<script context="module">
  let idCounter = 0
  function getId () {
    return 'funcline' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'
  import detectIt from 'detect-it'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'

  import createScreenGeometry from './createScreenGeometry.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'
  import generatePath from '../utils/generatePath.js'
  import { createDataNecessaryForIndexingMark } from '../Mark/createDataNecessaryForIndexing.js'
  import parseRenderSettings from '../utils/parseRenderSettings.js' 
  import any from '../utils/any.js'

  const markId = getId()

  let initPhase = true
  const initDone = () => !initPhase

  // Aesthetics: positioning
  export let func = undefined
  export let x = undefined

  // Aesthetics: other
  export let strokeWidth = 1
  export let stroke = 'black'
  export let opacity = 1

  // Transitions
  export let transition = undefined

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

  // Other
  export let renderSettings = undefined
  export let blockReindexing = false

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()

  let screenGeometry = createScreenGeometry(
    { func, x },
    $sectionContext,
    parseRenderSettings(renderSettings)
  )

  // Initiate transitionables
  let tr_screenGeometry = createTransitionable('geometry', screenGeometry, transition)
  let tr_stroke = createTransitionable('stroke', stroke, transition)
  let tr_strokeWidth = createTransitionable('strokeWidth', strokeWidth, transition)
  let tr_opacity = createTransitionable('opacity', opacity, transition)

  // Handle screenGeometry changes
  $: {
    if (initDone()) {
      screenGeometry = createScreenGeometry(
        { func, x },
        $sectionContext,
        parseRenderSettings(renderSettings)
      )

      tr_screenGeometry.set(screenGeometry)

      updateInteractionManagerIfNecessary()
    }
  }

  // Handle other changes
  $: { if (initDone()) tr_stroke.set(stroke) }
  $: { if (initDone()) tr_strokeWidth.set(strokeWidth) }
  $: { if (initDone()) tr_opacity.set(opacity) }

  let previousTransition

  // Update transitionables when transition settings change
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      tr_screenGeometry = createTransitionable('geometry', $tr_screenGeometry, transition)
      tr_stroke = createTransitionable('stroke', $tr_stroke, transition)
      tr_strokeWidth = createTransitionable('strokeWidth', $tr_strokeWidth, transition)
      tr_opacity = createTransitionable('opacity', $tr_opacity, transition)
    }
  })

  afterUpdate(() => {
    initPhase = false
  })

  // Interactivity
  $: isInteractiveMouse = detectIt.hasMouse && any(onClick, onMousedown, onMouseup, onMouseover, onMouseout, onMousedrag)
  $: isInteractiveTouch = detectIt.hasTouch && any(onTouchdown, onTouchup, onTouchover, onTouchout, onTouchdrag)

  $: isSelectable = onSelect !== undefined || onDeselect !== undefined

  onMount(() => {
    updateInteractionManagerIfNecessary()
  })

  onDestroy(() => {
    removeMarkFromSpatialIndexIfNecessary()
  })

  // Helpers
  function updateInteractionManagerIfNecessary () {
    if (initPhase || !(blockReindexing || $sectionContext.blockReindexing)) {
      removeMarkFromSpatialIndexIfNecessary()

      if (isInteractiveMouse) {
        const markInterface = $interactionManagerContext.mouse().marks()

        markInterface.loadMark('Line', createDataNecessaryForIndexing())

        if (onClick) markInterface.addMarkInteraction('click', markId, onClick)
        if (onMousedown) markInterface.addMarkInteraction('mousedown', markId, onMousedown)
        if (onMouseup) markInterface.addMarkInteraction('mouseoup', markId, onMouseup)
        if (onMouseover) markInterface.addMarkInteraction('mouseover', markId, onMouseover)
        if (onMouseout) markInterface.addMarkInteraction('mouseout', markId, onMouseout)
        if (onMousedrag) markInterface.addMarkInteraction('mousedrag', markId, onMousedrag)
      }

      if (isInteractiveTouch) {
        const markInterface = $interactionManagerContext.touch().marks()

        markInterface.loadMark('Line', createDataNecessaryForIndexing())

        if (onTouchdown) markInterface.addMarkInteraction('touchdown', markId, onTouchdown)
        if (onTouchup) markInterface.addMarkInteraction('touchup', markId, onTouchup)
        if (onTouchover) markInterface.addMarkInteraction('touchover', markId, onTouchover)
        if (onTouchout) markInterface.addMarkInteraction('touchout', markId, onTouchout)
        if (onTouchdrag) markInterface.addMarkInteraction('touchdrag', markId, onTouchdrag)
      }
    }

    removeMarkFromSelectIfNecessary()

    if (isSelectable) {
      const selectManager = $interactionManagerContext.select()

      selectManager.loadMark(
        'Line', createDataNecessaryForIndexing(), { onSelect, onDeselect }
      )
    }
  }

  function removeMarkFromSpatialIndexIfNecessary () {
    if (detectIt.hasMouse) {
      const markMouseInterface = $interactionManagerContext.mouse().marks()

      if (markMouseInterface.markIsLoaded(markId)) {
        markMouseInterface.removeAllMarkInteractions(markId)
        markMouseInterface.removeMark(markId)
      }
    }

    if (detectIt.hasTouch) {
      const markTouchInterface = $interactionManagerContext.touch().marks()

      if (markTouchInterface.markIsLoaded(markId)) {
        markTouchInterface.removeAllMarkInteractions(markId)
        markTouchInterface.removeMark(markId)
      }
    }
  }

  function removeMarkFromSelectIfNecessary () {
    const selectManager = $interactionManagerContext.select()

    if (selectManager.markIsLoaded(markId)) {
      selectManager.removeMark(markId)
    }
  }

  function createDataNecessaryForIndexing () {
    return createDataNecessaryForIndexingMark(
      'Line', markId, { pixelGeometry: screenGeometry }, { strokeWidth }
    )
  }
</script>

{#if $graphicContext.output() === 'svg'}

  <path
    class="line"
    d={generatePath($tr_screenGeometry)}
    fill="none"
    stroke-width={$tr_strokeWidth}
    stroke={$tr_stroke}
    opacity={$tr_opacity}
  />

{/if}

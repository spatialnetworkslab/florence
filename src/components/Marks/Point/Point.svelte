<script>
  import { getContext, onMount } from 'svelte'
  import { createPoint, parseAestheticsPoint, svgPositioning, getClipPathURL } from '@snlab/rendervous'
  import any from '../utils/any.js'

  // Positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

  // Aesthetics
  export let radius = undefined
  export let fill = undefined
  export let stroke = undefined
  export let strokeWidth = undefined
  export let strokeOpacity = undefined
  export let fillOpacity = undefined
  export let opacity = undefined
  export let lineCap = undefined
  export let dashArray = undefined
  export let dashOffset = undefined

  // Other
  export let outputSettings = undefined
  export let clip = undefined

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
  const graphicContext = getContext('graphic')
  const sectionContext = getContext('section')
  const interactionManagerContext = getContext('interactionManager')

  // Init
  let mounted
  onMount(() => { mounted = true })
  const isMounted = () => mounted

  let updatePositioning = false
  let updateAesthetics = false

  let point = create()

  function create () {
    return createPoint({
      x,
      y,
      geometry,
      radius,
      fill,
      stroke,
      strokeWidth,
      strokeOpacity,
      fillOpacity,
      opacity,
      lineCap,
      dashArray,
      dashOffset,
      clip
    }, $sectionContext, outputSettings)
  }

  let positioningContext
  let positioningSvg

  if ($graphicContext.renderer === 'svg') {
    positioningContext = svgPositioning.path()
    point.render(positioningContext)
    positioningSvg = positioningContext.result()
  }

  // Handling prop updates
  $: { if (isMounted() && (x || y || geometry || radius)) { scheduleUpdatePositioning() } }
  $: { if (isMounted() && ($graphicContext || $sectionContext || outputSettings)) { scheduleUpdatePositioning() } }

  $: {
    if (
      isMounted() &&
      (radius || fill || stroke || strokeWidth ||
      strokeOpacity || fillOpacity || opacity ||
      lineCap || dashArray || dashOffset || clip)
    ) {
      scheduleUpdateAesthetics()
    }
  }

  $: {
    if (mounted) {
      if (updatePositioning) {
        point = create()

        if ($graphicContext.renderer === 'svg') {
          positioningContext = svgPositioning.path()
          point.render(positioningContext)
          positioningSvg = positioningContext.result()
        }

        if ($graphicContext.renderer === 'canvas') {
          point.render($graphicContext.context)
        }

        updateInteractionManagerIfNecessary()
      }

      if (!updatePositioning && updateAesthetics) {
        const parsedAesthetics = parseAestheticsPoint({
          fill,
          stroke,
          strokeWidth,
          strokeOpacity,
          fillOpacity,
          opacity,
          lineCap,
          dashArray,
          dashOffset,
          clip
        })

        const strokeWidthChanged = point.props.strokeWidth !== parsedAesthetics.strokeWidth 

        point.updateAesthetics(parsedAesthetics)

        if (strokeWidthChanged) {
          updateInteractionManagerIfNecessary()
        }

        if ($graphicContext.renderer === 'canvas') {
          point.render($graphicContext.context)
        }

        if ($graphicContext.renderer === 'svg') {
          point = point
        }
      }

      updatePositioning = false
      updateAesthetics = false
    }
  }

  function scheduleUpdatePositioning () { updatePositioning = true }
  function scheduleUpdateAesthetics () { updateAesthetics = true }

  // Interactivity
  $: primaryInput = $interactionManagerContext.getPrimaryInput()
  $: isInteractiveMouse = primaryInput === 'mouse' && any(onClick, onMousedown, onMouseup, onMouseover, onMouseout, onMousedrag)
  $: isInteractiveTouch = primaryInput === 'touch' && any(onTouchdown, onTouchup, onTouchover, onTouchout, onTouchdrag)
  $: isSelectable = any(onSelect, onDeselect)

  function updateInteractionManagerIfNecessary () {
    if (isInteractiveMouse || isInteractiveTouch) {
      removeMarkFromSpatialIndexIfNecessary()

      if (isInteractiveMouse) {
        const markInterface = $interactionManagerContext.mouse().marks()

        markInterface.loadMark(point)

        if (onClick) markInterface.addMarkInteraction('click', point, onClick)
        if (onMousedown) markInterface.addMarkInteraction('mousedown', point, onMousedown)
        if (onMouseup) markInterface.addMarkInteraction('mouseup', point, onMouseup)
        if (onMouseout) markInterface.addMarkInteraction('mouseout', point, onMouseout)
        if (onMouseover) markInterface.addMarkInteraction('mouseover', point, onMouseover)
        if (onMousedrag) markInterface.addMarkInteraction('mousedrag', point, onMousedrag)
      }

      if (isInteractiveTouch) {
        const markInterface = $interactionManagerContext.touch().marks()

        markInterface.loadMark(point)

        if (onTouchdown) markInterface.addMarkInteraction('touchdown', point, onTouchdown)
        if (onTouchup) markInterface.addMarkInteraction('touchup', point, onTouchup)
        if (onTouchover) markInterface.addMarkInteraction('touchover', point, onTouchover)
        if (onTouchout) markInterface.addMarkInteraction('touchout', point, onTouchout)
        if (onTouchdrag) markInterface.addMarkInteraction('touchdrag', point, onTouchdrag)
      }
    }

    removeMarkFromSelectIfNecessary()
  
    if (isSelectable) {
      const selectManager = $interactionManagerContext.select()

      selectManager.loadMark(point, { onSelect, onDeselect })
    }
  }

  function removeMarkFromSpatialIndexIfNecessary () {
    if (primaryInput === 'mouse') {
      const markMouseInterface = $interactionManagerContext.mouse().marks()

      if (markMouseInterface.markIsLoaded(point)) {
        markMouseInterface.removeAllMarkInteractions(point)
        markMouseInterface.removeMark(point)
      }
    }

    if (primaryInput === 'touch') {
      const markTouchInterface = $interactionManagerContext.touch().marks()

      if (markTouchInterface.markIsLoaded(point)) {
        markTouchInterface.removeAllMarkInteractions(point)
        markTouchInterface.removeMark(point)
      }
    }
  }

  function removeMarkFromSelectIfNecessary () {
    const selectManager = $interactionManagerContext.select()

    if (selectManager.markIsLoaded(point)) {
      selectManager.removeMark(point)
    }
  }
</script>

{#if $graphicContext.renderer === 'svg'}
  <path
    {...positioningSvg}
    class="point"
    clip-path={getClipPathURL({ clip }, $sectionContext)}
    fill={point.props.fill}
    stroke={point.props.stroke}
    stroke-width={point.props.strokeWidth}
    fill-opacity={point.props.fillOpacity}
    stroke-opacity={point.props.strokeOpacity}
    opacity={point.props.opacity}
    stroke-linecap={point.props.lineCap}
    stroke-dasharray={point.props.dashArray}
    stroke-dashoffset={point.props.dashOffset}
  />
{/if}

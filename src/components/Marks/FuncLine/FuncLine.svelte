<script context="module">
  let idCounter = 0
  function getId () {
    return 'funcline' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate } from 'svelte'

  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as CoordinateTransformationContext from '../../Core/Section/CoordinateTransformationContext'
  import * as InteractionManagerContext from '../../Core/Section/InteractionManagerContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'

  import createScreenGeometry from './createScreenGeometry.js'
  import { createTransitionable, transitionsEqual } from '../utils/transitions'
  import generatePath from '../utils/generatePath.js'

  let markId = getId()

  let initPhase = true
  const initDone = () => !initPhase

  // Aesthetics: positioning
  export let func

  // Aesthetics: other
  export let strokeWidth = undefined
  export let stroke = undefined
  export let opacity = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  let screenGeometry = createScreenGeometry()

  // Initiate transitionables
  let tr_screenGeometry = createTransitionable('geometry', screenGeometry, transition)
  let tr_stroke = createTransitionable('stroke', aesthetics.stroke, transition)
  let tr_strokeWidth = createTransitionable('strokeWidth', aesthetics.strokeWidth, transition)
  let tr_opacity = createTransitionable('opacity', aesthetics.opacity, transition)

  // Handle screenGeometry changes
  $: {
    if (initDone()) {
      screenGeometry = createScreenGeometry()
      tr_screenGeometry.set(screenGeometry)
    }
  }

  // Handle other changes
  $: { if (initDone()) tr_stroke.set(aesthetics.stroke) }
  $: { if (initDone()) tr_strokeWidth.set(aesthetics.strokeWidth) }
  $: { if (initDone()) tr_opacity.set(aesthetics.opacity) }

  let previousTransition

  // Update transitionables when transition settings change
  beforeUpdate(() => {
    if (!transitionsEqual(previousTransition, transition)) {
      previousTransition = transition

      
    }
  })

  afterUpdate(() => {
    initPhase = false
  })
</script>

<path
  class="line"
  d={generatePath($tr_screenGeometry)}
  fill="none"
  stroke-width={$tr_strokeWidth}
  stroke={$tr_stroke}
  style={`opacity: ${$tr_opacity}`}
/>
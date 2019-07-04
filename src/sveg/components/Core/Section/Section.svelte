<script context="module">
  let idCounter = 0
  function getId () {
    return 'sc' + idCounter++
  }
</script>

<script>
  import { onMount } from 'svelte'

  import * as GraphicContext from '../Graphic/GraphicContext'
  import * as SectionContext from './SectionContext'
  import * as CoordinateTransformationContext from '../CoordinateTransformation/CoordinateTransformationContext'
  import * as EventManagerContext from '../Graphic/EventManagerContext'
  import * as InteractionManagerContext from './InteractionManagerContext'

  import InteractionManager from '../../../classes/InteractionManager'

  import { scaleCoordinates } from '../../Marks/Rectangle/generateCoordinates.js'

  let sectionId = getId()

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let scaleX = undefined
  export let scaleY = undefined
  export let scaleGeo = undefined

  // Interactivity
  export let onWheel = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const newSectionContext = SectionContext.init()
  CoordinateTransformationContext.ensureNotParent()
  const eventManagerContext = EventManagerContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.init()

  $: {
    let scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
    let rangeX = [scaledCoordinates.x1, scaledCoordinates.x2]
    let rangeY = [scaledCoordinates.y1, scaledCoordinates.y2]

    if (!scaleGeo && (scaleX && scaleY)){
      SectionContext.update(
        newSectionContext, { sectionId, rangeX, rangeY, scaleX, scaleY }
      )
    } else if (scaleGeo && (!scaleX && !scaleY)) {
      SectionContext.update(
        newSectionContext, { sectionId, rangeX, rangeY, scaleX, scaleY }
      )
    } else if (scaleGeo && (scaleX || scaleY)) {
     throw new Error(`Cannot set 'scale-x' or 'scale-y' when 'scale-geo' is defined`)
    }
  }

  // Interactivity
  $: isInteractive = onWheel !== undefined || onClick !== undefined || onMouseover !== undefined || onMouseout !== undefined
  
  onMount(() => {
    updateInteractionManagerIfNecessary()
  })

  function updateInteractionManagerIfNecessary () {
    let interactionManager = new InteractionManager()
    interactionManager.setId(sectionId)
    interactionManager.linkEventManager($eventManagerContext)
    InteractionManagerContext.update(interactionManagerContext, interactionManager)

    if (isInteractive) {
      let scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
      let rangeX = [scaledCoordinates.x1, scaledCoordinates.x2]
      let rangeY = [scaledCoordinates.y1, scaledCoordinates.y2]

      $interactionManagerContext.loadSection('Section', {rangeX, rangeY, sectionId})
      if (onClick) $interactionManagerContext.addSectionInteraction('click', sectionId, onClick)
      if (onMouseover) $interactionManagerContext.addSectionInteraction('mouseover', sectionId, onMouseover)
      if (onMouseout) $interactionManagerContext.addSectionInteraction('mouseout', sectionId, onMouseout)
      if (onWheel) $interactionManagerContext.addSectionInteraction('wheel', sectionId, onWheel)
      //if (onClick) $interactionManagerContext.addSectionInteraction('click', sectionId, onClick)
    }
  }

</script>

<g class="section">
  <slot />
</g>
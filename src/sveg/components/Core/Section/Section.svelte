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
  //export let onPan = undefined

  // Aesthetics
  export let padding = 3
  export let backgroundColor = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const newSectionContext = SectionContext.init()
  CoordinateTransformationContext.ensureNotParent()
  const eventManagerContext = EventManagerContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.init()

  let scaledCoordinates

  $: {
    scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
    let rangeX = [scaledCoordinates.x1 + padding, scaledCoordinates.x2 - padding]
    let rangeY = [scaledCoordinates.y1 + padding, scaledCoordinates.y2 - padding]

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
      //if (onPan) $interactionManagerContext.addSectionInteraction('pan', sectionId, onPan)
    }
  }

</script>

<defs>
  <clipPath id={`clip-${sectionId}`}>
    <rect 
      x={scaledCoordinates.x1} y={scaledCoordinates.y1}
      width={scaledCoordinates.x2 - scaledCoordinates.x1}
      height={scaledCoordinates.y2 - scaledCoordinates.y1}
    />
  </clipPath>
</defs>

<g class="section" clip-path={`url(#clip-${sectionId})`} >
  {#if backgroundColor}
    <rect width="100%" height="100%" fill={backgroundColor}/>
  {/if}
  
  <slot />
</g>
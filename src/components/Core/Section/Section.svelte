<script context="module">
  let idCounter = 0
  function getId () {
    return 'sc' + idCounter++
  }
</script>

<script>
  import { beforeUpdate, afterUpdate, onMount, onDestroy } from 'svelte'
  import * as GraphicContext from '../Graphic/GraphicContext'
  import * as SectionContext from './SectionContext'
  import * as CoordinateTransformationContext from '../CoordinateTransformation/CoordinateTransformationContext'
  import * as EventManagerContext from '../Graphic/EventManagerContext'
  import * as InteractionManagerContext from './InteractionManagerContext'
  import * as ZoomContext from './ZoomContext'

  import InteractionManager from '../../../classes/InteractionManager'
  import { scaleCoordinates } from '../../Marks/Rectangle/generateScreenGeometry.js'

  let sectionId = getId()
  
  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let scaleX = undefined
  export let scaleY = undefined
  export let zoomIdentity = undefined

  export let scaleGeo = undefined
  
  // Interactivity
  export let onWheel = undefined
  export let onPan = undefined

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
  const zoomContext = ZoomContext.init()
<<<<<<< HEAD
  
  let scaledCoordinates
  
  $: {
    scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
    let rangeX = [scaledCoordinates.x1 + padding, scaledCoordinates.x2 - padding]
    let rangeY = [scaledCoordinates.y1 + padding, scaledCoordinates.y2 - padding]

    SectionContext.update(
        newSectionContext, { sectionId, rangeX, rangeY, scaleX, scaleY }
      )
  }
=======

>>>>>>> dce9377a55a6a8857144259233e6558678791518
  
  let scaledCoordinates
  
  // Set up InteractionManager
  let interactionManager = new InteractionManager()
  interactionManager.setId(sectionId)
  interactionManager.linkEventManager($eventManagerContext)
  InteractionManagerContext.update(interactionManagerContext, interactionManager)
  let isInteractive = undefined

  // update zooming and panning
  $: {
    ZoomContext.update(zoomContext, zoomIdentity)
  }
    
  // Interactivity
  $: isInteractive = onWheel !== undefined || onPan !== undefined

  onMount(() => {
    updateInteractionManagerIfNecessary()
  })
  
  onDestroy(() => {
    removeSectionInteractionsIfNecessary()
  })
  
  // Helpers
  function updateInteractionManagerIfNecessary () {
    if (isInteractive) {
      let scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
      let rangeX = [scaledCoordinates.x1, scaledCoordinates.x2]
      let rangeY = [scaledCoordinates.y1, scaledCoordinates.y2]
      
      $interactionManagerContext.loadSection('Section', {rangeX, rangeY, sectionId})
      console.log(onWheel)
      if (onWheel) $interactionManagerContext.addSectionInteraction('wheel', sectionId, onWheel)
      if (onPan) $interactionManagerContext.addSectionInteraction('pan', sectionId, onPan)
    }
  }
  
  function removeSectionInteractionsIfNecessary () {
    if ($interactionManagerContext.sectionIsLoaded(sectionId)) {
      $interactionManagerContext.removeAllSectionInteractions(sectionId)
      $interactionManagerContext.removeSection(sectionId)
    }
  // Update InteractionManager on changes
  $: {
    scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
    let rangeX = [scaledCoordinates.x1 + padding, scaledCoordinates.x2 - padding]
    let rangeY = [scaledCoordinates.y1 + padding, scaledCoordinates.y2 - padding]
    
    SectionContext.update(
      newSectionContext, { sectionId, rangeX, rangeY, scaleX, scaleY }
    )
  }

  // Update zooming and panning
  $: {
    ZoomContext.update(zoomContext, zoomIdentity)
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
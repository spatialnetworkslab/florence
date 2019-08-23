<script context="module">
  let idCounter = 0
  function getId () {
    return 'sc' + idCounter++
  }
</script>

<script>
  import { beforeUpdate } from 'svelte'
  import * as GraphicContext from '../Graphic/GraphicContext'
  import * as SectionContext from './SectionContext'
  import * as CoordinateTransformationContext from './CoordinateTransformationContext'
  import * as EventManagerContext from '../Graphic/EventManagerContext'
  import * as InteractionManagerContext from './InteractionManagerContext'
  import * as ZoomContext from './ZoomContext'

  import InteractionManager from '../../../classes/InteractionManager'
  import { scaleCoordinates } from '../../Marks/Rectangle/createCoordSysGeometry.js'

  let sectionId = getId()
  
  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let padding = 10
  export let scaleX = undefined
  export let scaleY = undefined
  export let flipX = false
  export let flipY = false
  export let zoomIdentity = undefined
  export let transformation = undefined

  // Aesthetics
  export let backgroundColor = undefined
  export let paddingColor = undefined

  // Interactivity
  export let onWheel = undefined
  export let onPan = undefined
  
  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const newSectionContext = SectionContext.init()
  const coordinateTransformationContext = CoordinateTransformationContext.subscribe()
  const newCoordinateTransformationContext = CoordinateTransformationContext.init()
  const eventManagerContext = EventManagerContext.subscribe()
  const interactionManagerContext = InteractionManagerContext.init()
  const zoomContext = ZoomContext.init()
  
  let scaledCoordinates
  let rangeX
  let rangeY

  // set up padding
  if (typeof padding === 'number') {
    padding = {left: padding, right: padding, top: padding, bottom: padding}
  }
  
  // Set up InteractionManager
  let interactionManager = new InteractionManager()
  interactionManager.setId(sectionId)
  interactionManager.linkEventManager($eventManagerContext)
  InteractionManagerContext.update(interactionManagerContext, interactionManager)

  // Keep SectionContext and CoordinateTransformationContext up to date
  $: {
    scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
    rangeX = [scaledCoordinates.x1 + padding.left, scaledCoordinates.x2 - padding.right]
    rangeY = [scaledCoordinates.y1 + padding.top, scaledCoordinates.y2 - padding.bottom]
    if (flipX) rangeX.reverse()
    if (flipY) rangeY.reverse()
    
    const updatedSectionContext = { 
      sectionId, rangeX, rangeY, scaleX, scaleY, padding, flipX, flipY
    }

    SectionContext.update(
      newSectionContext, updatedSectionContext
    )

    CoordinateTransformationContext.update(
      newCoordinateTransformationContext, { rangeX, rangeY, transformation }
    )

    $interactionManagerContext.loadSection($newSectionContext)
    $interactionManagerContext.loadCoordinateTransformation($newCoordinateTransformationContext)
  }

  // Change callbacks if necessary
  $: {
    removeSectionInteractionsIfNecessary(onWheel, onPan)
  }

  // Update zooming and panning
  $: {
    ZoomContext.update(zoomContext, zoomIdentity)
    $interactionManagerContext.loadZoom($zoomContext)
  }

  beforeUpdate(() => {
    CoordinateTransformationContext.ensureNotParent($coordinateTransformationContext)
  })

  function removeSectionInteractionsIfNecessary () {
    $interactionManagerContext.removeAllSectionInteractions()

    if (onWheel) $interactionManagerContext.addSectionInteraction('wheel', onWheel)
    if (onPan) $interactionManagerContext.addSectionInteraction('pan', onPan)
  }
</script>

<defs>
  <clipPath id={`clip-${sectionId}`}>
    <rect 
      x={Math.min(scaledCoordinates.x1, scaledCoordinates.x2)}
      y={Math.min(scaledCoordinates.y1, scaledCoordinates.y2)}
      width={Math.abs(scaledCoordinates.x2 - scaledCoordinates.x1)}
      height={Math.abs(scaledCoordinates.y2 - scaledCoordinates.y1)}
    />
  </clipPath>
  <clipPath id={`clip-${sectionId}-data`}>
    <rect 
      x={Math.min(...rangeX)}
      y={Math.min(...rangeY)}
      width={Math.abs(rangeX[0] - rangeX[1])}
      height={Math.abs(rangeY[0] - rangeY[1])}
      fill="white"
    />
  </clipPath>
</defs>

<g class="section" clip-path={`url(#clip-${sectionId})`} >
  {#if paddingColor}
    <rect class="padding-background"
      mask={`url(#clip-${sectionId}-data)`}
      width="100%"
      height="100%" 
      fill={paddingColor}
    />
  {/if}
  {#if backgroundColor}
    <rect class="content-background"
      x={Math.min(...rangeX)}
      y={Math.min(...rangeY)}
      width={Math.abs(rangeX[0] - rangeX[1])}
      height={Math.abs(rangeY[0] - rangeY[1])}
      fill={backgroundColor}
    />
  {/if}
  <slot />
</g>
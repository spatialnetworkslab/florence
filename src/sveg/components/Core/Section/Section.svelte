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
  export let padding = 3

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

    SectionContext.update(
      newSectionContext, { sectionId, rangeX, rangeY, scaleX, scaleY }
    )
  }

  onMount(() => {
    let interactionManager = new InteractionManager()
    interactionManager.setId(sectionId)
    interactionManager.linkEventManager($eventManagerContext)

    InteractionManagerContext.update(interactionManagerContext, interactionManager)
  })
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

<g class="section" clip-path={`url(#clip-${sectionId})`}>
  <slot />
</g>
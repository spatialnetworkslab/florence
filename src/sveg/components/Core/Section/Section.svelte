<script context="module">
  let idCounter = -1
  function getId () {
    return 'sc' + idCounter++
  }
</script>

<script>
  import * as GraphicContext from '../Graphic/GraphicContext'
  import * as SectionContext from './SectionContext'
  import * as CoordinateTransformationContext from '../CoordinateTransformation/CoordinateTransformationContext'
  import InteractionManager from './SectionContext/InteractionManager'
  import { scaleCoordinates } from '../../Marks/Rectangle/generateCoordinates.js'

  let sectionId = getId()

  // Props
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let scaleX = undefined
  export let scaleY = undefined

  // Contexts
  const graphicContext = GraphicContext.subscribe()
  const sectionContext = SectionContext.subscribe()
  const newSectionContext = SectionContext.init()
  CoordinateTransformationContext.ensureNotParent()

  const interactionManager = new InteractionManager()
  interactionManager.setId(sectionId)

  $: {
    let scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext)
    let rangeX = [scaledCoordinates.x1, scaledCoordinates.x2]
    let rangeY = [scaledCoordinates.y1, scaledCoordinates.y2]

    interactionManager.linkEventManager($graphicContext.eventManager())

    console.log($graphicContext.eventManager())

    SectionContext.update(
      newSectionContext, { sectionId, rangeX, rangeY, scaleX, scaleY, interactionManager }
    )
  }
</script>

<g class="section">
  <slot />
</g>
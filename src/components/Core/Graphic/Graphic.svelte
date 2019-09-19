<script>
  import { onMount } from 'svelte'

  import * as GraphicContext from './GraphicContext'
  import * as SectionContext from '../Section/SectionContext'
  import * as EventManagerContext from './EventManagerContext'
  import * as InteractionManagerContext from '../Section/InteractionManagerContext'
  import * as CoordinateTransformationContext from '../Section/CoordinateTransformationContext'
  import * as ZoomContext from '../Section/ZoomContext'

  import MouseEventManager from '../../../interactivity/events/MouseEventManager.js'
  import TouchEventManager from '../../../interactivity/events/TouchEventManager.js'
  import InteractionManager from '../../../classes/InteractionManager'

  import { parsePadding, applyPadding } from '../utils/padding.js'

  export let width
  export let height
  export let padding = 0
  export let scaleX = undefined
  export let scaleY = undefined
  export let flipX = false
  export let flipY = false
  export let renderer = undefined

  const graphicContext = GraphicContext.init()
  const sectionContext = SectionContext.init()
  const eventManagerContext = EventManagerContext.init()
  const interactionManagerContext = InteractionManagerContext.init()
  CoordinateTransformationContext.init()
  ZoomContext.init()

  $: {
    GraphicContext.update(graphicContext, { renderer })
  }

  let rootNode
 
  // set up event and interaction manager
  let eventManager = new EventManager()
  EventManagerContext.update(eventManagerContext, eventManager)

  let interactionManager = new InteractionManager()
  interactionManager.setId('graphic')
  interactionManager.linkEventManager(eventManager)

  InteractionManagerContext.update(interactionManagerContext, interactionManager)

  let _padding

  $: {
    let rangeX = [0, width]
    let rangeY = [0, height]    

    if (flipX) rangeX.reverse()
    if (flipY) rangeY.reverse()

    _padding = parsePadding(padding)
    rangeX = applyPadding(rangeX, _padding.left, _padding.right)
    rangeY = applyPadding(rangeY, _padding.top, _padding.bottom)

    SectionContext.update(sectionContext, 
      { sectionId: 'graphic', rangeX, rangeY, scaleX, scaleY, padding: _padding }
    )

    $interactionManagerContext.loadSection($sectionContext)
  }

  onMount(() => {
    // only on mount can we bind the svg root node and attach actual event listeners
    eventManager.addRootNode(rootNode)
    eventManager.detectDeviceType()
    eventManager.attachEventListeners()
  })
</script>

<svg 
  {width} 
  {height}
  bind:this={rootNode}
>
  <slot />
</svg>
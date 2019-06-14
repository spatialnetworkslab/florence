<script>
  import { onMount } from 'svelte'

  import * as GraphicContext from './GraphicContext'
  import * as SectionContext from '../Section/SectionContext'
  import * as EventManagerContext from './EventManagerContext'
  import * as InteractionManagerContext from '../Section/InteractionManagerContext'

  import EventManager from '../../../classes/EventManager'
  import InteractionManager from '../../../classes/InteractionManager'

  export let width
  export let height
  export let scaleX = undefined
  export let scaleY = undefined
  export let renderer = undefined

  const graphicContext = GraphicContext.init()
  const sectionContext = SectionContext.init()
  const eventManagerContext = EventManagerContext.init()
  const interactionManagerContext = InteractionManagerContext.init()

  $: {
    GraphicContext.update(graphicContext, { renderer })
  }

  $: {
    let rangeX = [0, width]
    let rangeY = [0, height]
    SectionContext.update(sectionContext, { rangeX, rangeY, scaleX, scaleY })
  }

  let rootNode

  onMount(() => {
    let eventManager = new EventManager(rootNode)
    EventManagerContext.update(eventManagerContext, eventManager)

    let interactionManager = new InteractionManager()
    interactionManager.setId('graphic')
    interactionManager.linkEventManager(eventManager)

    InteractionManagerContext.update(interactionManagerContext, interactionManager)
  })
</script>

<svg 
  {width} 
  {height}
  bind:this={rootNode}
>
  <slot />
</svg>
<script>
  import { onMount } from 'svelte'

  import * as GraphicContext from './GraphicContext'
  import * as SectionContext from '../Section/SectionContext'
  import * as EventManagerContext from './EventManagerContext'

  import EventManager from '../../../classes/EventManager'

  export let width
  export let height
  export let scaleX = undefined
  export let scaleY = undefined
  export let renderer = undefined

  const graphicContext = GraphicContext.init()
  const sectionContext = SectionContext.init()
  const eventManagerContext = EventManagerContext.init()

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
  })
</script>

<svg 
  {width} 
  {height}
  bind:this={rootNode}
>
  <slot />
</svg>
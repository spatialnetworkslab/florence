<script>
  import * as GraphicContext from './GraphicContext'
  import * as SectionContext from '../Section/SectionContext'

  import EventManager from './GraphicContext/EventManager.js'

  export let width
  export let height
  export let scaleX = undefined
  export let scaleY = undefined
  export let renderer = undefined

  const graphicContext = GraphicContext.init()
  const sectionContext = SectionContext.init()

  let eventManager

  function getEventManager (svgNode) {
    eventManager = new EventManager(svgNode)
  }

  $: {
    GraphicContext.update(graphicContext, { renderer, eventManager })
  }

  $: {
    let rangeX = [0, width]
    let rangeY = [0, height]
    SectionContext.update(sectionContext, { rangeX, rangeY, scaleX, scaleY })
  }
</script>

<svg 
  {width} 
  {height}
  use:getEventManager
>
  <slot />
</svg>
<script>
  import * as SectionContext from './SectionContext'
  import { generatePixelCoordinates } from '../../Marks/Rectangle/generatePoints.js'

  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let scaleX = undefined
  export let scaleY = undefined

  const sectionContext = SectionContext.subscribe()

  const newSectionContext = SectionContext.init()

  $: {
    let pixelCoordinates = generatePixelCoordinates({ x1, x2, y1, y2 }, $sectionContext)
    let rangeX = [pixelCoordinates.x1, pixelCoordinates.x2]
    let rangeY = [pixelCoordinates.y1, pixelCoordinates.y2]
    SectionContext.update(newSectionContext, { rangeX, rangeY, scaleX, scaleY })
  }
</script>

<g>
  <slot />
</g>
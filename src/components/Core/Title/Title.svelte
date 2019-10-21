<script>
  import Mark from '../../Marks/Mark/Mark.svelte' // src/components/Marks/Mark/Mark.svelte
  import { isValid, createTitleXCoord, createTitleYCoord } from "./utils.js"

    // Contexts
  import * as GraphicContext from '../Graphic/GraphicContext'
  import * as SectionContext from '../Section/SectionContext'
  
  // Permanent
  import * as ZoomContext from '../../Core/Section/ZoomContext'

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined
  export let vjust = 'top'
  export let hjust = 'center'
  export let xOffset = 0
  export let yOffset = 10

  // Aesthetics: Title
  export let title = 'Title Text'
  export let titleFill = 'black'
  export let titleStroke = undefined
  export let titleStrokeWidth = undefined
  export let titleStrokeOpacity = undefined
  export let titleFillOpacity = undefined
  export let titleOpacity = 1
  export let titleFontFamily = undefined
  export let titleFontSize = 20
  export let titleFontWeight = 'bold'
  export let titleRotation = 0
  export let titleAnchorPoint = 'center'

  // Aesthetics: Subtitle
  export let subtitle = ''
  export let subtitleFill = 'black'
  export let subtitleStroke = undefined
  export let subtitleStrokeWidth = undefined
  export let subtitleStrokeOpacity = undefined
  export let subtitleFillOpacity = undefined
  export let subtitleOpacity = 1
  export let subtitleFontFamily = undefined
  export let subtitleFontSize = 14
  export let subtitleFontWeight = 'normal'
  export let subtitleRotation = 0
  export let subtitleAnchorPoint = 'center'
  export let subtitleX = undefined
  export let subtitleY = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
  export let onDragstart = undefined
  export let onDrag = undefined
  export let onDragend = undefined

  // Other
  export let zoomIdentity = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const graphicContext = GraphicContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  let adjustSubtitle

  // Title text positioning wrt section/graphic context
  $: {
    if (!isValid(x, y)) {
      const xRange = $sectionContext.scaleX.range()
      const yRange = $sectionContext.scaleY.range()

      if (sectionContext.flipX) xRange.reverse()
      x = $sectionContext.scaleX.invert(createTitleXCoord(hjust, xRange, x, xOffset, titleFontSize))

      if (sectionContext.flipY) yRange.reverse()
      y = $sectionContext.scaleY.invert(createTitleYCoord(vjust, yRange, y, yOffset, titleFontSize))
    }
  }

  // Title text positioning wrt section/graphic context
  $: {
    if (subtitle.length > 0){
      if (!isValid(subtitleX, subtitleY)) {
        const yRange = $sectionContext.scaleY.range()
        subtitleX = x
        adjustSubtitle = $sectionContext.scaleY.invert(titleFontSize + yRange[0])
        subtitleY = y + adjustSubtitle
      }
    }
  }

  
</script>

{#if title.length > 0}
  <Mark
    type="Label"
    {x} {y} {geometry} 
    fill={titleFill} stroke={titleStroke} strokeWidth={titleStrokeWidth}
    strokeOpacity={titleStrokeOpacity} fillOpacity={titleFillOpacity} opacity={titleOpacity}
    text={title}
    fontFamily={titleFontFamily} fontSize={titleFontSize} fontWeight={titleFontWeight} rotation={titleRotation} anchorPoint={titleAnchorPoint}
    {transition} {onClick} {onMouseover} {onMouseout}
    {zoomIdentity} _asPolygon={false}
  />
{/if}

{#if subtitle.length > 0}
  <Mark
    type="Label"
    x={subtitleX} y={subtitleY} {geometry} 
    fill={subtitleFill} stroke={subtitleStroke} strokeWidth={subtitleStrokeWidth}
    strokeOpacity={subtitleStrokeOpacity} fillOpacity={subtitleFillOpacity} opacity={subtitleOpacity}
    text={subtitle}
    fontFamily={subtitleFontFamily} fontSize={subtitleFontSize} fontWeight={subtitleFontWeight} rotation={subtitleRotation} anchorPoint={titleAnchorPoint}
    {transition} {onClick} {onMouseover} {onMouseout}
    {zoomIdentity} _asPolygon={false}
  />
{/if}
<script>
  import { Line, LineLayer, Label, LabelLayer } from "../../../"
  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from "../../Core/Section/SectionContext"

  import { createYAxisCoords, createYTickGeoms, createYLabelGeoms, createTitleXCoord, createTitleYCoord} from "./createYAxisCoords.js"

  // global properties
  export let scale = undefined
  export let flip = false


  // axis baseline
  export let baseLine = true
  export let baseLineColor = 'black'
  export let baseLineOpacity = 1
  export let baseLineWidth = 1

  // axis positioning
  export let vjust = undefined
  export let y = undefined
  export let yOffset = undefined
  export let hjust = 'left'
  export let x = undefined
  export let xOffset = 0

  // tick marks
  export let ticks = true
  export let tickCount = 10
  export let tickExtra = false
  export let tickValues = undefined
  export let tickSize = 5
  export let tickWidth = 0.5
  export let tickColor = 'black'
  export let tickOpacity = 1

  // tick labels
  export let labelFormat = undefined
  export let labelOffset = 2
  export let labelRotate = 0
  export let labelFont = 'Helvetica'
  export let labelFontSize = 10
  export let labelFontWeight = 'normal'
  export let labelOpacity = 1
  export let labelColor = 'black'

  // axis title
  export let titleHjust = 'axis'
  export let titleXOffset = 'axis'
  export let titleX = undefined
  export let titleVjust = 'center'
  export let titleYOffset = 0
  export let titleY = undefined
  export let title = ''
  export let titleColor = 'black'
  export let titleFont = 'Helvetica'
  export let titleFontSize = '12'
  export let titleFontWeight = 'normal'
  export let titleOpacity = 1
  export let titleRotation = -90
  export let titleAnchorPoint = 'center'

  // transition
  export let transition = undefined
  export let zoomIdentity = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const graphicContext = GraphicContext.subscribe()
  
  let xCoords
  let yCoords
  let tickPositions
  let tickXCoords
  let tickYCoords
  let tickLabelXCoords
  let tickLabelYCoords
  let format
  let tickLabelText
  let titleXCoord
  let titleYCoord
  let axisWidth
  let labelAnchorPoint = 'r'
  let scaleY

  $: {
    scaleY = (typeof scale === "undefined") ? $sectionContext.scaleY : scale;
    ({xCoords, yCoords} = createYAxisCoords(hjust, x, xOffset, $sectionContext.scaleX, scaleY, $sectionContext));
  }
  $: {
    if (Array.isArray(tickValues) && tickValues.length > 0) {
      tickPositions = tickValues
    } else {
      tickPositions = scaleY.ticks(tickCount)
    }
    if (tickExtra && tickPositions[0] !== scaleY.domain()[0]) {
      tickPositions.unshift(scaleY.domain()[0])
    }
    ({tickXCoords, tickYCoords} = createYTickGeoms(tickPositions, xCoords, scaleY, baseLineWidth, tickSize, flip));
    ({tickLabelXCoords, tickLabelYCoords} = createYLabelGeoms(tickPositions, xCoords, scaleY, baseLineWidth, tickSize, labelOffset, flip))
    format = (labelFormat) ? labelFormat : scaleY.tickFormat(tickPositions.length)
    tickLabelText = tickPositions.map(format)
    axisWidth = baseLineWidth + tickSize + labelOffset + labelFontSize
    labelAnchorPoint = flip ? 'l' : 'r'
  }
  $: {
    if (title.length > 0) {
      titleXCoord = createTitleXCoord(titleHjust, xCoords, titleX, $sectionContext.scaleX, scaleY, titleXOffset, axisWidth, flip, titleFontSize, $sectionContext)
      titleYCoord = createTitleYCoord(titleVjust, yCoords, titleY, $sectionContext.scaleX, scaleY, titleYOffset, axisWidth, flip, titleFontSize, $sectionContext)
    }
  }
</script>

<g class="y-axis">

  {#if baseLine}
    <Line 
      x={xCoords} y={yCoords} strokeWidth={baseLineWidth} opacity={baseLineOpacity} stroke={baseLineColor}
      {zoomIdentity}
    />
  {/if}

  {#if ticks}
    <LineLayer 
      x={tickXCoords} y={tickYCoords} strokeWidth={tickWidth} opacity={tickOpacity} stroke={tickColor}
      {transition} {zoomIdentity}
    />
    <LabelLayer
      x={tickLabelXCoords} y={tickLabelYCoords} text={tickLabelText} anchorPoint={labelAnchorPoint}
      rotation={labelRotate} fontFamily={labelFont} fontSize={labelFontSize}
      fontWeight={labelFontWeight} opacity={labelOpacity} fill={labelColor}
      {transition} {zoomIdentity}
    />
  {/if}

  {#if title.length > 0}
    <Label 
      x={titleXCoord} y={titleYCoord} text={title} anchorPoint={titleAnchorPoint}
      rotation={titleRotation} fontFamily={titleFont} fontSize={titleFontSize}
      fontWeight={titleFontWeight} opacity={titleOpacity} fill={titleColor}
      {zoomIdentity}
    />
  {/if}

</g>
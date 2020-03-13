<script>
  import { Line, LineLayer, Label, LabelLayer } from '../../../index.js'
  import * as SectionContext from '../../Core/Section/SectionContext'

  import { createXAxisCoords, createXTickGeoms, createXLabelGeoms, createTitleXCoord, createTitleYCoord } from './createXAxisCoords.js'
  import { getTickPositions, getFormat } from './utils.js'

  // global properties
  export let scale = undefined
  export let flip = false

  // axis baseline
  export let baseLine = true
  export let baseLineColor = 'black'
  export let baseLineOpacity = 1
  export let baseLineWidth = 1

  // axis positioning
  export let vjust = 'bottom'
  export let y = undefined
  export let yOffset = 0

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
  export let titleHjust = 'center'
  export let titleXOffset = 0
  export let titleX = undefined
  export let titleVjust = 'axis'
  export let titleYOffset = 'axis'
  export let titleY = undefined
  export let title = ''
  export let titleColor = 'black'
  export let titleFont = 'Helvetica'
  export let titleFontSize = '12'
  export let titleFontWeight = 'normal'
  export let titleOpacity = 1
  export let titleRotation = 0
  export let titleAnchorPoint = 't'

  // transition
  export let transition = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()
  
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
  let axisHeight
  let labelAnchorPoint = 't'
  let scaleX

  $: {
    scaleX = (typeof scale === 'undefined') ? $sectionContext.scaleX : scale;
    ({ xCoords, yCoords } = createXAxisCoords(vjust, y, yOffset, scaleX, $sectionContext.scaleY, $sectionContext))
  }
  $: {
    tickPositions = getTickPositions(tickValues, scaleX, tickCount, tickExtra);
    ({ tickXCoords, tickYCoords } = createXTickGeoms(tickPositions, yCoords, scaleX, baseLineWidth, tickSize, flip));
    ({ tickLabelXCoords, tickLabelYCoords } = createXLabelGeoms(tickPositions, yCoords, scaleX, baseLineWidth, tickSize, labelOffset, flip))

    format = getFormat(labelFormat, scaleX, tickPositions.length)
    tickLabelText = tickPositions.map(format)
    axisHeight = baseLineWidth + tickSize + labelOffset + labelFontSize
    labelAnchorPoint = flip ? 'b' : 't'
  }
  $: {
    if (title.length > 0) {
      titleXCoord = createTitleXCoord(titleHjust, xCoords, titleX, scaleX, $sectionContext.scaleY, titleXOffset, axisHeight, flip, titleFontSize, $sectionContext)
      titleYCoord = createTitleYCoord(titleVjust, yCoords, titleY, scaleX, $sectionContext.scaleY, titleYOffset, axisHeight, flip, titleFontSize, $sectionContext)
    }
  }
</script>

<g class="x-axis">
    
  {#if baseLine}
    <Line 
      x={xCoords} y={yCoords} strokeWidth={baseLineWidth} opacity={baseLineOpacity} stroke={baseLineColor}
    />
  {/if}

  {#if ticks}
    <LineLayer 
      x={tickXCoords} y={tickYCoords} strokeWidth={tickWidth} opacity={tickOpacity} stroke={tickColor}
      {transition}
    />
    <LabelLayer
      x={tickLabelXCoords} y={tickLabelYCoords} text={tickLabelText} anchorPoint={labelAnchorPoint}
      rotation={labelRotate} fontFamily={labelFont} fontSize={labelFontSize}
      fontWeight={labelFontWeight} opacity={labelOpacity} fill={labelColor}
      {transition}
    />
  {/if}

  {#if title.length > 0}
    <Label 
      x={titleXCoord} y={titleYCoord} text={title} anchorPoint={titleAnchorPoint}
      rotation={titleRotation} fontFamily={titleFont} fontSize={titleFontSize}
      fontWeight={titleFontWeight} opacity={titleOpacity} fill={titleColor}
    />
  {/if}

</g>
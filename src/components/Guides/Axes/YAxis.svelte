<script>
  import { Line, LineLayer, Label, LabelLayer } from '../../../index.js'
  import * as SectionContext from '../../Core/Section/SectionContext'

  import { getAbsoluteXPosition } from './absolutePosition.js'
  import { getBaseLineCoordinatesYAxis } from './baseLine.js'
  import { getTicks, getTickCoordinatesYAxis, getFormat } from './ticks.js'
  import { getTickLabelCoordinatesYAxis } from './tickLabels.js'
  import { getTitleCoordinatesYAxis } from './title.js'

  // global properties
  export let flip = false

  // axis baseline
  export let baseLine = true
  export let baseLineColor = 'black'
  export let baseLineOpacity = 1
  export let baseLineWidth = 1

  // axis positioning
  export let hjust = 'right'
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
  export let titleVjust = 'center'
  export let titleYOffset = 0
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

  // Contexts
  const sectionContext = SectionContext.subscribe()
  
    // Absolute position (in pixels)
  $: xAbsolute = getAbsoluteXPosition(hjust, xOffset, $sectionContext)

  // Baseline
  $: baseLineCoordinates = getBaseLineCoordinatesYAxis(xAbsolute, $sectionContext)
  
  // Ticks
  $: ticks = getTicks(
    tickValues,
    $sectionContext.scaleY,
    tickCount,
    tickExtra,
    $sectionContext.zoomIdentity 
      ? { t: $sectionContext.zoomIdentity.y, k: $sectionContext.zoomIdentity.ky }
      : undefined
  )
  $: tickCoordinates = getTickCoordinatesYAxis(
    ticks,
    xAbsolute,
    $sectionContext,
    tickSize,
    flip
  )

  // Tick labels
  $: format = getFormat(labelFormat, $sectionContext.scaleY, ticks.length)
  $: tickLabelText = ticks.map(format)
  $: tickLabelCoordinates = getTickLabelCoordinatesYAxis(tickCoordinates, $sectionContext, labelOffset, flip)
  $: labelAnchorPoint = flip ? 'r' : 'l'

  // Title
  $: axisWidth = baseLineWidth + tickSize + labelOffset + labelFontSize
  $: titleCoordinates = getTitleCoordinatesYAxis(
    titleHjust,
    titleXOffset,
    titleVjust,
    titleYOffset,
    $sectionContext,
    flip,
    axisWidth,
    titleFontSize,
    xAbsolute
  )
</script>

<g class="y-axis">
    
  {#if baseLine}
    <Line 
      {...baseLineCoordinates}
      strokeWidth={baseLineWidth}
      opacity={baseLineOpacity}
      stroke={baseLineColor}
    />
  {/if}

  {#if ticks}
    <LineLayer 
      {...tickCoordinates}
      strokeWidth={tickWidth}
      opacity={tickOpacity}
      stroke={tickColor}
      {transition}
    />
    
    <LabelLayer
      {...tickLabelCoordinates}
      text={tickLabelText} 
      anchorPoint={labelAnchorPoint}
      rotation={labelRotate}
      fontFamily={labelFont}
      fontSize={labelFontSize}
      fontWeight={labelFontWeight}
      opacity={labelOpacity}
      fill={labelColor}
      {transition}
    />
  {/if}

  {#if title.length > 0}
    <Label 
      {...titleCoordinates}
      text={title}
      anchorPoint={titleAnchorPoint}
      rotation={titleRotation}
      fontFamily={titleFont}
      fontSize={titleFontSize}
      fontWeight={titleFontWeight}
      opacity={titleOpacity}
      fill={titleColor}
    />
  {/if}

</g>
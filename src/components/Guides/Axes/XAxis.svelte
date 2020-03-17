<script>
  import { Line, LineLayer, Label, LabelLayer } from '../../../index.js'
  import * as SectionContext from '../../Core/Section/SectionContext'

  import { getAbsoluteYPosition } from './absolutePosition.js'
  import { getBaseLineCoordinatesXAxis } from './baseLine.js'
  import { getTickPositions, getTickCoordinatesXAxis, getFormat } from './ticks.js'
  import { getTickLabelCoordinatesXAxis } from './tickLabels.js'
  import { getTitleCoordinatesXAxis } from './title.js'

  // global properties
  export let flip = false

  // axis baseline
  export let baseLine = true
  export let baseLineColor = 'black'
  export let baseLineOpacity = 1
  export let baseLineWidth = 1

  // axis positioning
  export let vjust = 'bottom'
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
  export let titleVjust = 'axis'
  export let titleYOffset = 'axis'
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

  // Make sure not polar
  $: {
    if ($sectionContext.transformation === 'polar') {
      throw new Error('Axes do\'nt work with polar coordinates (for now)')
    }
  }
  
  // Absolute position (in pixels)
  $: yAbsolute = getAbsoluteYPosition(vjust, yOffset, $sectionContext)

  // Baseline
  $: baseLineCoordinates = getBaseLineCoordinatesXAxis(yAbsolute, $sectionContext)
  
  // Ticks
  $: tickPositions = getTickPositions(
    tickValues,
    $sectionContext.scaleX,
    tickCount,
    tickExtra,
    $sectionContext.zoomIdentity 
      ? { t: $sectionContext.zoomIdentity.x, k: $sectionContext.zoomIdentity.kx }
      : undefined
  )
  $: tickCoordinates = getTickCoordinatesXAxis(
    tickPositions,
    yAbsolute,
    $sectionContext,
    tickSize,
    flip
  )

  // Tick labels
  $: format = getFormat(labelFormat, $sectionContext.scaleX, ticks.length)
  $: tickLabelText = tickPositions.map(format)
  $: tickLabelCoordinates = getTickLabelCoordinatesXAxis(tickCoordinates, $sectionContext, labelOffset, flip)
  $: labelAnchorPoint = flip ? 'b' : 't'

  // Title
  $: axisHeight = baseLineWidth + tickSize + labelOffset + labelFontSize
  $: titleCoordinates = getTitleCoordinatesXAxis(
    titleHjust,
    titleXOffset,
    titleVjust,
    titleYOffset,
    $sectionContext,
    flip,
    axisHeight,
    titleFontSize,
    yAbsolute
  )
</script>

<g class="x-axis">
    
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
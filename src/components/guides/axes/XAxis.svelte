<script>
  import { getContext } from 'svelte'
  import { Line, LineLayer, Label, LabelLayer } from '../../../index.js'

  import { parseVJust } from './just.js'
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
  export let labelOffset = 6
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
  export let titleFontSize = 12
  export let titleFontWeight = 'normal'
  export let titleOpacity = 1
  export let titleRotate = 0
  export let titleAnchorPoint = 't'

  // other
  export let clip = 'outer'

  // Contexts
  const section = getContext('section')

  $: {
    if ($section.coordinateSystem) {
      throw new Error('Cannot use axes with alternative coordinate systems (for now)')
    }
  }
  
  // Absolute position (in pixels)
  $: yAbs = parseVJust(vjust, yOffset, $section.paddedBbox)

  // Baseline
  $: baseLineCoordinates = getBaseLineCoordinatesXAxis(yAbs, $section)
  
  // Ticks
  $: tickPositions = getTickPositions(
    tickValues,
    $section.directScales.x,
    tickCount,
    tickExtra,
    $section.zoomIdentity 
      ? { t: $section.zoomIdentity.x, k: $section.zoomIdentity.kx }
      : undefined
  )

  $: tickCoordinates = getTickCoordinatesXAxis(
    tickPositions,
    yAbs,
    tickSize,
    flip
  )

  // Tick labels
  $: format = getFormat(labelFormat, $section.scaleX, ticks.length)
  $: tickLabelText = tickPositions.map(format)
  $: tickLabelCoordinates = getTickLabelCoordinatesXAxis(tickCoordinates, labelOffset, flip)
  $: labelAnchorPoint = flip ? 'b' : 't'

  // Title
  $: axisHeight = baseLineWidth + tickSize + labelOffset + labelFontSize
  $: titleCoordinates = getTitleCoordinatesXAxis(
    titleHjust,
    titleXOffset,
    titleVjust,
    titleYOffset,
    $section,
    flip,
    axisHeight,
    titleFontSize,
    yAbs
  )
</script>

{#if baseLine}
  <Line 
    {...baseLineCoordinates}
    strokeWidth={baseLineWidth}
    opacity={baseLineOpacity}
    stroke={baseLineColor}
    {clip}
  />
{/if}

{#if ticks}
  <LineLayer 
    {...tickCoordinates}
    strokeWidth={tickWidth}
    opacity={tickOpacity}
    stroke={tickColor}
    {clip}
  />
    
  <LabelLayer
    {...tickLabelCoordinates}
    text={tickLabelText} 
    anchorPoint={labelAnchorPoint}
    rotate={labelRotate}
    fontFamily={labelFont}
    fontSize={labelFontSize}
    fontWeight={labelFontWeight}
    opacity={labelOpacity}
    fill={labelColor}
    {clip}
  />
{/if}

{#if title.length > 0}
  <Label 
    {...titleCoordinates}
    text={title}
    anchorPoint={titleAnchorPoint}
    rotate={titleRotate}
    fontFamily={titleFont}
    fontSize={titleFontSize}
    fontWeight={titleFontWeight}
    opacity={titleOpacity}
    fill={titleColor}
    {clip}
  />
{/if}

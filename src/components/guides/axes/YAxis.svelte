<script>
  import { getContext } from 'svelte'
  import { Line, LineLayer, Label, LabelLayer } from '../../../index.js'

  import { parseHJust } from './just.js'
  import { getBaseLineCoordinatesYAxis } from './baseLine.js'
  import { getTickPositions, getTickCoordinatesYAxis, getFormat } from './ticks.js'
  import { getTickLabelCoordinatesYAxis, getTextWidth } from './tickLabels.js'
  import { getTitleCoordinatesYAxis } from './title.js'

  // global properties
  export let flip = false

  // axis baseline
  export let baseLine = true
  export let baseLineColor = 'black'
  export let baseLineOpacity = 1
  export let baseLineWidth = 1

  // axis positioning
  export let hjust = 'left'
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
  export let labelOffset = 4
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
  export let titleFontSize = 12
  export let titleFontWeight = 'normal'
  export let titleOpacity = 1
  export let titleRotate = -Math.PI / 2
  export let titleAnchorPoint = 'center'

  // other
  export let clip = 'outer'

  // Contexts
  const section = getContext('section')
  
  // Make sure not polar
  $: {
    if ($section.transformation === 'polar') {
      throw new Error('Axes do\'nt work with polar coordinates (for now)')
    }
  }

  // Absolute position (in pixels)
  $: xAbs = parseHJust(hjust, xOffset, $section.paddedBbox)

  // Baseline
  $: baseLineCoordinates = getBaseLineCoordinatesYAxis(xAbs, $section)
  
  // Ticks
  $: tickPositions = getTickPositions(
    tickValues,
    $section.directScales.y,
    tickCount,
    tickExtra,
    $section.zoomIdentity
      ? { t: $section.zoomIdentity.y, k: $section.zoomIdentity.ky }
      : undefined
  )

  $: tickCoordinates = getTickCoordinatesYAxis(
    tickPositions,
    xAbs,
    tickSize,
    flip
  )

  // Tick labels
  $: format = getFormat(labelFormat, $section.scaleY, ticks.length)
  $: tickLabelText = tickPositions.map(format)
  $: tickLabelCoordinates = getTickLabelCoordinatesYAxis(tickCoordinates, labelOffset, flip)
  $: labelAnchorPoint = flip ? 'l' : 'r'
  $: tickLabelWidth = getTextWidth(tickLabelText[tickLabelText.length - 1], labelFontSize, labelFont)

  // Title
  $: axisWidth = baseLineWidth + tickSize + labelOffset + tickLabelWidth
  $: titleCoordinates = getTitleCoordinatesYAxis(
    titleHjust,
    titleXOffset,
    titleVjust,
    titleYOffset,
    $section,
    flip,
    axisWidth,
    titleFontSize,
    xAbs
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

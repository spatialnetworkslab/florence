<script context="module">
  let idCounter = 0
  function getId () {
    return 'gradient' + idCounter++
  }
</script>

<script>
  import { scaleLinear } from 'd3-scale'
  import { Section, Point, Label, LabelLayer, Rectangle, RectangleLayer, Symbol_ } from '../../../index.js'
  import { createPosYCoords, createPosXCoords, createTitleXCoord, createTitleYCoord } from './createLegendCoordinates.js'
  import { removePadding } from '../../Core/utils/padding.js'

  // Contexts
  import * as SectionContext from '../../Core/Section/SectionContext'
  
  // Permanent
  import { getTickPositions, getFormat, getTicks, getColorGeoms, isValid } from './utils.js'

  // General props
  export let legend = 'discrete'
  export let color = 'coral'
  export let scale = scaleLinear().domain([0, 2, 5, 8, 9]).range(["red", "blue"])
  let gradientId = getId()

  // Aesthetics: positioning
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let orient = 'horizontal'
  export let vjust = 'center'
  export let height = undefined
  export let hjust = 'left'
  export let width = 0
  export let xOffset = 0
  export let yOffset = 0
  export let usePadding = false

  // Flip properties
  export let flipX = false
  export let flipY = false

  // Aesthetics: colors
  export let stroke = 'none'
  export let strokeWidth = 2

  // Aesthetics
  export let fill = undefined
  export let fillOpacity = undefined

  // Tick label settings
  export let labels = undefined // enable no label render
  export let labelFormat = undefined
  export let labelRotate = 0
  export let labelX = undefined
  export let labelY = undefined
  export let labelFont = 'Helvetica'
  export let labelFontSize = 10
  export let labelFontWeight = 'normal'
  export let labelOpacity = 1
  export let labelColor = 'black'
  export let labelAnchorPoint = 'center'
  export let labelCount = 5
  export let labelExtra = false
  export let firstLabel = undefined
  export let format = undefined
  export let labelPaddingY = 0
  export let labelPaddingX = 0
  export let flipLabelOrder

  // legend title
  export let titleHjust = 'center'
  export let titleXOffset = 0
  export let titleX = undefined
  export let titleVjust = 'top'
  export let titleYOffset = 0
  export let titleY = undefined
  export let title = 'Legend'
  export let titleColor = 'black'
  export let titleFont = 'Helvetica'
  export let titleFontSize = 12
  export let titleFontWeight = 'bold'
  export let titleOpacity = 1
  export let titleRotation = 0
  export let titleAnchorPoint = 't'
  export let titlePaddingX = 0
  export let titlePaddingY = -3

  // Transition
  export let transition = undefined

  // Mouse interactions
  export let onClick = undefined
  export let onMousedown = undefined
  export let onMouseup = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
  export let onMousedrag = undefined

  // Touch interactions
  export let onTouchdown = undefined
  export let onTouchup = undefined
  export let onTouchover = undefined
  export let onTouchout = undefined
  export let onTouchdrag = undefined

  // Permanent

  // Contexts
  const sectionContext = SectionContext.subscribe()

  // Private variables
  let scaleDomain
  let useScale = false
  let tickLabelText
  let tickLabelPositions
  let tickLabelXCoords
  let tickLabelYCoords
  let tickColors
  let tickOpacities
  let tickAlign

  let _padding
  let rangeCoordsX
  let rangeCoordsY
  let xRange = $sectionContext.scaleX.range()
  let yRange = $sectionContext.scaleY.range()

  let colorXStartCoords
  let colorXEndCoords
  let colorYStartCoords
  let colorYEndCoords
  let colorGeoms
  const graphicalBarHeight = orient === 'vertical' ? 0.85 : 0.75
  const graphicalBarWidth = orient === 'vertical' ? 0.7 : 1

  let xCoords
  let yCoords
  let addTitleSize

  // Graphical bar: color, symbols
  let graphicalBarX = { x1: 0, x2: graphicalBarWidth }
  let graphicalBarY = orient === 'vertical' ? { y1: 0, y2: graphicalBarHeight } : { y1: 1 - graphicalBarHeight, y2: graphicalBarHeight }
  
  // Line ticks
  let ticksX = orient === 'vertical' ? { x1: graphicalBarWidth, x2: 1 } : { x1: 0, x2: graphicalBarWidth }
  let ticksY = orient === 'vertical' ? { y1: 0, y2: graphicalBarHeight } : { y1: 0, y2: 1 - graphicalBarHeight }
  
  // graphical bar subsections
  let colorBarX = orient === 'vertical' ? { x1: 0, x2: 0.8 } : { x1: 0, x2: 1 }
  let colorBarY = orient === 'vertical' ? { y1: 0, y2: 1 } : { y1: 1, y2: 0.2 }

  let tickBarX = orient === 'vertical' ? { x1: 0.8, x2: 1 } : { x1: 0, x2: 1 }
  let tickBarY = orient === 'vertical' ? { y1: 0, y2: 1 } : { y1: 0.2, y2: 0 }
  
  // title positioning
  let titleSectionX = { x1: 0, x2: 1 }
  let titleSectionY = { y1: graphicalBarHeight, y2: 1 }

  // Extract and remove padding if necessary
  $: {
    if (usePadding === true) {
      _padding = $sectionContext.padding
      xRange = removePadding(xRange, _padding.left, _padding.right)
      yRange = removePadding(yRange, _padding.top, _padding.bottom)
    }
  }
  
  // Section positioning wrt section/graphic context
  $: {
    if (!['horizontal', 'vertical'].includes(orient)) {
      throw Error('Invalid input for `orient` property. Please provide either `horizontal` or `vertical` as inputs.')
    }
    addTitleSize = title.length > 0 ? titleFontSize * 1.5 : 0

    // Autopositioning
    if (!isValid(x1, x2, y1, y2) && ['horizontal', 'vertical'].includes(orient)) {
      if ($sectionContext.flipX) {
        if (orient === 'vertical') {
          graphicalBarX = { x1: 1, x2: 1 - graphicalBarWidth }
          ticksX = { x1: 1 - graphicalBarWidth, x2: 0 }
          colorBarX = { x1: 1 - colorBarX.x2, x2: 1 }
          tickBarX = { x1: 0, x2: 1 - tickBarX.x1 }

        }
      }
      rangeCoordsX = createPosXCoords(hjust, xRange, orient, width, xOffset, labelFontSize, flipX)
      x1 = rangeCoordsX.x1
      x2 = rangeCoordsX.x2
      width = Math.abs(x2 - x1)
      xCoords = { x1, x2, width }

      if ($sectionContext.flipY) {
        if (orient === 'vertical') {
          graphicalBarY = { y1: 1, y2: 1 - graphicalBarHeight }
          ticksY = { y1: 1, y2: 1 - graphicalBarHeight }
          titleSectionY = { y1: 0, y2: 1 - graphicalBarHeight }
        } else {
          graphicalBarY = { y1: graphicalBarHeight, y2: 1 - graphicalBarHeight }
          ticksY = { y1: 1, y2: graphicalBarHeight }
          titleSectionY = { y1: 0, y2: 1 - graphicalBarHeight }
        }
      }
      rangeCoordsY = createPosYCoords(vjust, yRange, orient, height, yOffset, addTitleSize, flipY)
      y1 = rangeCoordsY.y1
      y2 = rangeCoordsY.y2
      height = Math.abs(y2 - y1)
      yCoords = { y1, y2, height }
    } else {
      let _x1, _x2, _y1, _y2

      /** If function, uses pixel values based on padding/no padding setting
       * (does not rely on section/graphic scale)
       * else if value, uses data scale => convert to pixel values
      **/
      if ({}.toString.call(x1) === '[object Function]') {
        _x1 = x1()
      } else {
        _x1 = $sectionContext.scaleX(x1)
      }

      if ({}.toString.call(x2) === '[object Function]') {
        _x2 = x2()
      } else {
        _x2 = $sectionContext.scaleX(x2)
      }

      if ({}.toString.call(y1) === '[object Function]') {
        _y1 = y1()
      } else {
        _y1 = $sectionContext.scaleY(y1)
      }

      if ({}.toString.call(y2) === '[object Function]') {
        _y2 = y2()
      } else {
        _y2 = $sectionContext.scaleY(y2)
      }

      // This ends up in pixel values
      xCoords = { x1: _x1, x2: _x2, width: Math.abs(_x2 - _x1) }
      yCoords = { y1: _y1, y2: _y2, height: Math.abs(_y2 - _y1) }
    }
  }

  // Flip parts of legend
  $: {
    if (flipX) {
      graphicalBarX = { x1: 1 - graphicalBarX.x2, x2: 1 - graphicalBarX.x1 }
      ticksX = { x1: 1 - ticksX.x2, x2: 1 - ticksX.x1 }
      titleSectionX = { x1: 1 - titleSectionX.x2, x2: 1 - titleSectionX.x1 }
      colorBarX = { x1: 1 - colorBarX.x2, x2: 1 - colorBarX.x1 }
      tickBarX = { x1: 1 - tickBarX.x2, x2: 1 - tickBarX.x1 }
    }

    if (flipY) {
      graphicalBarY = { y1: 1 - graphicalBarY.y2, y2: 1 - graphicalBarY.y1 }
      ticksY = { y1: 1 - ticksY.y2, y2: 1 - ticksY.y1 }
      titleSectionY = { y1: 1 - titleSectionY.y2, y2: 1 - titleSectionY.y1 }
      colorBarY = { y1: 1 - colorBarY.y2, y2: 1 - colorBarY.y1 }
      tickBarY = { y1: 1 - tickBarY.y2, y2: 1 - tickBarY.y1 }
    }
  }

  // Extract scaleDomain, if necessary
  // CHECK:
  // 1. that scale is provided,
  // 2. that least one of the aesthetics has been specified
  $: {
    if (scale) {
      // if (Object.prototype.hasOwnProperty.call(scale, 'domain')) {
      //   if (typeof scale.domain === 'function') {
      //     scaleDomain = scale.domain()
      //   } else {
      //     scaleDomain = scale.domain
      //   }
      // } else if (Array.isArray(scale)) {
      //   scaleDomain = scale
      // }
    } else {
      throw new Error(`Couldn't construct legend. Please provide at least 'scale' and one of the
      aesthetic properties 'fill' or 'fillOpacity' with range properties or methods.`)
    }
  }

  // TICK LABELS and POSITIONING
  // Assumes that legend illustrates one dimensional scale,
  // and that either fill or fillOpacity can used (it will look at fill first)
  $: {
    if (labels === undefined) {
      tickLabelText = getTicks(scale, labelCount, labelExtra, firstLabel)
      tickLabelText = format !== undefined ? tickLabelText.map(format) : tickLabelText
    } else {
      tickLabelText = format !== undefined ? labels.map(format) : labels
      useScale = true
    }

    if (orient === 'vertical') {
      tickLabelYCoords = getTickPositions(tickLabelText, scale, labelExtra, flipLabelOrder, labelPaddingY, useScale, $sectionContext.flipY)
      tickLabelXCoords = Array(tickLabelText.length).fill(0.5)
      // tickLabelXCoords = flipLabels ? x1 + colorBarHeight * xCoords.width : x1 + (1 - colorBarHeight) * xCoords.width
      // tickLabelXCoords = labelX || tickLabelXCoords

      // if (labelPaddingX !== undefined) {
      //   tickLabelXCoords = flipLabels ? tickLabelXCoords + labelPaddingX : tickLabelXCoords - labelPaddingX
      // }

      // format = getFormat(labelFormat, scaleDomain, tickLabelYCoords.length)
    } else if (orient === 'horizontal') {
      tickLabelXCoords = getTickPositions(tickLabelText, scale, labelExtra, flipLabelOrder, labelPaddingX, useScale, $sectionContext.flipY)
      tickLabelYCoords = Array(tickLabelText.length).fill(0.5)
      // tickLabelYCoords = flipLabels ? yCoords.y2 - (1 - colorBarWidth) * yCoords.height : yCoords.y2 - colorBarWidth * yCoords.height
      // tickLabelYCoords = labelY || tickLabelYCoords
  
      // if (labelPaddingY !== undefined) {
      //   tickLabelYCoords = flipLabels ? tickLabelYCoords - labelPaddingY : tickLabelYCoords + labelPaddingY
      // }

      // format = getFormat(labelFormat, scaleDomain, tickLabelXCoords.length)
    } else {
      throw new Error('Could not construct legend. Please provide either \'vertical\' or \'horizontal\' to \'orient\' prop.')
    }
}
</script>

<!-- 
{#if legend='gradient'}
  <g class="gradient-legend">
  <defs>
    <linearGradient
      id={gradientId}
      x1={gradX.x1}
      y1={gradY.y1}
      x2={gradX.x2}
      y2={gradY.y2}
      >
      {#each offsets as o, i}
          <stop
          key={i}
          offset={`${o * 100 + '%'}`}
          style={`stop-color:${Array.isArray(tickColors) ? tickColors[i] : tickColors};stop-opacity:${Array.isArray(tickOpacities) ? tickOpacities[i] : tickOpacities}`}
          />
      {/each}
    </linearGradient>
  </defs>
</g> 
{/if}-->

<Section
  x1={() => xCoords.x1}
  x2={() => xCoords.x2}
  y1={() => yCoords.y2}
  y2={() => yCoords.y1}
  backgroundColor={color}
  scaleX={scaleLinear().domain([0, 1])}
  scaleY={scaleLinear().domain([0, 1])}
>
  <!-- Graphical section -->
  <Section
    x1={graphicalBarX.x1}
    x2={graphicalBarX.x2}
    y1={graphicalBarY.y1}
    y2={graphicalBarY.y2}
    backgroundColor={'#e8e8e8'}
    scaleX={scaleLinear().domain([0, 1])}
    scaleY={scaleLinear().domain([0, 1])}
  >
    <!-- Ticks -->
    <Section
      x1={tickBarX.x1}
      x2={tickBarX.x2}
      y1={tickBarY.y1}
      y2={tickBarY.y2}
      backgroundColor={'coral'}
      scaleX={scaleLinear().domain([0, 1])}
      scaleY={scaleLinear().domain([0, 1])}
    />
    <!-- Color bar-->
    {#if ['discrete', 'symbol'].includes(legend)}
      <Section
        x1={colorBarX.x1}
        x2={colorBarX.x2}
        y1={colorBarY.y1}
        y2={colorBarY.y2}
        backgroundColor={'dodgerblue'}
        scaleX={scaleLinear().domain([0, 1])}
        scaleY={scaleLinear().domain([0, 1])}
      >
      </Section>
    {:else if legend === 'gradient'}
      <Rectangle 
        x1={colorBarX.x1}
        x2={colorBarX.x2}
        y1={colorBarY.y1}
        y2={colorBarY.y2}
        fill={'dodgerblue'}
      />
    {/if}
  </Section>

  <!-- Ticks-->
  <Section
    x1={ticksX.x1}
    x2={ticksX.x2}
    y1={ticksY.y1}
    y2={ticksY.y2}
    backgroundColor={'#DCDCDC'}
    scaleX={scaleLinear().domain([0, 1])}
    scaleY={scaleLinear().domain([0, 1])}
  >

    <LabelLayer
      x={tickLabelXCoords}
      y={tickLabelYCoords}
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

  </Section>

  <!-- Title -->
  <Section
    x1={titleSectionX.x1}
    x2={titleSectionX.x2}
    y1={titleSectionY.y1}
    y2={titleSectionY.y2}
    backgroundColor={'silver'}
    scaleX={scaleLinear().domain([0, 1])}
    scaleY={scaleLinear().domain([0, 1])}
    label={'title'}
  >
    {#if title.length > 0}
      <Label 
        x={0.5}
        y={0.65}
        text={title}
        fontFamily={titleFont}
        fontSize={titleFontSize}
        fontWeight={titleFontWeight}
        rotation={titleRotation}
        anchorPoint={titleAnchorPoint}
        opacity={titleOpacity} 
        fill={titleColor}
      />
    {/if}
  </Section>
</Section>


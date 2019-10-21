<script>
  import { Label, LabelLayer, Rectangle, RectangleLayer, Section } from "../../../"
  import { scaleDiverging, scaleSequential, scaleLinear, scalePow, scaleQuantise, scaleOrdinal, scaleSqrt, scaleLog } from 'd3-scale'
  import { createPosYCoords, createPosXCoords, createTitleXCoord, createTitleYCoord } from "./createLegendCoordinates.js"

  // Contexts
  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'
  
  // Permanent
  import { getTickPositions, getFormat, getTicks, getColorGeoms, isValid } from './utils.js'

  // Public props
  // Aesthetics: positioning
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined
  export let orient = 'vertical'
  export let vjust = 'center'
  export let height = undefined
  export let hjust = 'left'
  export let width = 0
  export let xOffset = 0
  export let yOffset = 0

  // Aesthetics: colors
  export let scale = undefined
  export let flip = false
  export let flipLabels = false
  export let background = 'none'
  export let backgroundOpacity = 0.3
  export let stroke = 'none'
  export let strokeWidth = 2

  // Aesthetics
  export let fill = undefined
  export let fillOpacity = undefined

  // tick labels
  export let labelFormat = undefined
  export let labelOffset = 0.2
  export let labelRotate = 0
  export let labelX = undefined
  export let labelY = undefined
  export let labelFont = 'Helvetica'
  export let labelFontSize = 10
  export let labelFontWeight = 'normal'
  export let labelOpacity = 1
  export let labelColor = 'black'
  export let labelAnchorPoint = 'center'
  export let labelCount = 10
  export let labelExtra = false
  export let firstLabel = undefined
  export let format = undefined
  export let labelPadding = 0

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
  export let titleFontSize = 14
  export let titleFontWeight = 'bold'
  export let titleOpacity = 1
  export let titleRotation = 0
  export let titleAnchorPoint = 't'
  export let titlePaddingX = 0
  export let titlePaddingY = titleVjust === 'bottom' ? 5 : titleVjust === 'top' ? -5 : 0

  // transition
  export let transition = undefined
  export let zoomIdentity = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const graphicContext = GraphicContext.subscribe()

  // Permanent
  const zoomContext = ZoomContext.subscribe()

  // Private variables
  let tickLabelText 
  let tickLabelPositions
  let tickLabelXCoords
  let tickLabelYCoords
  let tickColors
  let tickOpacities
  let tickAlign

  let colorXStartCoords
  let colorXEndCoords
  let colorYStartCoords 
  let colorYEndCoords 
  let colorGeoms
  let colorBarHeight
  let colorBarWidth

  let posScaleY
  let xCoords
  let yCoords
  let addTitleSize

  // Section positioning wrt section/graphic context
  $: {
    if (!['horizontal', 'vertical'].includes(orient)) {
      throw Error('Invalid input for `orient` property. Please provide either `horizontal` or `vertical` as inputs.')
    }

    if (!isValid(x1, x2, y1, y2) && ['horizontal', 'vertical'].includes(orient)) {
      const xRange = $sectionContext.scaleX.range()
      const yRange = $sectionContext.scaleY.range()

      if (sectionContext.flipX) xRange.reverse()
      const rangeXCoords = createPosXCoords(hjust, xRange, orient, width, xOffset, labelFontSize, $sectionContext.padding)

      x1 = $sectionContext.scaleX.invert(rangeXCoords.x1)
      x2 = $sectionContext.scaleX.invert(rangeXCoords.x2)
      width = Math.abs(x2 - x1)
      xCoords = { x1, x2, width }

      if (sectionContext.flipY) yRange.reverse()
      addTitleSize = title.length > 0 ? titleFontSize : 0
      const rangeYCoords = createPosYCoords(vjust, yRange, orient, height, yOffset, addTitleSize, $sectionContext.padding)

      y1 = $sectionContext.scaleY.invert(rangeYCoords.y1)
      y2 = $sectionContext.scaleY.invert(rangeYCoords.y2)
      height = Math.abs(y2 - y1)
      yCoords = { y1, y2, height }
    
    } else { 
      xCoords = { x1, x2, width: Math.abs(x2 - x1) }
      yCoords = { y1, y2, height: Math.abs(y2 - y1) }
    }
  }

  // Title positioning wrt section/graphic context
  $: {
    if (title.length > 0) {
      if (!titleX && titleX !== 0) {
        const xRange = $sectionContext.scaleX.range()
        if (sectionContext.flipX) xRange.reverse()
        titleX = createTitleXCoord(titleHjust, xCoords, titleX, titleXOffset, titleFontSize, titlePaddingX)
      }

      if (!titleY && titleY !== 0) {
        const yRange = $sectionContext.scaleY.range()
        if (sectionContext.flipY) yRange.reverse()
        titleY = createTitleYCoord(titleVjust, yCoords, titleY, titleYOffset, titleFontSize, orient, titlePaddingY)
      }
    }
  }

  // CHECK: 
  // 1. that scale is provided,
  // 2. that least one of `fill, opacity` has been specified
  $: {
    if (fill || fillOpacity){
      // continue
    } else if (typeof scale === 'undefined'  && (fill === undefined && fillOpacity === undefined)) {
      throw new Error(`Couldn't construct legend. Please provide at least 'fill' or 'fillOpacity'
      with either an array, or a scale with a 'ticks' or a 'domain' method.`)
    }

    if (!scale){
      throw new Error(`Couldn't construct legend. Please provide scale.`)
    }
  }

  $: {
    colorBarHeight = orient === 'horizontal' ? 0.75 : 1
    colorBarWidth = orient === 'horizontal' ? 0 : 0.75
  }

  // TICK LABELS and POSITIONING
  $: {
    tickLabelText = getTicks(scale, labelCount, labelExtra, firstLabel)

    if (orient === 'vertical') {
      tickLabelYCoords = getTickPositions(tickLabelText, scale, labelExtra, yCoords, flip, orient)
      tickLabelXCoords = flipLabels ? x1 + colorBarHeight * xCoords.width : x1 + (1 - colorBarHeight) * xCoords.width
      tickLabelXCoords = labelX ? labelX : tickLabelXCoords

      if (labelPadding !== undefined) { 
        tickLabelXCoords = flipLabels ? tickLabelXCoords + labelPadding : tickLabelXCoords - labelPadding
      }

      format = getFormat(labelFormat, scale, tickLabelYCoords.length)
    } else if (orient === 'horizontal'){
      tickLabelXCoords = getTickPositions(tickLabelText, scale, labelExtra, xCoords, flip, orient)
      tickLabelYCoords = flipLabels ? yCoords.y2 - (1 - colorBarWidth) * yCoords.height : yCoords.y2 - colorBarWidth * yCoords.height
      tickLabelYCoords = labelY ? labelY : tickLabelYCoords

      if (labelPadding !== undefined) { 
        tickLabelYCoords = flipLabels ? tickLabelYCoords - labelPadding : tickLabelYCoords + labelPadding
      }

      format = getFormat(labelFormat, scale, tickLabelXCoords.length)
    } else {
      throw new Error(`Could not construct legend. Please provide either 'vertical' or 'horizontal' to 'orient' prop.`)
    }
    tickLabelText = tickLabelText.map(format)
  }   

  // COLORS
  $: {
    if (fill && (fill.constructor === Array || fill.constructor === Function)) {
      // d3 scale or bins
      if (fill.constructor === Function) {
        tickColors = tickLabelText.map((value, i) => {
          if (Array.isArray(scale[0]) && scale.length > 0) {
            return fill(i)
          } else {
            return fill(value)
          }
        })
      // array
      } else if (fill.constructor === Array) {
        tickColors = tickLabelText.map((value, i) => {
          return fill[i]
        })
      }   
      
      if (orient === 'vertical') {
        tickLabelPositions = tickLabelYCoords
        tickAlign = tickLabelXCoords
      } else {
        tickLabelPositions = tickLabelXCoords
        tickAlign = tickLabelYCoords
      }

      colorGeoms = getColorGeoms(tickColors, orient, scale, tickLabelText, tickLabelPositions, tickAlign, labelFontSize, colorBarHeight, colorBarWidth, flipLabels, flip, xCoords, yCoords)
      if (!tickOpacities){
        tickOpacities = fill
      }
    } 
  }

  // OPACITY
  $: {
    if (fillOpacity) {
      if (fillOpacity.constructor === Array || fillOpacity.constructor === Function) {
        // d3 scale
        if (fillOpacity.constructor === Function) {
          tickOpacities = tickLabelText.map((value, i) => {
            if (Array.isArray(scale[0]) && scale.length > 0) {
              return fillOpacity(i)
            } else {
              return fillOpacity(value)
            }
          })
        // array
        } else if (fillOpacity.constructor === Array) {
          tickOpacities = tickLabelText.map((value, i) => {
            return fillOpacity[i]
          })
        }

        if (orient === 'vertical') {
          tickLabelPositions = tickLabelYCoords
          tickAlign = tickLabelXCoords
        } else {
          tickLabelPositions = tickLabelXCoords
          tickAlign = tickLabelYCoords
        }

        // something's wrong with the fillOpacity function
        colorGeoms = getColorGeoms(tickOpacities, orient, scale, tickLabelText, tickLabelPositions, tickAlign, labelFontSize, colorBarHeight, colorBarWidth, flipLabels, flip, xCoords, yCoords)
        if (!tickColors){
          tickColors = fill
        }
      } else if (fillOpacity.constructor === Number) {
        tickOpacities = fillOpacity
      }
    }
  }

  // Color bar geometry
  $: {
    colorXStartCoords = colorGeoms.colorXStartCoords
    colorXEndCoords = colorGeoms.colorXEndCoords
    colorYStartCoords = colorGeoms.colorYStartCoords
    colorYEndCoords = colorGeoms.colorYEndCoords
  }

</script>

<g class="discrete-legend">
  <RectangleLayer
    x1 = {colorXStartCoords}
    x2 = {colorXEndCoords}
    y1 = {colorYStartCoords}
    y2 = {colorYEndCoords}
    fill = {tickColors}
    fillOpacity = {tickOpacities}
    {transition} 
    {stroke}
    {strokeWidth}
    {zoomIdentity}
  />

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
    {zoomIdentity}
  />

  {#if title.length > 0}
    <Label 
      x={titleX}
      y={titleY}
      text={title}
      fontFamily={titleFont}
      fontSize={titleFontSize}
      fontWeight={titleFontWeight}
      rotation={titleRotation}
      anchorPoint={titleAnchorPoint}
      opacity={titleOpacity} 
      fill={titleColor}
      {transition} 
      {zoomIdentity}
    />
  {/if}
</g>
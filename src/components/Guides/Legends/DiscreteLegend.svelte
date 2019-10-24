<script>
  import { Label, LabelLayer, Rectangle, RectangleLayer, Section } from "../../../"
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
  export let usePadding = false

  // Aesthetics: colors
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
  export let labels = undefined
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
  export let labelPaddingY = 0
  export let labelPaddingX = 0

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
  export let titlePaddingY = 1

  // transition
  export let transition = undefined
  export let zoomIdentity = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const graphicContext = GraphicContext.subscribe()

  // Permanent
  const zoomContext = ZoomContext.subscribe()

  // Private variables
  let scale
  let scaleDomain
  let useScale = false
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
  let addLabelSize
  let parentPadding
  let rangeXCoords
  let rangeYCoords
  
   $: {
    usePadding = usePadding
    if (usePadding === true) {
      parentPadding = $sectionContext.padding
    }
  }
  
  // Section positioning wrt section/graphic context
  // Uses pixel values
  $: {
    if (!['horizontal', 'vertical'].includes(orient)) {
      throw Error('Invalid input for `orient` property. Please provide either `horizontal` or `vertical` as inputs.')
    }

    if (!isValid(x1, x2, y1, y2) && ['horizontal', 'vertical'].includes(orient)) {
      const xRange = $sectionContext.scaleX.range()
      const yRange = $sectionContext.scaleY.range()

      if (sectionContext.flipX) xRange.reverse()
      rangeXCoords = createPosXCoords(hjust, xRange, orient, width, xOffset, labelFontSize, flip, parentPadding)
      x1 = $sectionContext.scaleX.invert(rangeXCoords.x1)
      x2 = $sectionContext.scaleX.invert(rangeXCoords.x2)

      width = Math.abs(x2 - x1)
      xCoords = { x1, x2, width }
    
      if (sectionContext.flipY) yRange.reverse()
      addTitleSize = title.length > 0 ? titleFontSize * 1.5 : 0
      rangeYCoords = createPosYCoords(vjust, yRange, orient, height, yOffset, addTitleSize, flip, parentPadding)
      
      y1 = $sectionContext.scaleY.invert(rangeYCoords.y1)
      y2 = $sectionContext.scaleY.invert(rangeYCoords.y2)
      height = Math.abs(y2 - y1)
      yCoords = { y1, y2, height }

    } else { 
      xCoords = { x1, x2, width: Math.abs(x2 - x1) }
      yCoords = { y1, y2, height: Math.abs(y2 - y1) }
    }

    if (orient === 'vertical') {
      addLabelSize = labelFontSize / rangeXCoords.width * width * 0.5
    } else {
      addLabelSize = labelFontSize / rangeYCoords.height * height * 0.75
    }
  }

  // Title positioning wrt section/graphic context
  $: {
    if (title.length > 0) {
      if (!titleX && titleX !== 0) {
        const xRange = $sectionContext.scaleX.range()
        if (sectionContext.flipX) xRange.reverse()
        titleX = createTitleXCoord(titleHjust, xCoords, titleX, titleXOffset, addTitleSize, addLabelSize, orient, titlePaddingX)
      }

      if (!titleY && titleY !== 0) {
        const yRange = $sectionContext.scaleY.range()
        if (sectionContext.flipY) yRange.reverse()
        titleY = createTitleYCoord(titleVjust, yCoords, titleY, titleYOffset, addTitleSize, addLabelSize, orient, titlePaddingY)
      }
    }
  }

  // CHECK: 
  // 1. that scale is provided,
  // 2. that least one of `fill, opacity` has been specified
  $: {
    if (fill || fillOpacity){
      if (typeof fill === "function") {
        scale = fill
      } 

      if (typeof fillOpacity === "function") {
        scale = fillOpacity
      }
      if (scale) {
        if (scale.hasOwnProperty('domain')) {
          if (typeof scale.domain === "function") {
            scaleDomain = scale.domain()
          } else {
            scaleDomain = scale.domain
          }
        }
      } else {
        throw new Error(`Couldn't construct legend. Please provide at least 'fill' or 'fillOpacity'
        with a scale or function that has domain and range properties or methods.`)
      }
    } else if (fill === undefined && fillOpacity === undefined) {
      throw new Error(`Couldn't construct legend. Please provide at least 'fill' or 'fillOpacity'
      with a scale or function that has domain and range properties or methods.`)
    }
  }

  $: {
    colorBarHeight = orient === 'horizontal' ? 0.75 : 1
    colorBarWidth = orient === 'horizontal' ? 0 : 0.75
  }

  // TICK LABELS and POSITIONING
  // Assumes that legend illustrates one dimensional scale, 
  // and that either fill or fillOpacity can used (it will look at fill first)
  $: {
    if (labels === undefined) {
      tickLabelText = getTicks(scaleDomain, labelCount, labelExtra, firstLabel)
      tickLabelText = format !== undefined ? tickLabelText.map(format) : tickLabelText
    } else {
      tickLabelText = format !== undefined ? labels.map(format) : labels
      useScale = true
    }

    if (orient === 'vertical') {
      tickLabelYCoords = getTickPositions(tickLabelText, scaleDomain, labelExtra, yCoords, flip, orient, labelPaddingY, useScale)
      tickLabelXCoords = flipLabels ? x1 + colorBarHeight * xCoords.width : x1 + (1 - colorBarHeight) * xCoords.width
      tickLabelXCoords = labelX ? labelX : tickLabelXCoords
      
      if (labelPaddingX !== undefined) { 
        tickLabelXCoords = flipLabels ? tickLabelXCoords + labelPaddingX : tickLabelXCoords - labelPaddingX
      }

      format = getFormat(labelFormat, scaleDomain, tickLabelYCoords.length)
    } else if (orient === 'horizontal'){
      tickLabelXCoords = getTickPositions(tickLabelText, scaleDomain, labelExtra, xCoords, flip, orient, labelPaddingX, useScale)
      tickLabelYCoords = flipLabels ? yCoords.y2 - (1 - colorBarWidth) * yCoords.height : yCoords.y2 - colorBarWidth * yCoords.height
      tickLabelYCoords = labelY ? labelY : tickLabelYCoords

      if (labelPaddingY !== undefined) { 
        tickLabelYCoords = flipLabels ? tickLabelYCoords - labelPaddingY : tickLabelYCoords + labelPaddingY
      }

      format = getFormat(labelFormat, scaleDomain, tickLabelXCoords.length)
    } else {
      throw new Error(`Could not construct legend. Please provide either 'vertical' or 'horizontal' to 'orient' prop.`)
    }
  } 

  // COLORS
  $: {
    if (fill) {
      if (typeof fill === 'function') {
        // d3 scale or bins
        tickColors = tickLabelText.map((value, i) => {
          if (Array.isArray(scaleDomain[0]) && scaleDomain.length > 0) {
            return fill(i)
          } else {
            return fill(value)
          }
        })
        
        if (orient === 'vertical') {
          tickLabelPositions = tickLabelYCoords
          tickAlign = tickLabelXCoords
        } else {
          tickLabelPositions = tickLabelXCoords
          tickAlign = tickLabelYCoords
        }
    
        colorGeoms = getColorGeoms(tickColors, orient, scale, tickLabelText, tickLabelPositions, tickAlign, addLabelSize, colorBarHeight, colorBarWidth, flipLabels, flip, xCoords, yCoords, useScale)
        if (!tickOpacities){
          tickOpacities = 1
        }
      } 
    }    
  }

  // OPACITY
  $: {
    if (fillOpacity) {
      if (typeof fillOpacity === 'function') {
        // d3 scale
        tickOpacities = tickLabelText.map((value, i) => {
          if (Array.isArray(scale[0]) && scale.length > 0) {
            return fillOpacity(i)
          } else {
            return fillOpacity(value)
          }
        })
      
        if (orient === 'vertical') {
          tickLabelPositions = tickLabelYCoords
          tickAlign = tickLabelXCoords
        } else {
          tickLabelPositions = tickLabelXCoords
          tickAlign = tickLabelYCoords
        }

        colorGeoms = getColorGeoms(tickOpacities, orient, scale, tickLabelText, tickLabelPositions, tickAlign, addLabelSize, colorBarHeight, colorBarWidth, flipLabels, flip, xCoords, yCoords, useScale)
        
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
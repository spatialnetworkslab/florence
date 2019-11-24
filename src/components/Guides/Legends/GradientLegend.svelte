<script context="module">
  let idCounter = 0
  function getId () {
    return 'gradient' + idCounter++
  }
</script>

<script>
  import { Label, LabelLayer, Rectangle, RectangleLayer, Section } from '../../../'
  import { createPosYCoords, createPosXCoords, createTitleXCoord, createTitleYCoord } from './createLegendCoordinates.js'
  // import { scaleCoordinates } from '../../Marks/Rectangle/createCoordSysGeometry.js'
  import { removePadding } from '../../Core/utils/padding.js'

  // Contexts
  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'
  
  // Permanent
  import { getTickPositions, getFormat, getTicks, getGradientGeoms, isValid } from './utils.js'

  // global properties
  const gradientId = getId()

  // Public props
  // Aesthetics: positioning
  export let x1
  export let x2
  export let y1
  export let y2
  export let orient = 'vertical'
  export let vjust = 'center'
  export let height
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
  export let fill
  export let fillOpacity

  // tick labels
  export let labels
  export let labelFormat
  export let labelOffset = 0.2
  export let labelRotate = 0
  export let labelX
  export let labelY
  export let labelFont = 'Helvetica'
  export let labelFontSize = 10
  export let labelFontWeight = 'normal'
  export let labelOpacity = 1
  export let labelColor = 'black'
  export let labelAnchorPoint = 'center'
  export let labelCount = 10
  export let labelExtra = false
  export let firstLabel
  export let format
  export let labelPaddingX = 0
  export let labelPaddingY = 0

  // legend title
  export let titleHjust = 'center'
  export let titleXOffset = 0
  export let titleX
  export let titleVjust = 'top'
  export let titleYOffset = 0
  export let titleY
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

  // transition
  export let transition
  export let zoomIdentity

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const graphicContext = GraphicContext.subscribe()
  
  // Permanent
  const zoomContext = ZoomContext.subscribe()

  // Private variables
  let scale
  let scaleDomain
  let scaleDomainGroups
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

  let colorGeoms
  let offsets
  let gradX
  let gradY
  let rectCoords
  let colorBarHeight
  let colorBarWidth

  let posScaleY
  let xCoords
  let yCoords
  let addTitleSize
  
  $: {
    if (usePadding === true) {
      _padding = $sectionContext.padding
      xRange = removePadding(xRange, _padding.left, _padding.right)
      yRange = removePadding(yRange, _padding.top, _padding.bottom)
    }
  }
  
  // Section positioning wrt section/graphic context
  // Uses pixel values based on padding/no padding setting (does not rely on section/graphic scale)
  $: {
    if (!['horizontal', 'vertical'].includes(orient)) {
      throw Error('Invalid input for `orient` property. Please provide either `horizontal` or `vertical` as inputs.')
    }

    addTitleSize = title.length > 0 ? titleFontSize * 1.5 : 0

    if (!isValid(x1, x2, y1, y2) && ['horizontal', 'vertical'].includes(orient)) {
      if (sectionContext.flipX) xRange.reverse()
      rangeCoordsX = createPosXCoords(hjust, xRange, orient, width, xOffset, labelFontSize, flip)
      x1 = rangeCoordsX.x1
      x2 = rangeCoordsX.x2
      width = Math.abs(x2 - x1)
      xCoords = { x1, x2, width }

      if (sectionContext.flipY) yRange.reverse()
      rangeCoordsY = createPosYCoords(vjust, yRange, orient, height, yOffset, addTitleSize, flip)
      y1 = rangeCoordsY.y1
      y2 = rangeCoordsY.y2
      height = Math.abs(y2 - y1)
      yCoords = { y1, y2, height }
    } else {
      // This should always be in pixels
      xCoords = { x1, x2, width: Math.abs(x2 - x1) }
      yCoords = { y1, y2, height: Math.abs(y2 - y1) }
    }
  }

  // Title positioning wrt section/graphic context
  $: {
    if (title.length > 0) {
      if (!titleX && titleX !== 0) {
        titleX = createTitleXCoord(titleHjust, xCoords, titleX, titleXOffset, addTitleSize, labelFontSize, orient, titlePaddingX)
      }

      if (!titleY && titleY !== 0) {
        titleY = createTitleYCoord(titleVjust, yCoords, titleY, titleYOffset, addTitleSize, labelFontSize, orient, titlePaddingY)
      }
    }
  }

  // CHECK:
  // 1. that scale is provided,
  // 2. that least one of `fill, opacity` has been specified
  $: {
    if (fill || fillOpacity) {
      if (typeof fill === 'function') {
        scale = fill
      }

      if (typeof fillOpacity === 'function') {
        scale = fillOpacity
      }

      if (scale) {
        if (scale.hasOwnProperty('domain')) {
          if (typeof scale.domain === 'function') {
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
    let useScale = false
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
      tickLabelXCoords = labelX || tickLabelXCoords
  
      if (labelPaddingX !== undefined) {
        tickLabelXCoords = flipLabels ? tickLabelXCoords + labelPaddingX : tickLabelXCoords - labelPaddingX
      }

      format = getFormat(labelFormat, scaleDomain, tickLabelYCoords.length)
    } else if (orient === 'horizontal') {
      tickLabelXCoords = getTickPositions(tickLabelText, scaleDomain, labelExtra, xCoords, flip, orient, labelPaddingX, useScale)
      tickLabelYCoords = flipLabels ? yCoords.y2 - (1 - colorBarWidth) * yCoords.height : yCoords.y2 - colorBarWidth * yCoords.height
      tickLabelYCoords = labelY || tickLabelYCoords

      if (labelPaddingY !== undefined) {
        tickLabelYCoords = flipLabels ? tickLabelYCoords - labelPaddingY : tickLabelYCoords + labelPaddingY
      }

      format = getFormat(labelFormat, scaleDomain, tickLabelXCoords.length)
    } else {
      throw new Error('Could not construct legend. Please provide either \'vertical\' or \'horizontal\' to \'orient\' prop.')
    }
  }

  // COLORS
  $: {
    if (fill) {
      if (typeof fill === 'function') {
        // d3 scale
        tickColors = tickLabelText.map((value, i) => {
          if (Array.isArray(scale[0]) && scale.length > 0) {
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

        colorGeoms = getGradientGeoms(tickColors, orient, scale, colorBarHeight, colorBarWidth, flipLabels, flip, xCoords, yCoords, tickAlign, labelFontSize)

        if (!tickOpacities) {
          tickOpacities = fillOpacity !== undefined ? fillOpacity : 1
        }
      }
    }
  }

  // OPACITY
  $: {
    if (fillOpacity) {
      // d3 scale
      if (fillOpacity.constructor === Function) {
        tickOpacities = tickLabelText.map((value, i) => {
          if (Array.isArray(scale[0]) && scale.length > 0) {
            return fillOpacity(i)
          } else {
            return fillOpacity(value)
          }
        })
      }
  
      if (orient === 'vertical') {
        tickLabelPositions = tickLabelYCoords
        tickAlign = tickLabelXCoords - labelPaddingX
      } else {
        tickLabelPositions = tickLabelXCoords
        tickAlign = tickLabelYCoords - labelPaddingY
      }

      colorGeoms = getGradientGeoms(tickOpacities, orient, scale, colorBarHeight, colorBarWidth, flipLabels, flip, xCoords, yCoords, tickAlign, labelFontSize, labels)
  
      if (!tickColors) {
        tickColors = fill !== undefined ? fill : 'black'
      }
    }
  }

  // Color bar geometry
  $: {
    offsets = colorGeoms.offsets
    gradX = colorGeoms.gradX
    gradY = colorGeoms.gradY
    rectCoords = colorGeoms.rectCoords
  }
</script>

<g class="gradient-legend">
  <!-- Gradient definition -->
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
  
  <!-- Florence components-->
  <Rectangle
      x1 = { () => { return rectCoords.x1 } }
      x2 = { () => { return rectCoords.x2 } }
      y1 = { () => { return rectCoords.y1 } }
      y2 = { () => { return rectCoords.y2 } }
      fill={`url(#${gradientId})`}
      {transition}
      {zoomIdentity} 
  />

  <LabelLayer
      x={ () => { return tickLabelXCoords } } 
      y={ () => { return tickLabelYCoords } } 
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
          x={ () => { return titleX } }
          y={ () => { return titleY } }
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
<script context="module">
  let idCounter = 0
  function getId () {
    return 'gradient' + idCounter++
  }
</script>

<script>
  import { Label, LabelLayer, Rectangle, Section, Point } from '../../../index.js'
  import { createPosYCoords, createPosXCoords, createTitleXCoord, createTitleYCoord } from './createLegendCoordinates.js'
  import { removePadding } from '../../Core/utils/padding.js'

  // Contexts
  import * as SectionContext from '../../Core/Section/SectionContext'
  import * as GraphicContext from '../../Core/Graphic/GraphicContext'
  
  // Permanent
  import { getTickPositions, getFormat, getTicks, getGradientGeoms, isValid } from './utils.js'

  // global properties
  const gradientId = getId()

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
  export let stroke = 'none'
  export let strokeWidth = 2

  // Aesthetics
  export let fill = undefined
  export let fillOpacity = undefined

  // tick labels
  export let labels = undefined
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
  export let labelCount = 10
  export let labelExtra = false
  export let firstLabel = undefined
  export let format = undefined
  export let labelPaddingX = 0
  export let labelPaddingY = 0

  // legend title
  export let titleHjust = 'center'
  export let titleOffsetX = 0
  export let titleX = undefined
  export let titleVjust = 'top'
  export let titleOffsetY = 0
  export let titleY = undefined
  export let title = 'Legend'
  export let titleColor = 'black'
  export let titleFont = 'Helvetica'
  export let titleFontSize = 12
  export let titleFontWeight = 'bold'
  export let titleOpacity = 1
  export let titleRotation = 0
  export let titleAnchorPoint = 't'
  // export let titlePaddingX = 0
  // export let titlePaddingY = 0

  // transition
  export let transition = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const graphicContext = GraphicContext.subscribe()

  // Private variables
  let scale
  let scaleDomain
  let tickLabelPositions
  let tickLabelText
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

  let xCoords
  let yCoords
  let addTitleSize
  let _flipX
  let _flipY
  
  $: {
    if ($sectionContext.flipY) {
      _flipY = true
    }

    if ($graphicContext.flipY) {
      _flipY = true
    }
  }

  $: {
    if ($sectionContext.flipX) {
      _flipX = true
    }

    if ($graphicContext.flipX) {
      _flipX = true
    }
  }
  
  $: {
    if (usePadding === true) {
      _padding = $sectionContext.padding
      if (_padding === undefined) {
        _padding = $graphicContext.padding
      }
      xRange = removePadding(xRange, _padding.left, _padding.right)
      yRange = removePadding(yRange, _padding.top, _padding.bottom)
    }

    // Section positioning wrt section/graphic context
    if (!['horizontal', 'vertical'].includes(orient)) {
      throw Error('Invalid input for `orient` property. Please provide either `horizontal` or `vertical` as inputs.')
    }

    addTitleSize = title.length > 0 ? titleFontSize * 1.5 : 0

    // Autopositioning
    if (!isValid(x1, x2, y1, y2) && ['horizontal', 'vertical'].includes(orient)) {
      if (_flipX) xRange.reverse()
      rangeCoordsX = createPosXCoords(hjust, xRange, orient, width, xOffset, labelFontSize, flip, _flipX)
      x1 = rangeCoordsX.x1
      x2 = rangeCoordsX.x2
      width = Math.abs(x2 - x1)
      xCoords = { x1, x2, width }

      if (_flipY) yRange.reverse()
      rangeCoordsY = createPosYCoords(vjust, yRange, orient, height, yOffset, addTitleSize, flip, _flipY)
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
  
  // Title positioning
  $: {
    if (title.length > 0) {
      // if titleX is not a function or a data scale value
      if (!titleX && titleX !== 0) {
        titleX = createTitleXCoord(titleHjust, xCoords, titleX, titleOffsetX, addTitleSize, _flipX)
      } else {
        // if titleX is a function/data scale value
        if ({}.toString.call(titleX) === '[object Function]') {
          titleX = titleX()
        } else {
          titleX = $sectionContext.scaleX(titleX)
        }
      }
  
      // if titleY is not a function or a data scale value
      if (!titleY && titleY !== 0) {
        titleY = createTitleYCoord(titleVjust, yCoords, titleY, titleOffsetY, addTitleSize, _flipY)
      } else {
        // if titleY is a function/data scale value
        if ({}.toString.call(titleY) === '[object Function]') {
          titleY = titleY()
        } else {
          titleY = $sectionContext.scaleY(titleY)
        }
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
        if (Object.prototype.hasOwnProperty.call(scale, 'domain')) {
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
      tickLabelYCoords = getTickPositions(tickLabelText, scaleDomain, labelExtra, yCoords, flip, orient, labelPaddingY, useScale, _flipY)
      tickLabelXCoords = flipLabels ? x1 + colorBarHeight * xCoords.width : x1 + (1 - colorBarHeight) * xCoords.width
      tickLabelXCoords = labelX || tickLabelXCoords
      if (labelPaddingX !== undefined) {
        tickLabelXCoords = flipLabels ? tickLabelXCoords + labelPaddingX : tickLabelXCoords - labelPaddingX
      }

      format = getFormat(labelFormat, scaleDomain, tickLabelYCoords.length)
    } else if (orient === 'horizontal') {
      tickLabelXCoords = getTickPositions(tickLabelText, scaleDomain, labelExtra, xCoords, flip, orient, labelPaddingX, useScale, _flipX)
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

        const flipScale = orient === 'horizontal' ? _flipX : _flipY
        colorGeoms = getGradientGeoms(tickColors, orient, scale, colorBarHeight, colorBarWidth, flipLabels, flip, xCoords, yCoords, tickAlign, labelFontSize, labels, flipScale)

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

      const flipScale = orient === 'horizontal' ? _flipX : _flipY
      colorGeoms = getGradientGeoms(tickOpacities, orient, scale, colorBarHeight, colorBarWidth, flipLabels, flip, xCoords, yCoords, tickAlign, labelFontSize, labels, flipScale)
  
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
      {stroke}
      {strokeWidth}
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
      />
  {/if}
</g>

<script>
  import { scaleLinear } from 'd3-scale'
  import { Section, Point, Label, LabelLayer, RectangleLayer, Symbol_ } from '../../../index.js'
  import { createPosYCoords, createPosXCoords, createTitleXCoord, createTitleYCoord } from './createLegendCoordinates.js'
  import { removePadding } from '../../Core/utils/padding.js'

  // Contexts
  import * as SectionContext from '../../Core/Section/SectionContext'
  
  // Permanent
  import { getTickPositions, getFormat, getTicks, getColorGeoms, isValid } from './utils.js'

  // General props
  export let legend
  export let color = 'coral'

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
  let scale
  let scaleDomain
  const useScale = false
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
  const colorBarHeight = orient === 'vertical' ? 0.85 : 0.75
  const colorBarWidth = orient === 'vertical' ? 0.7 : 1

  let xCoords
  let yCoords
  let addTitleSize

  let colorbarX = { x1: 0, x2: colorBarWidth }
  let colorbarY = orient === 'vertical' ? { y1: 0, y2: colorBarHeight } : { y1: 1 - colorBarHeight, y2: colorBarHeight }
  let ticksX = orient === 'vertical' ? { x1: colorBarWidth, x2: 1 } : { x1: 0, x2: colorBarWidth }
  let ticksY = { y1: 0, y2: 1 - colorBarHeight }
  let titleSectionX = { x1: 0, x2: 1 }
  let titleSectionY = { y1: colorBarHeight, y2: 1 }

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
          colorbarX = { x1: 1, x2: 1 - colorBarWidth }
          ticksX = { x1: 1 - colorBarWidth, x2: 0 }
        }
      }
      rangeCoordsX = createPosXCoords(hjust, xRange, orient, width, xOffset, labelFontSize, flipX)
      x1 = rangeCoordsX.x1
      x2 = rangeCoordsX.x2
      width = Math.abs(x2 - x1)
      xCoords = { x1, x2, width }

      if ($sectionContext.flipY) {
        if (orient === 'vertical') {
          colorbarY = { y1: 1, y2: 1 - colorBarHeight }
          ticksY = { y1: 1, y2: 1 - colorBarHeight }
          titleSectionY = { y1: 0, y2: 1 - colorBarHeight }
        } else {
          colorbarY = { y1: colorBarHeight, y2: 1 - colorBarHeight }
          ticksY = { y1: 1, y2: colorBarHeight }
          titleSectionY = { y1: 0, y2: 1 - colorBarHeight }
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
      colorbarX = { x1: 1 - colorbarX.x2, x2: 1 - colorbarX.x1 }
      ticksX = { x1: 1 - ticksX.x2, x2: 1 - ticksX.x1 }
      titleSectionX = { x1: 1 - titleSectionX.x2, x2: 1 - titleSectionX.x1 }
    }

    if (flipY) {
      colorbarY = { y1: 1 - colorbarY.y2, y2: 1 - colorbarY.y1 }
      ticksY = { y1: 1 - ticksY.y2, y2: 1 - ticksY.y1 }
      titleSectionY = { y1: 1 - titleSectionY.y2, y2: 1 - titleSectionY.y1 }
    }
  }
</script>

<Section
  x1={() => xCoords.x1}
  x2={() => xCoords.x2}
  y1={() => yCoords.y2}
  y2={() => yCoords.y1}
  backgroundColor={color}
  scaleX={scaleLinear().domain([0, 1])}
  scaleY={scaleLinear().domain([0, 1])}
>
  <!-- Color bar or symbols-->
  <Section
    x1={colorbarX.x1}
    x2={colorbarX.x2}
    y1={colorbarY.y1}
    y2={colorbarY.y2}
    backgroundColor={'#e8e8e8'}
    scaleX={scaleLinear().domain([0, 1])}
    scaleY={scaleLinear().domain([0, 1])}
  >
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
  />
  <Section/>

  <!-- Title -->
  <Section
    x1={titleSectionX.x1}
    x2={titleSectionX.x2}
    y1={titleSectionY.y1}
    y2={titleSectionY.y2}
    backgroundColor={'silver'}
    scaleX={scaleLinear().domain([0, 1])}
    scaleY={scaleLinear().domain([0, 1])}
  />
  <Section/>
</Section>


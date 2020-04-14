<script>
  import Mark from '../../Marks/Mark/Mark.svelte'
  import { isValid, createTitleXCoord, createTitleYCoord } from './utils.js'
  import { removePadding } from '../utils/padding.js'
  
  // Contexts
  import * as SectionContext from '../Section/SectionContext'
  import * as GraphicContext from '../Graphic/GraphicContext'

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined
  export let vjust = 'top'
  export let hjust = 'center'
  export let xOffset = 0
  export let yOffset = 0
  export let usePadding = false

  // Aesthetics: Title
  export let title = 'Title Text'
  export let titleFill = 'black'
  export let titleStroke = undefined
  export let titleStrokeWidth = undefined
  export let titleStrokeOpacity = undefined
  export let titleFillOpacity = undefined
  export let titleOpacity = 1
  export let titleFontFamily = 'Helvetica'
  export let titleFontSize = 18
  export let titleFontWeight = 'bold'
  export let titleRotation = 0
  export let titleAnchorPoint = 'center'

  // Aesthetics: Subtitle
  export let subtitle = ''
  export let subtitleFill = 'black'
  export let subtitleStroke = undefined
  export let subtitleStrokeWidth = undefined
  export let subtitleStrokeOpacity = undefined
  export let subtitleFillOpacity = undefined
  export let subtitleOpacity = 1
  export let subtitleFontFamily = 'Helvetica'
  export let subtitleFontSize = 14
  export let subtitleFontWeight = 'normal'
  export let subtitleRotation = 0
  export let subtitleX = undefined
  export let subtitleY = undefined
  export let subtitleAnchorPoint = 'center'

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const graphicContext = GraphicContext.subscribe()

  // Private variables
  let _padding
  let xRange = $sectionContext.scaleX.range()
  let yRange = $sectionContext.scaleY.range()
  let totalFontSize

  $: {
    // Removal of padding from pixel value range, if necessary
    if (usePadding === true) {
      _padding = $sectionContext.padding
      if (_padding === undefined) {
        _padding = $graphicContext.padding
      }
      xRange = removePadding(xRange, _padding.left, _padding.right)
      yRange = removePadding(yRange, _padding.top, _padding.bottom)
    }

    // Title text positioning wrt section/graphic context
    totalFontSize = subtitle.length > 0 ? titleFontSize + subtitleFontSize : titleFontSize
  
    // Autopositioning
    if (!isValid(x, y)) {
      x = createTitleXCoord(hjust, xRange, x, xOffset, $sectionContext.flipX)
      y = createTitleYCoord(vjust, yRange, y, yOffset, totalFontSize, $sectionContext.flipY)
    } else {
      let _x, _y

      /** If function, uses pixel values based on padding/no padding setting
       * (does not rely on section/graphic scale)
       * else if value, uses data scale => convert to pixel values
      **/
  
      if ({}.toString.call(x) === '[object Function]') {
        _x = x()
      } else {
        _x = $sectionContext.scaleX(x)
      }

      if ({}.toString.call(y) === '[object Function]') {
        _y = y()
      } else {
        _y = $sectionContext.scaleY(y)
      }

      // Reassignment of values
      x = _x
      y = _y
    }
    if (subtitle.length > 0) {
      if (!isValid(subtitleX, subtitleY)) {
        yRange = $sectionContext.scaleY.range()
        subtitleX = x
        subtitleY = $sectionContext.flipY ? y - titleFontSize * 1.5 : y + titleFontSize * 1.5
      }
    }
  }
</script>

<!-- TITLE -->
{#if isValid(x, y) && title.length > 0}
  <Mark
    type="Label"
    x={ () => { return x } } 
    y={ () => { return y } } 
    {geometry} 
    fill={titleFill} 
    stroke={titleStroke} 
    strokeWidth={titleStrokeWidth}
    strokeOpacity={titleStrokeOpacity} fillOpacity={titleFillOpacity} opacity={titleOpacity}
    text={title}
    fontFamily={titleFontFamily} fontSize={titleFontSize} fontWeight={titleFontWeight} rotation={titleRotation} anchorPoint={titleAnchorPoint}
    {transition} {onClick} {onMouseover} {onMouseout}
    _asPolygon={false}
  />
{/if}

<!-- SUBTITLE -->
<!-- {#if isValid(subtitleX, subtitleY) && subtitle.length > 0} -->
<Mark
  type="Label"
  x={ () => { return subtitleX } } 
  y={ () => { return subtitleY } } 
  {geometry} 
  fill={subtitleFill} stroke={subtitleStroke} strokeWidth={subtitleStrokeWidth}
  strokeOpacity={subtitleStrokeOpacity} fillOpacity={subtitleFillOpacity} opacity={subtitleOpacity}
  text={subtitle}
  fontFamily={subtitleFontFamily} fontSize={subtitleFontSize} fontWeight={subtitleFontWeight} rotation={subtitleRotation} anchorPoint={subtitleAnchorPoint}
  {transition} {onClick} {onMouseover} {onMouseout}
  _asPolygon={false}
/>
<!-- {/if} -->

<script>
  import Mark from '../../Marks/Mark/Mark.svelte' // src/components/Marks/Mark/Mark.svelte
  import { isValid, createTitleXCoord, createTitleYCoord } from './utils.js'
  import { scaleCoordinates } from '../../Marks/Rectangle/createCoordSysGeometry.js'
  import { parsePadding, removePadding } from '../utils/padding.js'
  
  // Contexts
  import * as GraphicContext from '../Graphic/GraphicContext'
  import * as SectionContext from '../Section/SectionContext'
  import * as ZoomContext from '../../Core/Section/ZoomContext'

  // Aesthetics: positioning
  export let x
  export let y
  export let geometry
  export let vjust = 'top'
  export let hjust = 'center'
  export let xOffset = 0
  export let yOffset = 10
  export let usePadding = false

  // Aesthetics: Title
  export let title = 'Title Text'
  export let titleFill = 'black'
  export let titleStroke
  export let titleStrokeWidth
  export let titleStrokeOpacity
  export let titleFillOpacity
  export let titleOpacity = 1
  export let titleFontFamily
  export let titleFontSize = 18
  export let titleFontWeight = 'bold'
  export let titleRotation = 0
  export let titleAnchorPoint = 'center'

  // Aesthetics: Subtitle
  export let subtitle = ''
  export let subtitleFill = 'black'
  export let subtitleStroke
  export let subtitleStrokeWidth
  export let subtitleStrokeOpacity
  export let subtitleFillOpacity
  export let subtitleOpacity = 1
  export let subtitleFontFamily
  export let subtitleFontSize = 14
  export let subtitleFontWeight = 'normal'
  export let subtitleRotation = 0
  export let subtitleAnchorPoint = 'center'
  export let subtitleX
  export let subtitleY

  // Transitions and interactions
  export let transition
  export let onClick
  export let onMouseover
  export let onMouseout

  // Other
  export let zoomIdentity

  // Contexts
  const sectionContext = SectionContext.subscribe()
  const graphicContext = GraphicContext.subscribe()
  const zoomContext = ZoomContext.subscribe()

  // Private variables
  let _padding
  let xRange = $sectionContext.scaleX.range()
  let yRange = $sectionContext.scaleY.range()
  let totalFontSize

  $: {
    if (usePadding === true) {
      _padding = $sectionContext.padding
      xRange = removePadding(xRange, _padding.left, _padding.right)
      yRange = removePadding(yRange, _padding.top, _padding.bottom)
    }
  }

  // Title text positioning wrt section/graphic context
  $: {
    totalFontSize = subtitle.length > 0 ? titleFontSize + subtitleFontSize : titleFontSize
    console.log(x,y)
    // Autopositioning
    if (!isValid(x,y)){
      if (sectionContext.flipX) xRange.reverse()
      x = createTitleXCoord(hjust, xRange, x, xOffset, totalFontSize, sectionContext.flipX, _padding)

      if (sectionContext.flipY) yRange.reverse()
      y = createTitleYCoord(vjust, yRange, y, yOffset, totalFontSize, sectionContext.flipY, _padding)
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
        const yRange = $sectionContext.scaleY.range()
        subtitleX = x
        subtitleY = y + titleFontSize
      }
    }
  }
</script>

<!-- TITLE -->
<!-- {#if isValid(x, y) && title.length > 0} -->
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
  {zoomIdentity} _asPolygon={false}
/>
<!-- {/if} -->

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
  {zoomIdentity} _asPolygon={false}
/>
<!-- {/if} -->
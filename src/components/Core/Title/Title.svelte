<script>
    import Mark from '../../Marks/Mark/Mark.svelte' // src/components/Marks/Mark/Mark.svelte
    import { isValid, createPosYCoords, createPosXCoords } from "./utils.js"

     // Contexts
    import * as GraphicContext from '../Graphic/GraphicContext'
    import * as SectionContext from '../Section/SectionContext'
    
    // Permanent
    import * as ZoomContext from '../../Core/Section/ZoomContext'

    // Aesthetics: positioning
    export let x = undefined
    export let y = undefined
    export let geometry = undefined
    export let vjust = 'top'
    export let hjust = 'center'

    // Aesthetics: other
    export let fill = 'black'
    export let stroke = undefined
    export let strokeWidth = undefined
    export let strokeOpacity = undefined
    export let fillOpacity = undefined
    export let opacity = 1
    export let text = 'Title Text'
    export let fontFamily = undefined
    export let fontSize = 16
    export let fontWeight = 'bold'
    export let rotation = 0
    export let anchorPoint = 'center'

    // Transitions and interactions
    export let transition = undefined
    export let onClick = undefined
    export let onMouseover = undefined
    export let onMouseout = undefined
    export let onDragstart = undefined
    export let onDrag = undefined
    export let onDragend = undefined

    // Other
    export let zoomIdentity = undefined

    console.log(x, y, fill, text)
    // Section positioning wrt section/graphic context
    // $: {
    //     if (!isValid(x, y)) {
    //         const xRange = $sectionContext.scaleX.domain()
    //         const yRange = $sectionContext.scaleY.domain()

    //         if (sectionContext.flipX) xRange.reverse()
    //         xCoords = createPosXCoords(hjust, xRange, orient, width, xOffset, labelFontSize)
    //         x1 = xCoords.x1
    //         x2 = xCoords.x2
    //         width = xCoords.width
    //         if (sectionContext.flipY) yRange.reverse()
    //         yCoords = createPosYCoords(vjust, yRange, orient, height, yOffset, titleFontSize)
    //         yCoords.y1 = yCoords.y1
    //         y1 = yCoords.y1
    //         y2 = yCoords.y2
    //         height = yCoords.height
    //     } else { 
    //         xCoords = { x1, x2, width: Math.abs(x2 - x1) }
    //         yCoords = { y1, y2, height: Math.abs(y2 - y1) }
    //     }
    // }

    // Title positioning wrt section/graphic context
    // $: {
    //     if (title.length > 0) {
    //         // continue
    //     }
    // }

    // geometry

</script>

<Mark
  type="Label"
  {x} {y} {geometry} 
  {fill} {stroke} {strokeWidth}
  {strokeOpacity} {fillOpacity} {opacity}
  {text}
  {fontFamily} {fontSize} {fontWeight} {rotation} {anchorPoint}
  {transition} {onClick} {onMouseover} {onMouseout}
  {onDragstart} {onDrag} {onDragend}
  {zoomIdentity} _asPolygon={false}
/>
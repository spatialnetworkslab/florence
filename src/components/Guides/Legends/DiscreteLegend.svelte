<script>
    import { Label, LabelLayer, Rectangle, RectangleLayer, Section } from "../../../"
    import { scaleDiverging, scaleSequential, scaleLinear, scalePow, scaleQuantise, scaleOrdinal, scaleSqrt, scaleLog } from 'd3-scale'
    import { default as getDataType } from '../../../utils/getDataType.js'

   // import DataContainer from '@snlab/florence-datacontainer/dist/florence-datacontainer.umd.js'
    //import { ticks as arrayTicks } from 'd3-array'

    import * as GraphicContext from '../../Core/Graphic/GraphicContext'
    import * as SectionContext from '../../Core/Section/SectionContext'
    import * as ZoomContext from '../../Core/Section/ZoomContext'

    import { getTickPositions, getFormat, getTicks, getColorGeoms } from './utils.js'
    import { createYAxisCoords, createYTickGeoms, createYLabelGeoms, createTitleXCoord, createTitleYCoord} from "../Axes/createYAxisCoords.js"

    // global properties

    // Aesthetics: positioning
    export let x1 = undefined
    export let x2 = undefined
    export let y1 = undefined
    export let y2 = undefined
    export let position = undefined
    export let orient = 'vertical'
    export let colorBarLength = 0.85
    export let colorBarWidth = 0.7

    // Aesthetics: colors
    export let type = undefined // gradient, discrete, symbol
    export let scale = undefined
    export let fillOpacity = undefined
    export let flip = false
    export let flipLabels = false
    export let background = 'none'
    export let backgroundOpacity = 0.3

    // Aesthetics: mappable
    export let fill = undefined
    export let opacity = undefined
    export let size = undefined
    export let shape = undefined
    export let stroke = undefined
    export let strokeDash = undefined
    export let strokeWdith = undefined

    // tick labels
    export let labelFormat = undefined
    export let labelOffset = 0.2
    export let labelRotate = 0
    export let labelFont = 'Helvetica'
    export let labelFontSize = 10
    export let labelFontWeight = 'normal'
    export let labelOpacity = 1
    export let labelColor = 'black'
    export let labelCount = 10
    export let labelExtra = false
    export let labelAnchorPoint = 'center'
    export let firstLabel = undefined
    export let nice = false
    export let format = undefined

    // axis title
    export let titleHjust = 'center'
    export let titleXOffset = 0
    export let titleX = undefined
    export let titleVjust = 'axis'
    export let titleYOffset = 'axis'
    export let titleY = undefined
    export let title = 'Legend'
    export let titleColor = 'black'
    export let titleFont = 'Helvetica'
    export let titleFontSize = '14'
    export let titleFontWeight = 'bold'
    export let titleOpacity = 1
    export let titleRotation = 0
    export let titleAnchorPoint = 't'

    // transition
    export let transition = undefined
    export let zoomIdentity = undefined

    // Contexts
    const sectionContext = SectionContext.subscribe()
    const graphicContext = GraphicContext.subscribe()
    const zoomContext = ZoomContext.subscribe()

    function isValid (x1, x2, y1, y2){
        if (!isNaN(x1) && !isNaN(x2) && !isNaN(y1) && !isNaN(y2)){
            return true
        }

        return false
    }

    let leadScale
    let tickLabelText 
    let tickLabelPositions
    let tickLabelXCoords
    let tickLabelYCoords
    let tickColors
    let tickOpacities

    let colorXStartCoords
    let colorXEndCoords
    let colorYStartCoords 
    let colorYEndCoords 
    
    // CHECK: that scale is provided,
    // that least one of `fill, opacity` has been specified
    $: {
        if (fill || opacity){
            // continue
        } else if (typeof scale === 'undefined'  && (!size && !shape && !fill && !stroke && !strokeDash && !strokeWidth && !opacity)) {
            throw new Error(`Couldn't construct legend. Please provide at least 'fill', 'size', 'shape'
            'stroke'  or 'strokeDash' with either a 'ticks' or a 'domain' method.`)
        }

        if (!scale){
            throw new Error(`Couldn't construct legend. Please provide scale.`)
        }
    }

    // LABELS
    $: {
        tickLabelText = getTicks(scale, labelCount, labelExtra, firstLabel)
        let locRange
        if (orient === 'vertical') {
            if (flip) { locRange = [1 - colorBarLength, 1] } else { locRange = [0, colorBarLength] }
            tickLabelYCoords = getTickPositions(tickLabelText, scale, labelCount, labelExtra, locRange)
            tickLabelXCoords = 1 - colorBarLength
            format = getFormat(labelFormat, scale, tickLabelYCoords.length)

        } else if (orient === 'horizontal'){
            if (flip) { locRange = [1 - colorBarWidth, 1] } else { locRange = [0, colorBarWidth] }
            tickLabelXCoords = getTickPositions(tickLabelText, scale, labelCount, labelExtra, locRange)
            tickLabelYCoords = 1 - colorBarWidth
            format = getFormat(labelFormat, scale, tickLabelXCoords.length)

        } else {
            //raise error
        }
        
        tickLabelText = tickLabelText.map(format)
    }   

    // COLORS
    $: {
        if (fill) {
            // d3 scale
            if (fill.constructor === Function) {
                tickColors = tickLabelText.map((value, i) => {
                    if (Array.isArray(scale[0]) && scale.length > 0) {
                        return fill(i)
                    } else {
                        return fill(value)
                    }
                    
                })
            // aray
            } else if (fill.constructor === Array) {
                tickColors = tickLabelText.map((value, i) => {
                    return fill[i]
                })
            }

            if (orient === 'vertical') {
                const colorGeoms = getColorGeoms(tickColors, orient, scale, tickLabelText, tickLabelYCoords, colorBarLength, colorBarWidth, flipLabels)
                console.log(colorGeoms)
            } else {
                const colorGeoms = getColorGeoms(tickColors, orient, scale, tickLabelText, tickLabelXCoords, colorBarLength, colorBarWidth, flipLabels)
                console.log(colorGeoms)
            }
            
        } else {
           throw new Error(`Couldn't construct legend. Please provide 'fill' or a scale with
            either a 'ticks' or a 'domain' method.`)
        }
    }

    

</script>

<g class="discrete-legend">
    {#if isValid(x1, x2, y1, y2)}
        <Section
            {x1} {y1}
            {x2} {y2}
            scaleX={scaleLinear().domain([0, 1])} 
            scaleY={scaleLinear().domain([0, 1])}
            flipY
            backgroundColor = {'pink'}
        >   
            <Label 
                x={0.5}
                y={0.95}
                text={title}
                fontFamily={titleFont}
                fontSize={titleFontSize}
                fontWeight={titleFontWeight}
                rotation={titleRotation}
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
<!-- 
            <RectangleLayer
                x1 = {0}
                x2 = {1}
                y1 = {0}
                y2 = {1}
                fill = {tickColors}
                fillOpacity = {tickOpacities}
            /> -->

        </Section>

    {/if}

</g>
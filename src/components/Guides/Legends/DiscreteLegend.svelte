<script>
    import { Label, LabelLayer, Rectangle, RectangleLayer, Section } from "../../../"
    import { scaleDiverging, scaleSequential, scaleLinear, scalePow, scaleQuantise, scaleOrdinal, scaleSqrt, scaleLog } from 'd3-scale'
    import { default as getDataType } from '../../../utils/getDataType.js'

    import { createPosYCoords } from "./createLegendCoords.js"

    // Test
    import * as GraphicContext from '../../Core/Graphic/GraphicContext'
    import * as SectionContext from '../../Core/Section/SectionContext'
    
    // Permanent
    import * as ZoomContext from '../../Core/Section/ZoomContext'

    import { getTickPositions, getFormat, getTicks, getColorGeoms, isValid } from './utils.js'
    // global properties

    // Aesthetics: positioning
    export let x1 = undefined
    export let x2 = undefined
    export let y1 = undefined
    export let y2 = undefined
    export let orient = 'vertical'
    export let colorBarLength = 0.85
    export let colorBarWidth = 0.7
    export let vjust = 'center'
    export let yOffset = undefined
    export let hjust = 'left'
    export let xOffset = 0

    // Aesthetics: colors
    export let scale = undefined
    export let flip = false
    export let flipLabels = false
    export let background = 'none'
    export let backgroundOpacity = 0.3

    // Aesthetics: mappable
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

    // axis title
    export let titleHjust = 'center'
    export let titleXOffset = 0
    export let titleX = 0.5
    export let titleVjust = 'axis'
    export let titleYOffset = 'axis'
    export let titleY = 0.925
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
    // Test
    const sectionContext = SectionContext.subscribe()
    const graphicContext = GraphicContext.subscribe()

    // Permanent
    const zoomContext = ZoomContext.subscribe()

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
    let colorGeoms

    let posScaleY
    let xCoords
    let yCoords

    // TEST: absolute positioning with no scale transforms
    $: {
        const xRange = $sectionContext.scaleX.range()

        if (sectionContext.flipX) xRange.reverse()

        const x1Range = xRange[0]
        const x2Range = xRange[1]
        const widthRatio = orient === 'vertical' ? 0.15 : 0.3
        xOffset = xOffset === 0 ? (x2Range - x1Range) * widthRatio : xOffset
        
        if (hjust === 'left') {
            xCoords = () => {
            return [x1Range, x1Range + xOffset]
            }
        }
        if (hjust === 'center') {
            const xCoord = (x2Range - x1Range) * 0.5 + x1Range
            xCoords = () => {
            return [xCoord, xCoord + xOffset]
            }
        }
        if (hjust === 'right') {
            xCoords = () => {
            return [x2Range, x2Range + xOffset]
            }
        }
        if (!isNaN(hjust)) {
            const xCoord = (x2Range - x1Range) * hjust + x1Range
            xCoords = () => {
            return [xCoord, xCoord + xOffset]
            }
        }

        if (x1 === undefined && x2 === undefined) {
            x1 = xCoords()[0]
            x2 = xCoords()[1]
        }

        console.log('!!!', x1, x2, xRange)
    }

    $: {
        const yRange = $sectionContext.scaleY.range()
        if (sectionContext.flipY) YRange.reverse()
        const y1Range = yRange[0]
        const y2Range = yRange[1]
        const heightRatio = orient === 'vertical' ? 0.1 : 0.15
        yOffset = (yOffset === 0 || yOffset === undefined) ? (y2Range - y1Range) * heightRatio : yOffset

        yCoords = () => {
            return [y1Range, y2Range]
        }

        if (vjust === 'top') {
            yCoords = () => {
            return [y2Range, y2Range - yOffset]
            }
        }
        if (vjust === 'center') {
            const yCoord = (y2Range - y1Range) * 0.5 + y1Range
            console.log('___', yCoord, yOffset, y2Range, y1Range)
            yCoords = () => {
            return [yCoord - yOffset, yCoord + yOffset]
            }
            console.log([yCoord, yCoord + yOffset])
        }
        if (vjust === 'bottom') {
            yCoords = () => {
            return [y1Range, y1Range + yOffset]
            }
        }

        if (!isNaN(vjust)) {
            const yCoord = (y2Range - y1Range) * vjust + y1Range
            yCoords = () => {
            return [yCoord, yCoord + yOffset]
            }
        }

        if (y1 === undefined && y2 === undefined) {
            y1 = yCoords()[0]
            y2 = yCoords()[1]
        }
        console.log(y1, y2, yRange)
    }

    // CHECK: that scale is provided,
    // that least one of `fill, opacity` has been specified
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
        if (orient === 'horizontal') {
            colorBarLength = 0.5
            colorBarWidth  = 1.0
        }
    }

    // LABELS
    $: {
        tickLabelText = getTicks(scale, labelCount, labelExtra, firstLabel)
        let locRange
        if (orient === 'vertical') {
            // locRange = [0.02, colorBarLength] 
            locRange = yCoords()
            tickLabelYCoords = getTickPositions(tickLabelText, scale, labelCount, labelExtra, colorBarLength, locRange, orient, flip)
            tickLabelXCoords = flipLabels ? colorBarLength : 1 - colorBarLength
            if (labelX) {
                tickLabelXCoords = labelX
            }
            format = getFormat(labelFormat, scale, tickLabelYCoords.length)

        } else if (orient === 'horizontal'){
            // locRange = [0.05, colorBarWidth - 0.05] 
            locRange = xCoords()
            tickLabelXCoords = getTickPositions(tickLabelText, scale, labelCount, labelExtra, colorBarWidth, locRange, orient, flip)
            tickLabelYCoords = flipLabels ? 0.7 : 0.05
            if (labelY) {
                tickLabelYCoords = labelY
            }
            format = getFormat(labelFormat, scale, tickLabelXCoords.length)
        } else {
            throw new Error(`Couldn't construct legend. Please provide either 'vertical' or 'horizontal' to 'orient' prop.`)
        }
        console.log('???', tickLabelYCoords, tickLabelXCoords)
        tickLabelText = tickLabelText.map(format)
    }   

    // COLORS
    $: {
        if (fill && (fill.constructor === Array || fill.constructor === Function)) {
            // d3 scale
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
            } else {
                tickLabelPositions = tickLabelXCoords
            }
            colorGeoms = getColorGeoms(tickColors, orient, scale, tickLabelText, tickLabelPositions, colorBarLength, colorBarWidth, flipLabels, flip)
            if (!tickOpacities){
                tickOpacities = fill
            }
        } 
    }

    // OPACITY
    $: {
        if (fillOpacity && (fillOpacity.constructor === Array || fillOpacity.constructor === Function)) {
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
            } else {
                tickLabelPositions = tickLabelXCoords
            }

            colorGeoms = getColorGeoms(tickOpacities, orient, scale, tickLabelText, tickLabelPositions, colorBarLength, colorBarWidth, flipLabels, flip)
            if (!tickColors){
                tickColors = fill
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
    {#if isValid(x1, x2, y1, y2)}
        <!-- <Section
            {x1} {y1}
            {x2} {y2}
            scaleX={scaleLinear().domain([0, 1])} 
            scaleY={scaleLinear().domain([0, 1])}
            {zoomIdentity}
            flipY
        >    -->
           <RectangleLayer
                x1 = {colorXStartCoords}
                x2 = {colorXEndCoords}
                y1 = {colorYStartCoords}
                y2 = {colorYEndCoords}
                fill = {tickColors}
                fillOpacity = {tickOpacities}
                {transition} 
            />

             <!-- <Label 
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
            /> -->
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
        <!-- </Section> -->

    {/if}

</g>
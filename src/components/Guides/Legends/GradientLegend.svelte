<script>
    import { Label, LabelLayer, Rectangle, RectangleLayer, Section } from "../../../"
    import { scaleDiverging, scaleSequential, scaleLinear, scalePow, scaleQuantise, scaleOrdinal, scaleSqrt, scaleLog } from 'd3-scale'
    import { default as getDataType } from '../../../utils/getDataType.js'

   // import DataContainer from '@snlab/florence-datacontainer/dist/florence-datacontainer.umd.js'
    //import { ticks as arrayTicks } from 'd3-array'

    import * as GraphicContext from '../../Core/Graphic/GraphicContext'
    import * as SectionContext from '../../Core/Section/SectionContext'
    import * as ZoomContext from '../../Core/Section/ZoomContext'

    import { getTickPositions, getFormat, getTicks, getGradientGeoms } from './utils.js'
    // global properties

    // Aesthetics: positioning
    export let x1 = undefined
    export let x2 = undefined
    export let y1 = undefined
    export let y2 = undefined
    export let position = undefined
    export let orient = 'vertical'
    export let colorBarLength = 0.9
    export let colorBarWidth = 0.7

    // Aesthetics: colors
    export let scale = undefined
    export let flip = false
    export let flipLabels = false
    export let background = 'none'
    export let backgroundOpacity = 0.3

    // Aesthetics: mappable
    export let fill = undefined
    export let fillOpacity = undefined
    // export let size = undefined
    // export let shape = undefined
    // export let stroke = undefined
    // export let strokeDash = undefined
    // export let strokeWdith = undefined

    // tick labels
    export let labelFormat = undefined
    export let labelOffset = 0.2
    export let labelRotate = 0
    export let labelAlign = undefined
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
    export let titleX = 0.5
    export let titleVjust = 'axis'
    export let titleYOffset = 'axis'
    export let titleY = 0.96
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
    let colorGeoms
    
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
            titleY = 0.9
        }
    }

    // LABELS
    $: {
        tickLabelText = getTicks(scale, labelCount, labelExtra, firstLabel)
        let locRange
        if (orient === 'vertical') {
            locRange = [0, colorBarLength] 
            tickLabelYCoords = getTickPositions(tickLabelText, scale, labelCount, labelExtra, colorBarLength, locRange, orient, flip)
            tickLabelXCoords = flipLabels ? colorBarLength : 1 - colorBarLength
            if (labelAlign) {
                tickLabelXCoords = labelAlign
            }
            format = getFormat(labelFormat, scale, tickLabelYCoords.length)

        } else if (orient === 'horizontal'){
            locRange = [0.02, colorBarWidth - 0.02] 
            tickLabelXCoords = getTickPositions(tickLabelText, scale, labelCount, labelExtra, colorBarWidth, locRange, orient, flip)
            tickLabelYCoords = flipLabels ? 0.7 : 0.05
            if (labelAlign) {
                tickLabelYCoords = labelAlign
            }
            format = getFormat(labelFormat, scale, tickLabelXCoords.length)
        } else {
            throw new Error(`Couldn't construct legend. Please provide either 'vertical' or 'horizontal' to 'orient' prop.`)
        }
        
        tickLabelText = tickLabelText.map(format)
    }   

    // COLORS
    $: {
        if (fill || fillOpacity) {
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
                colorGeoms = getGradientGeoms(tickColors, orient, scale, tickLabelText, tickLabelPositions, colorBarLength, colorBarWidth, flipLabels, flip)
                console.log(fillOpacity)
                if (!tickOpacities){
                    tickOpacities = fill
                }
            } 
            
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

                colorGeoms = getGradientGeoms(tickOpacities, orient, scale, tickLabelText, tickLabelPositions, colorBarLength, colorBarWidth, flipLabels, flip)
                if (!tickColors){
                    tickColors = fill
                }
            }     
        } else {
           throw new Error(`Couldn't construct legend. Please provide 'fill' or a scale with
            either a 'ticks' or a 'domain' method.`)
        }
        console.log(colorGeoms)
        // colorXStartCoords = colorGeoms.colorXStartCoords
        // colorXEndCoords = colorGeoms.colorXEndCoords
        // colorYStartCoords = colorGeoms.colorYStartCoords
        // colorYEndCoords = colorGeoms.colorYEndCoords

    }


</script>

<g class="gradient-legend">
     <!-- Gradient definition -->
     <!--
         end of gradient
         .offset (end of gradient color, opacity)
         get this from colorGeoms
     -->
    <defs>
      <linearGradient
        id='gradient'
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%">
        <!-- add uuid approach -->
        {#each colorGeoms as c, i}
            <stop
            key={i}
            offset={`${c*100 + '%'}`}
            style={`stop-color:${tickColors[i]};stop-opacity:${tickOpacities(i)}`}
            />
        {/each}
      </linearGradient>
    </defs>
    
    {#if isValid(x1, x2, y1, y2)}
        <Section
            {x1} {y1}
            {x2} {y2}
            scaleX={scaleLinear().domain([0, 1])} 
            scaleY={scaleLinear().domain([0, 1])}
            flipY
        >   
            <Rectangle
                x1 = {1-colorBarWidth}
                x2 = {1}
                y1 = {0}
                y2 = {colorBarLength}
                fill = {"url(#gradient)"}
            />

            <Label 
                x={titleX}
                y={titleY}
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
        </Section>

    {/if}

</g>
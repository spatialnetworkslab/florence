<script>
    import { Label, LabelLayer, Rectangle, RectangleLayer, Section } from "../../../"
    import { scaleDiverging, scaleSequential, scaleLinear, scalePow, scaleQuantise, scaleOrdinal, scaleSqrt, scaleLog } from 'd3-scale'
    import { default as getDataType } from '../../../utils/getDataType.js'
    import DataContainer from '@snlab/florence-datacontainer/dist/florence-datacontainer.umd.js'
    import { ticks as arrayTicks } from 'd3-array'

    // global properties
    // Aesthetics: positioning
    export let x = undefined
    export let y = undefined
    export let x1 = undefined
    export let x2 = undefined
    export let y1 = undefined
    export let y2 = undefined
    export let orientation = 'vertical'
    export let colorBarLength = 0.85
    export let colorBarWidth = 0.7

    // Aesthetics: colors
    export let scale = undefined
    export let fill = undefined
    export let fillOpacity = undefined
    export let flip = false
    export let flipLabels = false
    export let background = 'none'
    export let backgroundOpacity = 0.3

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
    export let labelExtra = true
    export let labelAnchorPoint = 'r'
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
    export let title = ''
    export let titleColor = 'black'
    export let titleFont = 'Helvetica'
    export let titleFontSize = '12'
    export let titleFontWeight = 'normal'
    export let titleOpacity = 1
    export let titleRotation = 0
    export let titleAnchorPoint = 't'

    // transition
    export let transition = undefined
    export let zoomIdentity = undefined

    const composeGradient = function () {
    }

    function isValid (x1, x2, y1, y2){
        if (!isNaN(x1) && !isNaN(x2) && !isNaN(y1) && !isNaN(y2)){
            return true
        }

        return false
    }

    let tickLabelText 
    let tickLabelXCoords
    let tickLabelYCoords
    let colorBarStartXCoords 
    let colorBarEndXCoords 
    let colorBarStartYCoords 
    let colorBarEndYCoords = []
    let colors 

    // let data = new DataContainer({ 
    //     tickLabelText, tickLabelXCoords, tickLabelYCoords, colorBarXCoords, colorBarYCoords, colors
    // })

    let locScale
    let locScaleColors
    let legendData 
    // allow for both array and d3 scales 
    // TODO: enumerate colors, labels
    // quant, category, temporal, interval: quant (bin), interval: temp

    // LABELS
    $: {
        //console.log(scale.ticks(labelCount), getDataType(scale))
        // d3 scale
        if (getDataType(scale) === 'function') {
            tickLabelText = scale.ticks(labelCount)
        } else if (getDataType(scale) === 'interval:quantitative') {
            tickLabelText = arrayTicks(...scale, labelCount)
            if (firstLabel !== undefined){
                if (labelExtra && newTickValues[0] !== firstLabel) {
                    tickLabelText.unshift(firstLabel)
                }
            }
        } else if (getDataType(scale) === 'temporal') {
            // pass
        } else if (getDataType(scale) === 'quantitative') {
            // pass
        } else if (getDataType(scale) === 'categorical') {
            // pass
        }
    }   

    // LOCATION
    $: {
        let locRange
        if (flip) { locRange = [1 - colorBarLength, 1] } else { locRange = [0, colorBarLength] }

        // d3 scale
        if (getDataType(scale) === 'function') {
            locScale = scale.range(locRange)
        } else if (getDataType(scale[0]) === 'interval:quantitative') {
            let tickDomain = [Math.min(...tickLabelText), Math.max(...tickLabelText)]
            console.log(tickDomain, locRange)
            locScale = scaleLinear().domain(tickDomain).range(locRange)
        } else if (getDataType(scale[0]) === 'temporal') {
            // pass
        } else if (getDataType(scale[0]) === 'quantitative') {
            locScale = 0.85/tickLabelText.length
        } else if (getDataType(scale[0]) === 'categorical') {
            // pass
        }
        console.log(getDataType(scale))
        if (orientation === 'vertical') {
            tickLabelXCoords = tickLabelText.map((value, i) => {
                return labelOffset
            })

            tickLabelYCoords = tickLabelText.map((value, i) => {
                if (flip) {
                    return 1 - locScale * i//1 - locScale(value)
                } 

                return locScale * (i +0.5)// locScale(value)
            })

            colorBarStartXCoords = tickLabelText.map((value, i) => {
                if (flip){
                    1
                }
                return 0
            })

            colorBarEndXCoords = tickLabelText.map((value, i) => {
                if (flip){
                    0
                }
                return 1
            })

            colorBarStartYCoords = tickLabelText.map((value, i) => {
                if (i === 0) {
                    return 0
                }
                return locScale * i //locScale(value)
            })

            colorBarEndYCoords = tickLabelText.map((value, i) => {
                if (i === tickLabelText.length - 1) {
                    return colorBarLength
                }

                return locScale * (i+1)// locScale(tickLabelText[i+1])
            })
        } else {
            tickLabelYCoords = tickLabelText.map((value, i) => {
                return labelOffset
            })

            tickLabelXCoords = tickLabelText.map((value, i) => {
                if (flip) {
                    return locScale(value)
                } 

                return 1 - locScale(value)
            })
        }
    }

    // COLORS
    $: {
        // d3 scale
        if (fill.constructor === Function) {
            colors = tickLabelText.map((value, i) => {
                return fill(value)
            })
        // aray
        } else if (fill.constructor === Array) {
            colors.map((value, i) => {
                return fill[i]
            })
        }
        console.log(fill)
        console.log(scale)
        console.log(tickLabelText)
        console.log(tickLabelYCoords)
        console.log(colorBarStartYCoords)
        console.log(colorBarEndYCoords)
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
        >   
            <Label 
                x={0.5}
                y={0.95}
                text={'Legends'}
                fontFamily="Helvetica"
                fontSize="16"
                fontWeight="bold"
                rotation={0}
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

            <Rectangle
                x1 = {0}
                x2 = {1}
                y1 = {0}
                y2 = {1}
                fill = {background}
                fillOpacity = {backgroundOpacity}
            />

            <Section
                x1 = {1-colorBarWidth}
                x2 = {1}
                y1 = {0}
                y2 = {colorBarLength}
                backgroundColor={'pink'}
                scaleX={scaleLinear().domain([0, 1])} 
                scaleY={scaleLinear().domain([0, 1])}
             >   

                <RectangleLayer 
                    x1={colorBarStartXCoords}
                    x2={colorBarEndXCoords}
                    y1={colorBarStartYCoords}
                    y2={colorBarEndXCoords}
                    fill={colors}
                />
            </Section>
        </Section>

    {/if}

</g>
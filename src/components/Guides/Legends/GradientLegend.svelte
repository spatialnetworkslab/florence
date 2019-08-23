<script>
    import { Label, LabelLayer, Rectangle, RectangleLayer, Section } from "../../../"
    import { scaleDiverging, scaleSequential, scaleLinear, scalePow, scaleQuantise, scaleOrdinal, scaleSqrt, scaleLog } from 'd3-scale'
    // import * as GraphicContext from '../../Core/Graphic/GraphicContext'
    // import * as SectionContext from "../../Core/Section/SectionContext"
    // '.'

    // global properties
    // Aesthetics: positioning
    export let x = undefined
    export let y = undefined
    export let x1 = undefined
    export let x2 = undefined
    export let y1 = undefined
    export let y2 = undefined
    export let scale = undefined
    export let fill = undefined
    export let fillOpacity = undefined
    export let flip = false
    export let flipLabels = false
    export let background = 'green'

    // tick labels
    export let labelFormat = undefined
    export let labelOffset = 2
    export let labelRotate = 0
    export let labelFont = 'Helvetica'
    export let labelFontSize = 10
    export let labelFontWeight = 'normal'
    export let labelOpacity = 1
    export let labelColor = 'black'

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

    // // Contexts
    // const sectionContext = SectionContext.subscribe()
    // const graphicContext = GraphicContext.subscribe()
    // const zoomContext = ZoomContext.subscribe()

    const composeGradient = function () {
      let specs = {}
      if (this.orientation === 'vertical') {
        specs.endX = '0%'
        specs.endY = '100%'
      } else {
        specs.endX = '100%'
        specs.endY = '0%'
      }
      return specs
    }

    function isValid (x1, x2, y1, y2){
        if (!isNaN(x1) && !isNaN(x2) && !isNaN(y1) && !isNaN(y2)){
            return true
        }

        return false
    }

    // $: {
    //     // colors = { fill, offset: {}, opacity; {}}
    //     colors = (typeof fill === "Array") ? $sectionContext._scaleX : scale; 
    //     ({xCoords, yCoords} = createXAxisCoords(vjust, y, yOffset, scaleX, $sectionContext._scaleY, $sectionContext))
    // }
</script>

<g class="gradient-legend">
<!-- Gradient definition -->
    <defs>
      <linearGradient
        :id="uuid"
        :x2="composeGradient.endX"
        :y2="composeGradient.endY"
        x1="0%"
        y1="0%">
        {#each fill as c}
            <stop
            :key="i"
            :offset="`${100 + '%'}`"
            :style="`stop-color:${c};stop-opacity:${1}`" />
        {/each}
        
      </linearGradient>
    </defs>

    {#if isValid(x1, x2, y1, y2)}
        <Section
            {x1} {y1}
            {x2} {y2}
            scaleX={scaleLinear().domain([0, 1])} 
            scaleY={scaleLinear().domain([0, 1])}
        >   
        <Label 
            x={0.5}
            y={0.05}
            text={'Legends'}
            fontFamily="Helvetica"
            fontSize="16"
            fontWeight="bold"
            rotation={0}
        />
            <Rectangle
                x1 = {0}
                x2 = {1}
                y1 = {0}
                y2 = {1}
                fill = {background}
                fillOpacity = {0.3}
            />
        <!-- get colors for graident to work first, end pt 23 aug  -->
            <Rectangle
                x1 = {0.3}
                x2 = {1}
                y1 = {0.125}
                y2 = {1}
                fill={`url(#uuid)`}
            />
    
        </Section>

    {/if}

</g>
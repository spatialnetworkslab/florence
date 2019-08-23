<script>
    import { Label, LabelLayer, Rectangle, RectangleLayer, Section } from "../../../"
    import * as GraphicContext from '../../Core/Graphic/GraphicContext'
    import * as SectionContext from "../../Core/Section/SectionContext"

    // global properties
    export let scale = undefined
    export let fill = undefined
    export let fillOpacity = undefined
    export let flip = false
    export let flipLabels = false
    export let background = undefined

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

    // Contexts
    const sectionContext = SectionContext.subscribe()
    const graphicContext = GraphicContext.subscribe()
    const zoomContext = ZoomContext.subscribe()

</script>

<g class="gradient-legend">
    <Section
        x1={50} x2={450}
        y1={50} y2={450}
        scaleX={[0, 1]} 
        scaleY={[0, 1]}
    >

    </Section>
    <!-- big space for container or section? maybe section is better-->
    <!-- <Rectangle
        x1={row.fruit}
        x2={({ scaleX }) => scaleX(row.fruit) + scaleX.bandwidth()}
        y1={0}
        y2={row.meanQuantity}
        fill={transformation === 'identity' ? 'green' : 'blue'}
        transition={2000}
    /> -->

    <!---
        Title
        Rectangle layer for individual stuff 
        Colorscales?
    -->

</g>
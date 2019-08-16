<script>
    import { Label, LabelLayer, Rectangle, RectangleLayer, Section } from "../../../"
    import * as GraphicContext from '../../Core/Graphic/GraphicContext'
    import * as SectionContext from "../../Core/Section/SectionContext"

// necessary props
// legend size
// title, title props
// orientation
// location x y w h or x1, x2, y1, y2; default x y w h
// position
// scale
// fill, fill-opacity
// background
// format
// flip, flip-labels
// total-opacity (whole legend)
// position 
// labels, label props, label count, show last, show first, label padding

</script>

<g class="gradient-legend">
    <!-- big space for container or section? maybe section is better-->
    <Rectangle
        x1={row.fruit}
        x2={({ scaleX }) => scaleX(row.fruit) + scaleX.bandwidth()}
        y1={0}
        y2={row.meanQuantity}
        fill={transformation === 'identity' ? 'green' : 'blue'}
        transition={2000}
        onClick={handler}
    />

    <!---
        Title
        Rectangle layer for individual stuff 
        Colorscales?
    -->

</g>
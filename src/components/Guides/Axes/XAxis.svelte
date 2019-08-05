<script>
  import { Line, LineLayer, LabelLayer } from "../../../"
  import * as SectionContext from "../../Core/Section/SectionContext"

  import { createXAxisCoords, generateXTickGeoms, generateXLabelGeoms} from "./createXAxisCoords.js"

  export let scale = undefined

  export let vjust = "bottom"
  export let y = undefined
  export let offset = 0

  export let ticks = true
  export let tickCount = 10
  export let tickExtra = false
  export let tickValues = undefined
  export let tickSize = 5
  export let tickWidth = 0.5

  export let labelFormat = undefined
  export let labelOffset = 2
  export let labelRotate = 0
  export let labelFont = "Helvetica"
  export let labelFontSize = 10

  // Contexts
  const sectionContext = SectionContext.subscribe()
  
  let xCoords
  let yCoords
  let tickPositions
  let tickXCoords
  let tickYCoords
  let tickLabelXCoords
  let tickLabelYCoords
  let format
  let tickLabelText

  $: {
    if (typeof scale === "undefined") {
      scale = $sectionContext._scaleX
    }
    ({xCoords, yCoords} = createXAxisCoords(vjust, y, $sectionContext._rangeX, $sectionContext._rangeY, offset, scale, $sectionContext._scaleY))
  }
  $: {
    tickPositions = scale.ticks(tickCount);
    console.log(tickPositions);
    ({tickXCoords, tickYCoords} = generateXTickGeoms(tickPositions, yCoords, tickSize));
    ({tickLabelXCoords, tickLabelYCoords} = generateXLabelGeoms(tickPositions, yCoords, tickSize, labelOffset))
    format = (labelFormat) ? labelFormat : scale.tickFormat(tickPositions.length)
    console.log(format)
    tickLabelText = tickPositions.map(format)
    console.log(tickLabelText)
  }
</script>

<Line x={xCoords} y={yCoords} strokeWidth={1} />
{#if ticks}
  <LineLayer x={tickXCoords} y={tickYCoords} strokeWidth={tickWidth}/>
  <LabelLayer x={tickLabelXCoords} y={tickLabelYCoords} text={tickLabelText} anchorPoint="t" rotation={labelRotate} fontFamily={labelFont} fontSize={labelFontSize}/>
{/if}


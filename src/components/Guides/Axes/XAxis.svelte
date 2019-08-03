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
  
  if (typeof scale === "undefined") {
    scale = $sectionContext._scaleX
  }

  const {xCoords, yCoords} = createXAxisCoords(vjust, $sectionContext._rangeX, $sectionContext._rangeY, offset)

  const tickPositions = scale.ticks(tickCount)
  const {tickXCoords, tickYCoords} = generateXTickGeoms(tickPositions, yCoords, tickSize)
  const {tickLabelXCoords, tickLabelYCoords} = generateXLabelGeoms(tickPositions, yCoords, tickSize, labelOffset)
  const format = (labelFormat) ? labelFormat : scale.tickFormat(tickCount)
  const tickLabelText = tickPositions.map(format)
</script>

<Line x={xCoords} y={yCoords} strokeWidth={1} />
{#if ticks}
  <LineLayer x={tickXCoords} y={tickYCoords} strokeWidth={tickWidth}/>
  <LabelLayer x={tickLabelXCoords} y={tickLabelYCoords} text={tickLabelText} anchorPoint="t" rotation={labelRotate} fontFamily={labelFont} fontSize={labelFontSize}/>
{/if}


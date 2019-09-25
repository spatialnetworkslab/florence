<script>
  import { scaleLinear } from 'd3-scale'
	import { Graphic, Section, Point, Rectangle, Line, Polygon, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  let section
  let makingSelection = false
  let selectionRectangle

  const onMousedown = ({ screenCoordinates }) => {
    section.resetSelection()

    makingSelection = true
    const { x, y } = screenCoordinates
    selectionRectangle = { x1: x, x2: x, y1: y, y2: y }

    section.selectRectangle(selectionRectangle)
  }

  const onMousemove = ({ screenCoordinates }) => {
    if (makingSelection) {
      const { x, y } = screenCoordinates
      selectionRectangle.x2 = x
      selectionRectangle.y2 = y

      section.updateSelectRectangle(selectionRectangle)
    }
  }

  const onMouseup = () => { makingSelection = false }

  let highlightPoint
  let highlightRect
  let highlightPolygon
  let highlightLine
</script>

<Graphic width={500} height={500}>

  <Section
    bind:this={section}
    padding={30}
    scaleX={scaleLinear().domain([0, 10])}
    scaleY={scaleLinear().domain([0, 10])}
    {onMousedown}
    {onMousemove}
    {onMouseup}
  >

    <Point 
      x={2} y={2} radius={7}
      fill={highlightPoint ? 'blue' : 'red'}
      onSelect={() => { highlightPoint = true }}
      onDeselect={() => { highlightPoint = false }}
    />

    <Rectangle
      x1={5} x2={8}
      y1={5} y2={9}
      fill={highlightRect ? 'blue' : 'red'}
      onSelect={() => { highlightRect = true }}
      onDeselect={() => { highlightRect = false }}
    />

    <Polygon 
      x={[3, 5, 7, 8, 6, 4]}
      y={[6, 8, 7, 3, 4, 4]}
      fill={highlightPolygon ? 'yellow' : 'orange'}
      opacity={0.7}
      onSelect={() => { highlightPolygon = true }}
      onDeselect={() => { highlightPolygon = false }}
    />

    <Line 
      x={[1, 3, 4]}
      y={[9, 8, 7]}
      stroke={highlightLine ? 'blue' : 'red'}
      onSelect={() => { highlightLine = true }}
      onDeselect={() => { highlightLine = false }}
    />

    <XAxis />
    <YAxis />
  
  </Section>

  <!-- Selection rectangle -->
  {#if selectionRectangle}

    <Rectangle {...selectionRectangle} fill="green" opacity={0.2} />

  {/if}

</Graphic>
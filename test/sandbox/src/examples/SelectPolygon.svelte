<script>
  import { scaleLinear } from 'd3-scale'
	import {
    Graphic, Section, Point, Rectangle, Line, Polygon, XAxis, YAxis, nextTick
  } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  let section
  let makingSelection = false
  let selectionPolygon

  let brushing = false
  let blockReindexing = false

  const onMousedown = ({ screenCoordinates }) => {

  }  
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

  <!-- Selection polygon -->
  {#if selectionRectangle}

    <Polygon 
      geometry={polygonGeometry} 
      fill="green" opacity={0.2}
      onMousedrag={onDragSelectionRectangle}
      {blockReindexing}
    />

  {/if}

</Graphic>
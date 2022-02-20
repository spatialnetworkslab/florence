<script>
  import { scaleLinear } from 'd3-scale'
  import { 
    Graphic, Section, PolygonLayer, Rectangle, Point,
    XAxis, YAxis,
    XGridLines, YGridLines
  } from '../../../../src'

  const viewportFence = {
    left: { x: -2, y: 0 },
    right: { x: 6, y: 0 },
    top: { x: 0, y: -2 },
    bottom: { x: 0, y: 6 }
  }
</script>

<Graphic width={500} height={500} renderer="svg">

  <Section
    x1={0.1} x2={0.9}
    y1={0.1} y2={0.9}
    padding={25}
    scaleX={scaleLinear().domain([0, 4])}
    scaleY={scaleLinear().domain([0, 4])}
    pannable
    zoomable
    zoomPanSettings={{ viewportFence }}
  >

    <Rectangle fill="blue" opacity={0.3} />

    <PolygonLayer
      x={[
        [1, 1, 1, 0, 0],
        [1, 2, 2, 1, 1],
        [2, 3, 3, 2, 2]
      ]}
      y={[
        [0, 0, 1, 1, 0],
        [1, 1, 2, 2, 1],
        [2, 2, 3, 3, 2]
      ]}
      fill={[
        'red', 'green', 'yellow'
      ]}
    />

    <Section
      x1={1} x2={3}
      y1={1} y2={3}
      scaleX={scaleLinear().domain([0, 10])}
      scaleY={scaleLinear().domain([0, 10])}
    >

      <Point x={2} y={2} radius={10} onMouseover={console.log} />
      <Point x={5} y={5} radius={10} onMouseover={console.log} />
      <Point x={8} y={8} radius={10} onMouseover={console.log} /> 
    </Section>

    <XAxis />
    <YAxis />

    <XGridLines />
    <YGridLines />
  
  </Section>

</Graphic>
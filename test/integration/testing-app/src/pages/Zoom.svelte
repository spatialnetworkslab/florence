<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, PolygonLayer, Rectangle } from '../../../../../src/'
</script>

<Graphic width={500} height={500}>

  <Section 
    scaleX={scaleLinear().domain([0, 4])}
    scaleY={scaleLinear().domain([0, 4])}
    zoomable
    pannable
  >

    <Rectangle fill="blue" opacity={0.3} />

    <PolygonLayer
      x={[
        [0, 1, 1, 0, 0],
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
  
  </Section>

</Graphic>
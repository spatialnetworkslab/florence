<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, CoordinateTransformation, Polygon, PolygonLayer, DataContainer } from '../../../../src/'

  // import data
  import hex from '../data/hexagons.json'
  
</script>

<Graphic width={500} height={500}>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([100, 110])}
    scaleY={scaleLinear().domain([-1, 1])}
  >

    <PolygonLayer 
      geometry={hex.features}
      opacity='0.5'
    />
  
  </Section>

</Graphic>
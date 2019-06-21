<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, CoordinateTransformation, Polygon, DataContainer } from '../sveg'

  function getRandomValueArray () {
    return new Array(10).fill(0).map(() => Math.random() * 10)
  }

  let x = getRandomValueArray()
  let y = getRandomValueArray()
</script>

<Graphic width={500} height={500}>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([0, 10])}
    scaleY={scaleLinear().domain([0, 10])}
  >

    <Polygon
      {x} {y}
    />
  
  </Section>

</Graphic>
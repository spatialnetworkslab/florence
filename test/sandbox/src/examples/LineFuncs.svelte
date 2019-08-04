<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Line } from '../../../../src/'
</script>

<Graphic width={500} height={500}>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([-1, 1])}
    scaleY={scaleLinear().domain([-1, 1])}
  >

    <Line 
      func={x => x ** 2}
      stroke="red"
    />
  
  </Section>

</Graphic>
<script>
  import { scaleLinear } from 'd3-scale'
  import { DataContainer, Graphic, Section, Line, LineLayer } from '../../../../'

  const data = new DataContainer({
    x: [1, 2, 4, 6, 9, 10, 12, 13],
    y: new Array(8).fill(0).map((_, i) => Math.random() * i)
  })
</script>

<Graphic width={500} height={500}>

  <!-- <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain(data.domain('x'))}
    scaleY={scaleLinear().domain(data.domain('y'))}
  > -->
  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([0, 9])}
    scaleY={scaleLinear().domain([0, 9])}
    padding={15}
  >

    <!-- <Line
      x={[0, 4.5, 9]}
      y={[0, 4.5, 9]}
      strokeWidth={10}
    /> -->

    <Line
      x={[0, 2, 9]}
      y={[0, 2, 9]}
      strokeWidth={10}
    />

    <!-- <Line
      x={data.column('x')}
      y={data.column('y')}
      strokeWidth={10}
    /> -->

    <!-- <LineLayer
      x={[data.column('x')]}
      y={[data.column('y')]}
      strokeWidth={10}
    /> -->
  
  </Section>

</Graphic>
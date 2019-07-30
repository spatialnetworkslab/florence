<script>
  import { scaleLinear } from 'd3-scale'
  import { DataContainer, Graphic, Section, Line, LineLayer } from '../../../../'

  // const data = new DataContainer({
  //   x: [1, 2, 4, 6, 9, 10, 12, 13],
  //   y: new Array(8).fill(0).map((_, i) => Math.random() * i)
  // })
  const multiLineString = {
    type: 'MultiLineString',
    coordinates: [
      [[0, 0], [2, 8], [9, 9]],
      [[1, 1], [4, 4], [1, 4], [4, 1]]
    ]
  }
</script>

<Graphic width={500} height={500}>

  <!-- <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain(data.domain('x'))}
    scaleY={scaleLinear().domain(data.domain('y'))}
    padding={10}
  > -->

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([0, 9])}
    scaleY={scaleLinear().domain([0, 9])}
    padding={10}
  >

    <!-- <Line
      x={data.column('x')}
      y={data.column('y')}
      strokeWidth={10}
      onClick={console.log}
    /> -->

    <Line
      geometry={multiLineString}
      strokeWidth={10}
      onClick={console.log}
    />

    <!-- <LineLayer
      x={[data.column('x')]}
      y={[data.column('y')]}
      strokeWidth={10}
      onClick={console.log}
    /> -->
  
  </Section>

</Graphic>
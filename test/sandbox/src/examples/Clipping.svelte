<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Point, XAxis, DiscreteLegend } from '../../../../src/'
</script>

<Graphic width={1000} height={500}>

  <Section 
    padding={50}
    scaleX={scaleLinear().domain([0, 10])}
    scaleY={scaleLinear().domain([0, 10])}
  >
    <Point x={10} y={2} radius={50} fill="red" />
    <Point x={10} y={8} radius={50} fill="blue" clip={'outer'} />

    <XAxis />

    <DiscreteLegend
      x1={9} x2={12}
      y1={3} y2={6}
      fill={['red', 'blue']}
      labels={['red', 'blue']}
    />

  </Section>

</Graphic>
<script>
  import { Graphic, Section, Point, PointLayer } from '@snlab/florence'
</script>

<Graphic width={500} height={300}>

  <Section x1={0} x2={250} scaleX={[0, 10]} scaleY={[0, 10]}>

    <Point x={2} y={2} fill={'red'} />
    <Point x={5} y={5} fill={'red'} />
    <Point x={8} y={8} fill={'red'} />

  </Section>

  <Section x1={250} x2={500} scaleX={[0, 10]} scaleY={[0, 10]}>
  
    <PointLayer x={[2, 5, 8]} y={[2, 5, 8]} fill={'red'} />

  </Section>

</Graphic>

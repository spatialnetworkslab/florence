<script>
  import { Graphic, Section, Point, PointLayer } from '@snlab/florence'
</script>

<Graphic width={500} height={300}>

  <Section x1={0} x2={250} scaleX={[0, 10]} scaleY={[0, 10]}>

    <Point x={() => 50} y={() => 50} />
    <Point x={() => 125} y={() => 125} />
    <Point x={() => 200} y={() => 200} />

  </Section>

  <Section x1={250} x2={500} scaleX={[0, 10]} scaleY={[0, 10]}>
  
    <PointLayer x={() => [50, 125, 200]} y={() => [50, 125, 200]} />

  </Section>

</Graphic>

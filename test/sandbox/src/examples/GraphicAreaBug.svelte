<script>
  import { Graphic, Section, Area, XAxis, YAxis } from '../../../../src/'
</script>

<Graphic
  width={500}
  height={500}
  padding={50}
  scaleX={[0, 10]}
  scaleY={[2, 10]}
  flipY={true}
>

  <Area 
    x1={[0, 2, 4, 5, 6, 8, 10]}
    y1={[2, 5, 7, 4, 8, 6, 7]}
    y2={[0, 0, 0, 0, 0, 0, 0]}
  />

  <XAxis />
  <YAxis />

</Graphic>

<!-- <Graphic
  width={500}
  height={500}
>
  <Section
    padding={50}
    scaleX={[0, 10]}
    scaleY={[2, 10]}
    flipY={true}
  >

    <Area 
      x1={[0, 2, 4, 5, 6, 8, 10]}
      y1={[2, 5, 7, 4, 8, 6, 7]}
      y2={[0, 0, 0, 0, 0, 0, 0]}
    />

    <XAxis />
    <YAxis />

  </Section>

</Graphic> -->

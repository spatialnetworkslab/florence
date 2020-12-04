<script>
  import { 
    Graphic, Section, Point, XAxis, YAxis, XGridLines, YGridLines, Title 
  } from '../../../../src'
</script>

<Graphic 
  width={500}
  height={500}
  flipX={false}
  flipY={true}
  padding={{ left: 50, right: 50, top: 50, bottom: 20 }}
  paddingColor="blue"
>

  <Title title="Hello!" />

  <Point x={10} y={10} />

  <XAxis />
  <YAxis />

  <XGridLines />
  <YGridLines />

</Graphic>
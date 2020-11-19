<script>
  import { Graphic, Section, Point, XAxis, YAxis, XGridLines, YGridLines } from '../../../../src'
</script>

<Graphic 
  width={500}
  height={500}
  flipX={false}
  flipY={false}
  padding={{ left: 50, right: 50, top: 50, bottom: 20 }}
  paddingColor="blue"
>

  <Point x={10} y={10} />

  <XAxis />
  <YAxis />

  <XGridLines />
  <YGridLines />

</Graphic>
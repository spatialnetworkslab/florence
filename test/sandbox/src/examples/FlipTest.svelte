<script>
  import { 
    Graphic, Section, Point, XAxis, YAxis, XGridLines, YGridLines 
  } from '../../../../src'
</script>

<Graphic 
  width={500}
  height={500}
  scaleX={[0, 500]}
  scaleY={[0, 500]}
  flipX={false}
  flipY={true}
  padding={{ left: 50, right: 50, top: 50, bottom: 20 }}
>

  <Point x={10} y={10} />

  <XAxis />
  <YAxis />

  <XGridLines />
  <YGridLines />

</Graphic>
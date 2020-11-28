<script>
  import { Graphic, Rectangle, XAxis, YAxis } from '@snlab/florence'
</script>

<Graphic width={200} height={200} scaleX={[0, 10]} scaleY={[0, 10]} padding={20}>
  
  <Rectangle fill={'blue'} />
  <Rectangle x1={4} x2={6} fill={'red'} />
  <Rectangle y1={4} y2={6} fill={'green'} />

  <XAxis />
  <YAxis />

</Graphic>
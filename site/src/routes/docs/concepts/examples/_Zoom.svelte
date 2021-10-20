<script>
  import { Graphic, Point, Label } from '@snlab/florence'
  
  const zoomIdentity = {
    x: 50,
    y: -50,
    kx: 2,
    ky: 2
  }
</script>

<Graphic
  width={200}
  height={200}
  {zoomIdentity}
  backgroundColor="#b2ffb2"
>
  <Point x={0.125} y={0.5} radius={10} />
</Graphic>
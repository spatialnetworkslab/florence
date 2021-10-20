<script>
  import { Graphic, Point } from '@snlab/florence'

  export let flip = false
</script>

<Graphic
  width={200}
  height={200}
  flipX={flip}
  flipY={flip}
  backgroundColor="#b2ffb2"
>
  <Point x={0.05} y={0.05} radius={10} />
</Graphic>
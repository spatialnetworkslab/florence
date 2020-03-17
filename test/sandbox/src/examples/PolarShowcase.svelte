<script>
  import { Graphic, Rectangle, LineLayer } from '../../../../src/'

  const linesX = new Array(4).fill(0).map((_, i) => [0, i * 125])
  const linesY = new Array(4).fill(0).map(_ => [0, 500])
  const lineStrokes = new Array(4).fill(0).map((_, i) => `rgb(${120 + 50*i},${50*i},${30*i}`)
</script>

<Graphic 
  width={500}
  height={500}
  transformation="polar"
>

  <Rectangle 
    fill="green"
    opacity={0.3}
  />

  <LineLayer x={linesX} y={linesY} stroke={lineStrokes} />

</Graphic>
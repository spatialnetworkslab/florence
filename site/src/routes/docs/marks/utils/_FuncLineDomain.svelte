<script>
  import { Graphic, FuncLine, XAxis, YAxis } from '@snlab/florence'
  const pi = Math.PI
</script>

<Graphic 
  width={200}
  height={200}
  scaleX={[-2 * pi, 2 * pi]}
  scaleY={[-1, 1]}
  padding={20
}>

  <FuncLine func={Math.sin} x={[-pi, pi]} />

  <XAxis />
  <YAxis />

</Graphic>
<script>
  import { Graphic, FuncLine, XAxis, YAxis } from '../../../../src/'
</script>

<Graphic 
  width={500}
  height={500}
  scaleX={[0, 10]}
  scaleY={[0, 10]}
  padding={20}
  flipY
>

  <FuncLine func={x => Math.exp(x / 4)} stroke={'red'} />

  <XAxis />
  <YAxis />

</Graphic>

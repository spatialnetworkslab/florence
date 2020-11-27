<script>
  import { Graphic, Label, LabelLayer, XAxis, YAxis } from '@snlab/florence'
</script>

<Graphic width={200} height={200} scaleX={[0, 10]} scaleY={[0, 10]} padding={20}>

  <Label x={2.5} y={2.5} text={'Hello'} />
  <LabelLayer x={[5, 7.5]} y={[5, 7.5]} text={['world', '!!!']} />

  <XAxis />
  <YAxis />

</Graphic>

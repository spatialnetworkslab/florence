<script>
  import { Graphic, Symbol_, SymbolLayer, XAxis, YAxis } from '@snlab/florence'
</script>

<Graphic width={200} height={200} scaleX={[0, 10]} scaleY={[0, 10]} padding={20}>

  <Symbol_ x={2.5} y={2.5} shape={'star5'} />
  <SymbolLayer x={[5, 7.5]} y={[5, 7.5]} shape={['triangle-up', 'diamond']} />
  
  <XAxis />
  <YAxis />

</Graphic>

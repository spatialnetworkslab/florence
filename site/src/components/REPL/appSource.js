export default `
<script>
  import Component from './Component1.svelte'
  import { Graphic, Point } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleLinear } from 'd3-scale'

  const dc = new DataContainer({ a: [1, 2, 3] })
  console.log(dc.column('a'))
</script>

<Component />

<Graphic 
  width={500}
  height={500}
  scaleX={scaleLinear().domain([0, 10])}
  scaleY={scaleLinear().domain([0, 10])}
>
  <Point x={5} y={5} radius={50} />
</Graphic>
`

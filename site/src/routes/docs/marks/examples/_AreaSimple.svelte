<script>
  import { Graphic, Area, AreaLayer, XAxis, YAxis } from '@snlab/florence'
  import { scaleLinear, scaleTime } from 'd3-scale'

  const x = [new Date(2002, 0, 1), new Date(2004, 0, 1), new Date(2006, 0, 1)]
  const yFirst = [20, 40, 10]
  const ySecond = [30, 45, 30]
  const yThird = [35, 60, 55]
</script>

<Graphic 
  width={200} height={200}
  scaleX={scaleTime().domain([new Date(2001, 0, 1), new Date(2007, 0, 1)])}
  scaleY={scaleLinear().domain([0, 60])}
  padding={20}
  flipY
>

  <Area x1={x} y1={[0, 0, 0]} y2={yFirst} fill={'red'} />
  <AreaLayer x1={[x, x]} y1={[yFirst, ySecond]} y2={[ySecond, yThird]} fill={['blue', 'green']} />
  
  <XAxis />
  <YAxis />

</Graphic>

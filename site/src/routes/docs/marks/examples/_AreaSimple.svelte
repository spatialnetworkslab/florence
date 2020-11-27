<script>
  import { XAxis, YAxis, Graphic, Area, Section } from '@snlab/florence'
  import { scaleLinear, scaleTime } from 'd3-scale'

  const x = [new Date(2002, 0, 1), new Date(2004, 0, 1), new Date(2006, 0, 1)]
  const y = [20, 40, 10]
</script>

<Graphic 
  width={200} height={200}
  scaleX={scaleTime().domain([new Date(2001, 0, 1), new Date(2007, 0, 1)])}
  scaleY={scaleLinear().domain([0, Math.max(...y)])}
  padding={20}
  flipY
>
  <Area
    x1={x}
    y1={[0, 0, 0]}
    y2={y}
  />
  
  <XAxis />
  <YAxis />

</Graphic>

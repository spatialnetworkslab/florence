<script>
  import { Graphic, Point, XAxis, YAxis } from '@snlab/florence'
  import { scaleLinear } from 'd3-scale'

  const scaleX = scaleLinear().domain([20000, 40000])
  const scaleY = scaleLinear().domain([5000, 6000])
</script>

<Graphic
  width={400} height={400}
  padding={40}
  backgroundColor={'gray'} 
  {scaleX} {scaleY}
>
  <Point 
    x={35000}
    y={5500}
  />
    
  <XAxis />
  <YAxis />
</Graphic>
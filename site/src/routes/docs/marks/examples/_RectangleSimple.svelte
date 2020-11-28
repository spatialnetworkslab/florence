<script>
  import { Graphic, Rectangle, RectangleLayer, XAxis, YAxis } from '@snlab/florence'
  import { scaleLinear, scaleBand } from 'd3-scale'

  const x = [2002, 2004, 2006]
  const y = [20, 40, 10]

  const scaleX = scaleBand().domain(x).padding(0.5)
  const scaleY = scaleLinear().domain([0, Math.max(...y)])
</script>

<Graphic width={200} height={200} {scaleX} {scaleY} flipY padding={20}>

  <Rectangle 
    x1={2002}
    x2={({ scaleX }) => scaleX(2006) + scaleX.bandwidth()}
    y1={0}
    y2={20}
    opacity={0.3}
  />

  <RectangleLayer
    x1={x}
    x2={({ scaleX }) => x.map(value => scaleX(value) + scaleX.bandwidth())}
    y1={0}
    y2={y}
  />
  
  <XAxis />
  <YAxis />
  
</Graphic>
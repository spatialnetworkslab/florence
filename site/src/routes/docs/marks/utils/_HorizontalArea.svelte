  <script>
    import { Graphic, Section, Area, Line, PointLayer, XAxis, YAxis } from '@snlab/florence'
  </script>

  <Graphic
    height={200} width={200}
    scaleX={[0, 200]} scaleY={[0, 200]}
    flipY padding={{ top: 10, bottom: 15, left: 15, right: 10 }}
  >
    <Area 
      x={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180]}
      y1={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
      y2={[60, 80, 70, 50, 40, 50, 40, 60, 80, 50]}
      fill={'#669900'}
    />
    <Line
      x={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180]}
      y={[60, 80, 70, 50, 40, 50, 40, 60, 80, 50]}
      strokeWidth={2}
      stroke={'#334d00'}
    />
    <Line
      x={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180]}
      y={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
      strokeWidth={2}
      stroke={'#334d00'}
    />
    <PointLayer
      x={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180]}
      y={[60, 80, 70, 50, 40, 50, 40, 60, 80, 50]}
      radius={3}
      fill={'#334d00'}
    />
    <PointLayer
      x={[0, 20, 40, 60, 80, 100, 120, 140, 160, 180]}
      y={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
      radius={3}
      fill={'#334d00'}
    />
    <XAxis title='x' ticks={false} titleYOffset={5} baseLineOpacity={0.5} />
    <YAxis title='y' ticks={false} titleXOffset={9} titleRotation={0} baseLineOpacity={0.5} />
  </Graphic>
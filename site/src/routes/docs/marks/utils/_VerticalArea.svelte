  <script>
    import { Graphic, Section, Area, Line, PointLayer, XAxis, YAxis } from '@snlab/florence'
  </script>

  <Graphic height={200} width={200} padding={{ top: 10, bottom: 15, left: 15, right: 10 }}>
    <Area 
      y={[40, 60, 80, 100, 120, 140, 160, 180, 200]}
      x1={[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
      x2={[80, 70, 50, 40, 50, 40, 60, 80, 50]}
      fill={'#669900'}
    />
    <Line
      x={[80, 70, 50, 40, 50, 40, 60, 80, 50]}
      y={[40, 60, 80, 100, 120, 140, 160, 180, 200]}
      strokeWidth={2}
      stroke={'#334d00'}
    />
    <Line
      x={[0, 0, 0, 0, 0, 0, 0, 0, 0]}
      y={[40, 60, 80, 100, 120, 140, 160, 180, 200]}
      strokeWidth={2}
      stroke={'#334d00'}
    />
    <PointLayer
      x={[80, 70, 50, 40, 50, 40, 60, 80, 50]}
      y={[40, 60, 80, 100, 120, 140, 160, 180, 200]}
      radius={3}
      fill={'#334d00'}
    />
    <PointLayer
      x={[0, 0, 0, 0, 0, 0, 0, 0, 0]}
      y={[40, 60, 80, 100, 120, 140, 160, 180, 200]}
      radius={3}
      fill={'#334d00'}
    />
    <XAxis title='x' ticks={false} titleYOffset={5} baseLineOpacity={0.5}/>
    <YAxis title='y' ticks={false} titleXOffset={9} titleRotation={0} baseLineOpacity={0.5}/>
  </Graphic>
<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Line, LineLayer } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  const data = new DataContainer({
    x: [1, 2, 4, 6, 9, 10, 12, 13],
    y: [1.5, 3.3, 2.8, 7.95, 3.39, 5.3, 6.34, 7]
  })

  const multiLineString = {
    type: 'MultiLineString',
    coordinates: [
      [[0, 0], [2, 8], [9, 9]], 
      [[1, 1], [4, 4], [1, 4], [4, 1]]
    ]
  }

  const multiLineString2 = {
    type: 'MultiLineString',
    coordinates: [
      [[0, 0], [4, 4], [8, 8]],
      [[2, 0], [6, 1], [8, 2]]
    ]
  }

  const lineStrings = {
    x: [[5.5, 6, 7], [8, 8.75, 10]],
    y: [[5, 6.5, 5], [6, 5, 6]],
  }
  let hoverKey

  let clicked = false
  let hovered = false
  $: geometry = clicked ?
    multiLineString2 :
    multiLineString

</script>

<Graphic width={500} height={500}>

  <Section
    x1={0.1}
    x2={0.9}
    y1={0.1}
    y2={0.9}
    scaleX={scaleLinear().domain(data.domain('x'))}
    scaleY={scaleLinear().domain(data.domain('y'))}
    padding={10}>

    <Line
      {geometry}
      strokeWidth={hovered ? 9 : 2}
      stroke={clicked ? 'green' : 'red'}
      onClick={() => { clicked = !clicked }} 
      onMouseover={() => { hovered = true }}
      onMouseout={() => { hovered = false }}
    />

    <LineLayer
      x={[data.column('x')]}
      y={[data.column('y')]}
      stroke={hovered ? 'green' : 'red'}
      onClick={() => { clicked = !clicked }} 
      onMouseover={() => { hovered = true }}
      onMouseout={() => { hovered = false }} 
    /> 

    <LineLayer
      x={lineStrings.x}
      y={lineStrings.y}
      keys={['a', 'b']}
      onMouseover={({ key }) => { console.log(key); hoverKey = key }}
      onMouseout={() => { hoverKey = null }}
      stroke={({ key }) => key === hoverKey ? '#3f88c5' : '#f49d37'}
      strokeWidth={3}
    />

  </Section>

</Graphic>

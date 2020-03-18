<script>
  // d3
  import { scaleLinear } from 'd3-scale'

  // florence
  import { Graphic, Section, DiscreteLegend, GradientLegend, PointLayer, YAxis, XAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  export let N = 100
  
  function generateData (N, error) {
    const getError = () => -error + (Math.random() * (2 * error)) * N
    let data = { a: [], b: [] }
    for (let i = 0; i < N; i++) {
      data.a.push(i + getError())
      data.b.push(i + getError())
    }
    return data
  }

  const data = new DataContainer(generateData(N, 0.25))
  const threshold = 0
  let filteredData = undefined

  $: {
    filteredData = data
      .filter(row => row.a > threshold)
  }

  // fill scales
  const linearColorScale = scaleLinear().domain(data.domain('a')).range(['red', 'blue'])
</script>


<Graphic width={500} height={500}
>     
  <!-- Vjust -->
  <GradientLegend
    title={'Gradient'}
    fill={linearColorScale}
    labelCount={5}
    vjust={'top'}
    hjust={'right'}
    flip
  />

  <!-- Pixels -->
  <DiscreteLegend
    title={'Discrete'}
    fill={linearColorScale}
    orient={'horizontal'}
    labelCount={5}
    vjust={'top'}
    hjust={'center'}
  /> 

  <!-- Basic example + continuous scales -->
  <Section 
    x1={0} x2={500}
    y1={0} y2={500}
    padding={80}
    scaleX={scaleLinear().domain(data.domain('a'))}
    scaleY={scaleLinear().domain(data.domain('b'))}
  >

    <PointLayer
      x={filteredData.column('a')}
      y={filteredData.column('b')}
      key={filteredData.column('$key')}
      fill={linearColorScale}
    />
    <XAxis />
    <YAxis />
  
  </Section>

</Graphic>

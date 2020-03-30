<script>
  // d3
  import { scaleLinear } from 'd3-scale'
  
  // florence
  import { Graphic, Section, PointLayer, DiscreteLegend, GradientLegend, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  export let N = 100
  
  function generateData (N, error) {
    const getError = () => -error + (Math.random() * (2 * error)) * N
    const data = { a: [], b: [] }
    for (let i = 0; i < N; i++) {
      data.a.push(i + getError())
      data.b.push(i + getError())
    }
    return data
  }
  
  const data = new DataContainer(generateData(N, 0.25))
  const threshold = 0
  let filteredData

  $: {
    filteredData = data
      .filter(row => row.a > threshold)
  }
</script>

<Graphic width={500} height={500}
>     
  <!-- Vjust -->
  <GradientLegend
    labels={[0, 15, 50, 90, 120]}
    fillOpacity={scaleLinear().domain([0, 120]).range([0, 1])}
    fill={'steelblue'}
    labelCount={5}
    title={'Gradient'}
    titlePaddingY={-7}
    vjust={'top'}
    hjust={'right'}
    flip
  />

  <!-- Pixels -->
  <DiscreteLegend
    labels={[0, 15, 50, 90, 120]}
    title={'Discrete'}
    fillOpacity={scaleLinear().domain([0, 120]).range([0, 1])}
    fill={'steelblue'}
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
      fillOpacity={scaleLinear().domain([0, 120]).range([0, 1])}
      fill={'steelblue'}
    />
    <XAxis />
    <YAxis />
  
  </Section>

</Graphic>
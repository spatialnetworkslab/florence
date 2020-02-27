<script>
  // d3
  import { scaleLinear } from 'd3-scale'
  
  // florence
  import { Graphic, Section, PointLayer, DiscreteLegend, GradientLegend } from '../../../../src/'
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

  // fill scales
  const bins = [0, 15, 50, 90, 120]
</script>

<div>
	<Graphic 
    height={400} width={400}
  >         
    <Section 
      padding={30}
      scaleX={scaleLinear().domain(data.domain('a'))}
      scaleY={scaleLinear().domain(data.domain('b'))}
    > 
      <GradientLegend
        labels={bins}
        fillOpacity= {scaleLinear().domain([0, 120]).range([0, 1])}
        fill={'firebrick'}
        title={'Bins'}
        usePadding={true}
        flip
      />

      <!-- Fill opacity + Bins -->
      <DiscreteLegend
        labels={bins}
        fillOpacity= {scaleLinear().domain([0, 120]).range([0, 1])}
        fill={'firebrick'}
        orient={'horizontal'}
        width={100}
        vjust={'top'}
        hjust={'center'}
        title={'Bins'}
        usePadding={true}
      />

      <PointLayer
        x={filteredData.column('a')}
        y={filteredData.column('b')}
        key={filteredData.column('$key')}
        fillOpacity={scaleLinear().domain([0, 120]).range([0, 1])}
        fill={'firebrick'}
      />
    </Section>

	</Graphic>

</div>
<script>
  // d3
  import { scaleLinear } from 'd3-scale'
  
  // florence
  import { Graphic, Section, PointLayer, DiscreteLegend, GradientLegend } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  export let N = 100
  const data = new DataContainer(generateData(N, 0.25))
  function generateData (N, error) {
    const getError = () => -error + (Math.random() * (2 * error)) * N
    const data = { a: [], b: [] }
    for (let i = 0; i < N; i++) {
      data.a.push(i + getError())
      data.b.push(i + getError())
    }
    return data
  }
  
  const threshold = 0
  let filteredData

  $: {
    filteredData = data
      .filter(row => row.a > threshold)
  }

  const height = 400
  const width = 400

  // fill scales
  const alphaScale = scaleLinear().domain([0, 120]).range([0, 1])
  const bins = [0, 15, 50, 90, 120]
</script>

<div>
	<Graphic 
    {width} {height}
  >         
    <Section 
      x1={0} x2={400}
      y1={0} y2={400}
      padding={30}
      scaleX={scaleLinear().domain(data.domain('a'))}
      scaleY={scaleLinear().domain(data.domain('b'))}
    > 
      <GradientLegend
        labels={bins}
        fillOpacity= {alphaScale}
        fill={'goldenrod'}
        title={'Bins'}
        usePadding={true}
      />

      <!-- Fill opacity + Bins -->
      <DiscreteLegend
        labels={bins}
        fillOpacity= {alphaScale}
        fill={'goldenrod'}
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
        fillOpacity={alphaScale}
        fill={'goldenrod'}
      />
    </Section>

	</Graphic>

</div>
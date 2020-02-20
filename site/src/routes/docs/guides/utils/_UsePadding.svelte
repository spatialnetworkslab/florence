<script>
  // d3
  import { scaleLinear } from 'd3-scale'

  // florence
  import { Graphic, Section, PointLayer, DiscreteLegend, GradientLegend, YAxis, XAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  export let N = 100
  const data = new DataContainer(generateData(N, 0.25))
  function generateData (N, error) {
    const getError = () => -error + (Math.random() * (2 * error)) * N
    let data = { a: [], b: [] }
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
  const x = 0
  const y = 0
  const k = 1
  const zoomIdentity = { x, y, kx: k, ky: k }

  // fill scales
  const linearColorScale = scaleLinear().domain(data.domain('a')).range(['red', 'blue'])
</script>

<div>
	<Graphic 
    {width} {height}
  >         

    <!-- Basic example + continuous scales -->
    <Section 
      x1={0} x2={400}
      y1={0} y2={400}
      padding={30}
      scaleX={scaleLinear().domain(data.domain('a'))}
      scaleY={scaleLinear().domain(data.domain('b'))}
      {zoomIdentity}
    >
      <!-- NOTE: usePadding won't work on the first two legend examples here
      because they are being given specific values -->

      <!-- Vjust -->
      <DiscreteLegend
        fill={linearColorScale}
        labelCount={5}
        flip
        usePadding={true}
      />

      <!-- Pixels -->
      <GradientLegend
        x1={() => { return 200 }} x2={() => { return 300 }}
        y1={() => { return 60 }} y2={() => { return 100 }}
        fill={linearColorScale}
        orient={'horizontal'}
        labelCount={5}
        titleX={() => { return 170 }}
        titleY={() => { return 70 }}
        usePadding={true}
      />
      
      <PointLayer
          x={filteredData.column('a')}
          y={filteredData.column('b')}
          key={filteredData.column('$key')}
          fill={linearColorScale}
        />

      <XAxis zoomIdentity={{ y: 0, ky: 1 }} />
      <YAxis zoomIdentity={{ x: 0, kx: 1 }} />
    
    </Section>

	</Graphic>

</div>
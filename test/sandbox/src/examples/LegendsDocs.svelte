<script>
  // d3
  import { scaleLinear } from 'd3-scale'

  // florence
  import { Graphic, Section, PointLayer, DiscreteLegend, GradientLegend, YAxis, XAxis } from '../../../../src'
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
  const sectionPadding = 75
  const graphicPadding = 50
  const background = '#a8a8a8'
  const padding = '#E8E8E8'
</script>

<div>
  <Graphic width={500} height={500}
    padding={graphicPadding}
  >     

    <!-- Basic example + continuous scales -->
    <Section 
      x1={0} x2={500}
      y1={0} y2={500}
      padding={sectionPadding}
      scaleX={scaleLinear().domain(data.domain('a'))}
      scaleY={scaleLinear().domain(data.domain('b'))}
      backgroundColor={background}
      paddingColor={padding} 
      {zoomIdentity}
    >

      <!-- Vjust -->
      <GradientLegend
        fill={linearColorScale}
        labelCount={5}
        flip
        usePadding={false}
      />

      <!-- Pixels -->
      <DiscreteLegend
        x1={() => { return 200 }} x2={() => { return 300 }}
        y1={() => { return 60 }} y2={() => { return 100 }}
        fill={linearColorScale}
        orient={'horizontal'}
        labelCount={5}
        titleX={() => { return 170 }}
        titleY={() => { return 70 }}
        usePadding={true}
      />
      
      <XAxis zoomIdentity={{ y: 0, ky: 1 }} />
      <YAxis zoomIdentity={{ x: 0, kx: 1 }} />
    
    </Section>

	</Graphic>

</div>
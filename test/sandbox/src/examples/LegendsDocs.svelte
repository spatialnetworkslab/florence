<script>
  // d3
  import { scaleLinear } from 'd3-scale'
  // florence
  import { Graphic, Section, DiscreteLegend, Point, GradientLegend, YAxis, XAxis } from '../../../../src/'
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
  const sectionPadding = 75
  const graphicPadding = 50
  const background = '#a8a8a8'
  const padding = '#E8E8E8'
</script>

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
    flipY
  >
    <Point
      x={()=> 0}
      y={()=> 0}
    />
    <!-- usePadding = false -->
    <GradientLegend
      title={'Test'}
      fill={linearColorScale}
      labelCount={5}
      hjust={'right'}
      vjust={'bottom'}
      usePadding={false}
    />

    <GradientLegend
      title={'Gradient'}
      fill={linearColorScale}
      labelCount={5}
      hjust={'right'}
      vjust={'top'}
      usePadding={false}
    />

    <GradientLegend
      title={'Gradient'}
      fill={linearColorScale}
      labelCount={5}
      hjust={'right'}
      vjust={'center'}
      usePadding={false}
    />

    <!-- usePadding = true -->
    <!-- <DiscreteLegend
      title={'Discrete'}
      hjust={'right'}
      vjust={'bottom'}
      fill={linearColorScale}
      labelCount={5}
      usePadding={true}
    /> -->
    
    <XAxis />
    <YAxis />
  
  </Section>

</Graphic>
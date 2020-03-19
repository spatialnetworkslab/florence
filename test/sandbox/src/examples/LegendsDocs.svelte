<script>
  // d3
  import { scaleLinear } from 'd3-scale'
  // florence
<<<<<<< HEAD
  import { Graphic, Section, DiscreteLegend, GradientLegend, YAxis, XAxis } from '../../../../src/'
=======
  import { Graphic, Section, DiscreteLegend, Point, GradientLegend, YAxis, XAxis } from '../../../../src/'
>>>>>>> bc661994189a14d1fcfd67c0ca84f54a141710ee
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
<<<<<<< HEAD
  >

    <!-- usePadding = false -->
    <GradientLegend
      title={'Gradient'}
      fill={linearColorScale}
      labelCount={5}
      hjust={'right'}
      flip
    />

    <!-- usePadding = true -->
    <DiscreteLegend
      title={'Discrete'}
      vjust={'top'}
      hjust={'center'}
      orient={'horizontal'}
      fill={linearColorScale}
      labelCount={5}
      usePadding={true}
    />
=======
    flipX
  >
    <!-- usePadding = false -->
    <DiscreteLegend
      title={'Test'}
      fill={linearColorScale}
      labelCount={5}
      hjust={'right'}
      vjust={'top'}
      orient={'vertical'}
      usePadding={false}
      flip
    />

    <GradientLegend
      title={'Test 2'}
      fill={linearColorScale}
      labelCount={5}
      hjust={'right'}
      vjust={'bottom'}
      orient={'vertical'}
      usePadding={false}
      flip
      flipLabels
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
>>>>>>> bc661994189a14d1fcfd67c0ca84f54a141710ee
    
    <XAxis />
    <YAxis />
  
  </Section>

</Graphic>
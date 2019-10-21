<script>
  // d3
  import { scaleDiverging, scaleSequential, scaleLinear, scalePow, scaleQuantise, scaleOrdinal, scaleSqrt, scaleLog } from 'd3-scale'
  import * as d3 from 'd3-scale-chromatic'
  import { schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3, interpolateHcl, rgb } from 'd3-scale-chromatic'

  // florence
	import { Graphic, Grid, Section, PointLayer, Point, Label, LabelLayer, DiscreteLegend, GradientLegend, YAxis, XAxis } from '../../../../src/'
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
  
  let threshold = 0
  let filteredData

  $: {
    filteredData = data
    .filter(row => row.a > threshold)
  }

	const scaleA = scaleLinear().domain(data.domain('a'))
  const scaleB = scaleLinear().domain(data.domain('b'))
  
  let height = 500
  let transformation = 'identity'
  let duration = 2000

  const log = console.log

  let background = "pink"
  let big = false
  let hoverPoints = {}

  let x = 0
  let y = 0
  let k = 1
  let zoomIdentity = { x, y, kx: k, ky: k }
  
  // scatterplot scale
  const radiusScale = scaleLinear().domain(data.domain('b')).range([10, 0])

  // data
  const bins = [[0, 30], [30, 70], [70, 100], [100, 155], [55, 300]]
  const bins2 = [[0, 10], [10, 40], [40, 200]]
  const fruits = ['apple', 'banana', 'orange', 'pomelo']

  // fill scales
  const linearColorScale = scaleLinear().domain(data.domain('a')).range(["red", "blue"])
  const linearColorScaleBin = scaleLinear().domain(bins).range(["red", "blue"])
  const seqScale = scaleSequential().domain(data.domain('a')).interpolator(d3.interpolateViridis);
  const fruitScale = scaleOrdinal().domain(fruits).range(schemeDark2)
  const binScale = scaleLinear().domain([0, 4]).range(['red', 'blue'])

  // fill opacity scales
  const alphaScale = scaleLinear().domain(data.domain('a')).range([0, 1])
  const fruitAlpha = scaleOrdinal().domain(fruits).range([0,1, 0.4, 0.2])
  const binAlpha = scaleLinear().domain([0,2]).range([0, 0.9])
</script>

<div>

	<Graphic 
    width={700} {height}
    scaleX={scaleLinear().domain([0, 600])}
    scaleY={scaleLinear().domain([0, 1000])}
  >       
    <DiscreteLegend
      scale = {data.domain('a')}
      x1={270} x2={510}
      y1={50} y2={200}
      fill={linearColorScale}
      labelCount={8}
      orient={'horizontal'}
      firstLabel={10}
      labelExtra
    />

    <GradientLegend
      scale = {data.domain('a')}
      x1={100} x2={180}
      y1={50} y2={400}
      fill={linearColorScale}
      labelCount={8}
      orient={'vertical'}
      firstLabel={10}
      labelExtra
      titleVjust={'bottom'}
    />


    <DiscreteLegend
      scale = {data.domain('a')}
      fill={seqScale}
      orient={'horizontal'}
      hjust={'right'}
      vjust={'bottom'}
      height={120}
    />

    <GradientLegend
      scale = {data.domain('a')}
      x1={450} x2={600}
      y1={350} y2={500}
      fill={'purple'}
      fillOpacity={alphaScale}
      orient={'horizontal'}
      labelCount={5}
      title={'Longer title than usual test'}
      titleVjust={'center'}
      titleHjust={'left'}
      titleAnchorPoint={'r'}
      titlePaddingX={-20}
    />

    <DiscreteLegend
      scale = {fruits}
      fillOpacity={0.8}
      fill={fruitScale}
      orient={'horizontal'}
      hjust={'center'}
      vjust={'center'}
      titlePaddingY={-15}
    />
    
    <DiscreteLegend
      scale = {bins2}
      fillOpacity= {binAlpha}
      fill={'green'}
      labelCount={8}
      firstLabel={10}
      title={'Title'}
      vjust={'bottom'}
      hjust={'left'}
      orient={'vertical'}
      flipLabels
    />

    <GradientLegend
      scale = {bins2}
      fillOpacity= {binAlpha}
      fill={'green'}
      labelCount={8}
      firstLabel={10}
      title={'Title'}
      vjust={'bottom'}
      hjust={'center'}
      orient={'horizontal'}
      height={120}
      flip
    />

	</Graphic>

</div>
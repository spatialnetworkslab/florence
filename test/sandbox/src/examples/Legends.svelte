<script>
  // d3
  import { scaleThreshold, scaleDiverging, scaleSequential, scaleLinear, scalePow, scaleQuantise, scaleOrdinal, scaleSqrt, scaleLog } from 'd3-scale'
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

  // let pad1 = 30
  // let usePadding = true

  let x = 0
  let y = 0
  let k = 1
  let zoomIdentity = { x, y, kx: k, ky: k }

  // scatterplot scale
  const radiusScale = scaleLinear().domain(data.domain('b')).range([10, 0])

  // data
  const bins = [[0, 30], [30, 70], [70, 100], [100, 155], [55, 300]]
  const bins2 = [0, 10, 20, 40, 90, 120]
  const fruits = ['apple', 'banana', 'orange', 'pomelo']

  // fill scales
  const linearColorScale = scaleLinear().domain(data.domain('a')).range(["red", "blue"])
  const linearColorScaleBin = scaleLinear().domain(bins).range(["red", "blue"])
  const seqScale = scaleSequential().domain(data.domain('a')).interpolator(d3.interpolateSinebow);
  const fruitScale = scaleOrdinal().domain(fruits).range(schemeDark2)
  const binScale = scaleLinear().domain([0, 4]).range(['red', 'blue'])

  // fill opacity scales
  const alphaScale = scaleLinear().domain(data.domain('a')).range([0, 1])
  const fruitAlpha = scaleOrdinal().domain(fruits).range([0,1, 0.4, 0.2])
  const binAlpha = scaleLinear().domain([0, 120]).range([0, 1])

  // Padding slider
</script>

<!-- <div>
  <label for="height-slider">Padding: </label>
  <input type="range" min="0" max="150" bind:value={pad1} name="height-slider" /> {pad1}
  <input type="radio" value="true" bind:value={usePadding} name="height-slider" /> True
  <input type="radio" value="false" bind:value={usePadding} name="height-slider" /> False
</div> -->

<div>
	<Graphic 
    width={700} {height}
    scaleX={scaleLinear().domain([0, 600])}
    scaleY={scaleLinear().domain([0, 1000])}
  >       

    <Section 
      x1={50} x2={300}
      y1={50} y2={700}
      padding={30}
      scaleX={scaleLinear().domain(data.domain('a'))}
      scaleY={scaleLinear().domain(data.domain('b'))}
      {zoomIdentity}
    >

      <GradientLegend
        fill={linearColorScale}
        orient={'horizontal'}
        titleVjust={'top'}
        labelCount={4}
        vjust={'top'}
        hjust={'right'}
        usePadding={true}
      />
    
      <GradientLegend
        labels={bins2}
        fillOpacity= {binAlpha}
        fill={'green'}
        orient={'vertical'}
        labelCount={6}
        vjust={'center'}
        hjust={'right'}
        title={'Test title 12345'}
        titleVjust={'center'}
        titleHjust={'left'}
        titleRotation={-90}
        titlePaddingX={-15}
        usePadding={false}
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

    <Section 
      x1={350} x2={600}
      y1={50} y2={700}
      padding={40}
      scaleX={scaleLinear().domain(data.domain('a'))}
      scaleY={scaleLinear().domain(data.domain('b'))}
      {zoomIdentity}
    >
      <DiscreteLegend
        labels={[0, 15, 50, 90, 120]}
        fillOpacity= {scaleLinear().domain([0, 120]).range([0, 1])}
        fill={'green'}
        orient={'horizontal'}
        width={100}
        vjust={'top'}
        hjust={'center'}
        title={'Test title 12345'}
        usePadding={true}
      />

      <DiscreteLegend
        fill={seqScale}
        strokeWidth={2}
        labelCount={5}
        stroke={'white'}
        orient={'vertical'}
        labelAnchorPoint={'r'}
        labelExtra
        titleVjust={'top'}
        titleHjust={'left'}
        vjust={'top'}
        hjust={'right'}
        usePadding={true}
      />

      <DiscreteLegend
        fill={fruitScale}
        strokeWidth={2}
        stroke={'white'}
        orient={'vertical'}
        labelAnchorPoint={'r'}
        labelExtra
        vjust={'centre'}
        hjust={'right'}
        usePadding={false}
      />

      <PointLayer
          x={filteredData.column('a')}
          y={filteredData.column('b')}
          key={filteredData.column('$key')}
          fill={seqScale}
        />

      <XAxis zoomIdentity={{ y: 0, ky: 1 }} />
      <YAxis zoomIdentity={{ x: 0, kx: 1 }} />
    
    </Section>

	</Graphic>

</div>
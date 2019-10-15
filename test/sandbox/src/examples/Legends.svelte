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

  $: hoverPointKeys = Object.keys(hoverPoints)
  function handleMouseout (ix) {
    delete hoverPoints[ix]
    hoverPoints = hoverPoints
  }

  const xLoc = (data.domain('a')[0]+data.domain('a')[1])/2
  const yLoc = data.domain('b')[1]

  // scatterplot scale
  const radiusScale = scaleLinear().domain(data.domain('b')).range([10, 0])

  // data
  const bins = [[0, 30], [30, 70], [70, 100], [100, 155], [55, 300]]
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
  const binAlpha = scaleLinear().domain([0,4]).range([0, 1])
  
  
  
</script>

<div>

	<Graphic 
    width={700} {height}
    scaleX={scaleLinear().domain([0, 600])}
    scaleY={scaleLinear().domain([0, 1000])}
  >       
    <!-- 
      horizontal
      x1={0} x2={240}
      y1={50} y2={200}

      Vertical
      x1={150} x2={220}
      y1={50} y2={400} -->
    <!-- <GradientLegend
      scale = {data.domain('a')}
      x1={0} x2={240}
      y1={50} y2={200}
      fill={linearColorScale}
      labelCount={8}
      orient={'horizontal'}
      labelExtra
    /> -->
    <!--
      Horizontal
      x1=270 x2={510}
      y1={50} y2={200}

      Vertical
      x1={270} x2={340}
      y1={50} y2={400}-->
    <!-- <DiscreteLegend
      scale = {data.domain('a')}
      x1=270 x2={510}
      y1={50} y2={200}
      fill={linearColorScale}
      labelCount={8}
      orient={'horizontal'}
      firstLabel={10}
      labelExtra
    /> -->

    <!-- <DiscreteLegend
      scale = {bins}
      x1={0} x2={240}
      y1={50} y2={200}
      fillOpacity={binAlpha}
      fill={'red'}
      orient={'horizontal'}
      flip
      flipLabels
    />

    <GradientLegend
      scale = {bins}
      x1=270 x2={510}
      y1={50} y2={200}
      fillOpacity={binAlpha}
      fill={'red'}
      orient={'horizontal'}
      flip
      flipLabels
    /> -->

    <!-- <GradientLegend
      scale = {data.domain('a')}
      x1={0} x2={240}
      y1={50} y2={200}
      fill={'green'}
      fillOpacity={alphaScale}
      colorBarWidth={0.5}
      orient={'horizontal'}
    /> -->

    <!-- <DiscreteLegend
      scale = {scalePow().domain(data.domain('b'))}
      x1={250} x2={490}
      y1={50} y2={200}
      fillOpacity={scaleLinear().domain(data.domain('b')).range([0, 1])}
      fill={'green'}
      orient={'horizontal'}
    /> -->
    
    <GradientLegend
      scale = {bins}
      fillOpacity= {binAlpha}
      fill={'green'}
      labelCount={8}
      firstLabel={10}
      title={'Title'}
      vjust={'top'}
      hjust={'right'}
      orient={'horizontal'}
    />
          <!-- vjust={'center'}
      hjust={'right'}
      titleHjust={'right'}
      orient={'horizontal'} -->
    <!-- <DiscreteLegend
          x1={50} 
          x2={300}
          y1={50} 
          y2={150}
          scale = {data.domain('a')}
          fill={linearColorScale}
          labelCount={8}
          firstLabel={10}
        /> -->

    <Section 
      x1={50} x2={450}
			y1={200} y2={800}
			scaleX={scaleA}
			scaleY={scaleB}
      {zoomIdentity}
      padding={50}
    > 


      <PointLayer
        x={filteredData.column('a')}
        y={filteredData.column('b')}
        fill={data.map('a', linearColorScale)}
        fillOpacity={data.map('a', linearColorScale)}
        radius={data.map('a', radiusScale)}
        index={filteredData.column('$key')}
        onMouseover={ix => hoverPoints[ix] = filteredData.row(ix)}
        onMouseout={handleMouseout}
        transition={duration}
      />

      <XAxis title={'Test'} zoomIdentity={{ y: 0, ky: 1 }} vjust={0} />
      <YAxis zoomIdentity={{ x: 0, kx: 1 }} />
    
    </Section>

	</Graphic>

</div>
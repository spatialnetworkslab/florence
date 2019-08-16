<script>
  // d3
  import { scaleDiverging, scaleSequential, scaleLinear, scalePow, scaleQuantise, scaleOrdinal, scaleSqrt, scaleLog } from 'd3-scale'
  import * as d3 from 'd3-scale-chromatic'
  import { schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3, interpolateHcl, rgb } from 'd3-scale-chromatic'

  // florence
	import { Graphic, Grid, Section, PointLayer, Point, Label } from '../../../../src/'
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
  
  let treshold = 0
  $: filteredData = data
    .filter(row => row.a > treshold)
    .done()

	const scaleA = scaleLinear().domain(data.domain('a'))
  const scaleB = scaleLinear().domain(data.domain('b'))
  
  let height = 500
  let transformation = 'identity'
  let duration = 2000

  const log = console.log

  let background = "pink"
  let big = false
  let hoverPoints = {}

  $: hoverPointKeys = Object.keys(hoverPoints)
  function handleMouseout (ix) {
    delete hoverPoints[ix]
    hoverPoints = hoverPoints
  }

  const xLoc = (data.domain('a')[0]+data.domain('a')[1])/2
  const yLoc = data.domain('b')[1]

  // open question: how do we evalute fill functions against the domains for marks? x or y?
  // takes crae of tickmarks, color scale spec
  // maybe convenience function would be helpful
  console.log(d3)
  const linearColorScale = scaleLinear().domain(data.domain('a')).range(["red", "blue"])
  const seqScale = scaleSequential().domain(data.domain('a')).interpolator(d3.interpolateViridis);
  const alphaScale = scaleLinear().domain(data.domain('b')).range([0, 1])
  const radiusScale = scaleLinear().domain(data.domain('b')).range([10, 0])
   
  // check if opacity works
  
</script>

<div>

	<Graphic 
    width={700} {height}
    scaleX={scaleLinear().domain([0, 600])}
    scaleY={scaleLinear().domain([0, 1000])}
  > 
    <Label 
        x={xLoc}
        y={100}
        text={'Legends'}
        fontFamily="Helvetica"
        fontSize="16"
        fontWeight="bold"
        rotation={0}
    />
		
		<Section
			x1={50} x2={450}
			y1={50} y2={350}
			scaleX={scaleA}
			scaleY={scaleB}
      flipY
      {transformation}
		>
      >
			<PointLayer
        x={filteredData.column('a')}
        y={filteredData.column('b')}
        fill={data.map('a', linearColorScale)}
        fillOpacity={data.map('a', linearColorScale)}
        radius={data.map('a', radiusScale)}
        index={filteredData.column('$index')}
        onMouseover={ix => hoverPoints[ix] = filteredData.row(ix)}
        onMouseout={handleMouseout}
        transition={duration}
      />
		
		</Section>

    <Section
			x1={50} x2={450}
			y1={350} y2={650}
			scaleX={scaleA}
			scaleY={scaleB}
      flipY
      {transformation}
		>

			<PointLayer
        x={filteredData.column('a')}
        y={filteredData.column('b')}
        fill={data.map('b', seqScale)}
        radius={transformation === 'identity' ? 3 : 6}
        index={filteredData.column('$index')}
        onMouseover={ix => hoverPoints[ix] = filteredData.row(ix)}
        onMouseout={handleMouseout}
        transition={duration}
      />
		
		</Section>

    <Section
			x1={50} x2={450}
			y1={650} y2={950}
			scaleX={scaleA}
			scaleY={scaleB}
      flipY
      {transformation}
		>

			<PointLayer
        x={filteredData.column('a')}
        y={filteredData.column('b')}
        fill={'red'}
        radius={transformation === 'identity' ? 3 : 6}
        fillOpacity={data.map('a', alphaScale)}
        index={filteredData.column('$index')}
        onMouseover={ix => hoverPoints[ix] = filteredData.row(ix)}
        onMouseout={handleMouseout}
        transition={duration}
      />
		
		</Section>

	</Graphic>

</div>
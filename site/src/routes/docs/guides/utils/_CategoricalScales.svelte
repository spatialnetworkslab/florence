<script>
  // d3
  import { scaleBand, scaleThreshold, scaleDiverging, scaleSequential, scaleLinear, scalePow, scaleOrdinal, scaleSqrt, scaleLog } from 'd3-scale'
  import * as d3 from 'd3-scale-chromatic'
  import { schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3, interpolateHcl, rgb } from 'd3-scale-chromatic'

  // florence
	import { Rectangle, Graphic, Grid, Section, PointLayer, Point, Label, LabelLayer, DiscreteLegend, GradientLegend, YAxis, XAxis } from '@snlab/florence'
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
  
  let height = 400
  let width = 400
  let transformation = 'identity'
  let duration = 2000

  const log = console.log

  let x = 0
  let y = 0
  let k = 1
  let zoomIdentity = { x, y, kx: k, ky: k }

  // scatterplot scale
  const radiusScale = scaleLinear().domain(data.domain('b')).range([10, 0])

  // scalar data
  const bins = [[0, 30], [30, 70], [70, 100], [100, 155], [55, 300]]
  const bins2 = [0, 10, 20, 40, 90, 120]
  const fruits = ['apple', 'banana', 'orange', 'pomelo']

  // fill scales
  const linearColorScale = scaleLinear().domain(data.domain('a')).range(["red", "blue"])
  const linearColorScaleBin = scaleLinear().domain(bins).range(["red", "blue"])
  const seqScale = scaleSequential().domain(data.domain('a')).interpolator(d3.interpolateSinebow)
  const linearColorScale2 =  scaleSequential().domain([0, 120]).interpolator(d3.interpolateViridis)
  const fruitScale = scaleOrdinal().domain(fruits).range(schemeDark2)
  const binScale = scaleLinear().domain([0, 4]).range(['red', 'blue'])

  // fill opacity scales
  const alphaScale = scaleLinear().domain(data.domain('a')).range([0, 1])
  const fruitAlpha = scaleOrdinal().domain(fruits).range([0,1, 0.4, 0.2])
  const binAlpha = scaleLinear().domain([0, 120]).range([0, 1])

 // categorical data
   let catData = new DataContainer({
    fruit: ['apple', 'banana', 'apple', 'banana', 'apple', 'banana'],
    nutrient: ['carbs', 'carbs', 'fibre', 'fibre', 'protein', 'protein'],
    value: [3, 5, 1, 3, 4, 2]
  })

  const fruitDomain = catData.domain('fruit')
  const nutrientDomain = catData.domain('nutrient')

  catData = catData
    .groupBy('fruit')
    .mutarise({ totalValuePerFruit: { value: 'sum' } })
    .mutate({ valueFraction: row => row.value / row.totalValuePerFruit })
    .select(['fruit', 'nutrient', 'valueFraction'])
    .groupBy('fruit')


  const containerPerFruit = catData.column('$grouped').map(container => {
    return container.cumsum({ cumsum_value: 'valueFraction' })
  })

  const nutrientColorScale = scaleOrdinal()
    .domain(nutrientDomain)
    .range(schemeAccent)

</script>

<div>
	<Graphic 
    {width} {height}
  >         

    <!-- Categorical -->
    <Section 
      x1={0} x2={width}
      y1={0} y2={height}
      padding={40}
      scaleX={scaleBand().domain(fruitDomain).padding(0.3)}
      scaleY={scaleLinear().domain([0, 1])}
    > 
      <DiscreteLegend
        fill={nutrientColorScale}
        strokeWidth={2}
        stroke={'white'}
        orient={'vertical'}
        vjust={'centre'}
        hjust={'left'}
        flipLabels
        labelPaddingX={10}
        usePadding={true}
      />

      {#each containerPerFruit as container}
        {#each container.rows() as row, i}
          <Rectangle 
            x1={row.fruit}
            x2={({ scaleX }) => scaleX(row.fruit) + scaleX.bandwidth()}
            y1={i === 0 ? 0 : container.prevRow(row.$key).cumsum_value}
            y2={row.cumsum_value}
            fill={nutrientColorScale(row.nutrient)}
          />
        {/each}
      {/each}

      <XAxis labelFontSize={13} />
    
    </Section>

	</Graphic>

</div>
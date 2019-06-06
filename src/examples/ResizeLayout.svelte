<script>
	import { scaleLinear, scaleBand } from 'd3-scale'
	import { Graphic, Section, Point, Rectangle, DataContainer, Grid } from '../sveg'

	function generateData (N) {
  	let newData = { a: [], b: [], fruit: [] }
  	let allFruit = ['red', 'blue', 'green']

  	for (let i = 0; i < N; i++) {
  		let cat = Math.floor(Math.random() * 3)

  		newData.fruit.push(allFruit[cat])
  		newData.a.push(Math.floor(Math.random() * 50) + 25)
  		newData.b.push(Math.floor(Math.random() * 50))
  	}

  	return newData
  }

  let data = new DataContainer(generateData(50))

  const scaleFruit = scaleBand().domain(data.domain('fruit'))
  const scaleA = scaleLinear().domain(data.domain('a'))
  const scaleB = scaleLinear().domain(data.domain('b'))

  const groupedData = data.groupBy('fruit').done()

  let height = 450

  let cols = 3
  let rows

  let layout

  $: if (height > 300) {
  	rows = 3
  	layout = ['blue', undefined, undefined,
								undefined, 'red', undefined,
								undefined, undefined, 'green']
  } else if (height < 300 && height > 150) {
  	rows = 2
  	layout = ['blue', undefined, undefined,
								undefined, 'red', 'green']
  } else {
  	rows = 1
  	layout = ['blue', 'red', 'green']
  }
</script>

<div>
  <label for="height-slider">Height:</label>
  <input type="range" min="0" max="450" bind:value={height} name="height-slider" />
</div>

<div style="padding-top: 50px">

	<Graphic 
		width={450} {height}
		scaleX={scaleLinear().domain([0, 450])}
    scaleY={scaleLinear().domain([0, 450])}
	>

		<Grid
			x1={0} x2={450}
			y1={0} y2={450}
			gridTemplateColumns={cols}
			gridTemplateRows={rows}
			gridTemplateAreas={layout}
			let:generatedCells
		>

			{#each groupedData.rows() as facet}

				<Rectangle {...generatedCells[facet.fruit]} />

			{/each}
		
		</Grid>

	</Graphic>

</div>
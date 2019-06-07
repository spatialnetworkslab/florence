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
  const groupedData = data.groupBy('fruit').done()

  // Grid layout specs
  let height = 420

  let cols = '50px 2fr 1fr'
  let rows

  let layout

  // Change grid layout on resize
  // Modify this for fun :)
  $: if (height > 280) {

  	rows = 3
  	layout = ['blue',     'blue', undefined,
							 undefined, 'red',  undefined,
							 undefined, 'red',  'green']

  } else if (height <= 280 && height > 140) {

  	rows = 2
  	layout = ['blue',     'blue', undefined,
							 undefined, 'red',  'green']

  } else {

  	rows = 1
  	layout = ['blue', 'red', 'green']
  	
  }

  // Input validation for grids is so robust
  // you could technically do the following
  // but passing floats is not encouraged:
  // $: rows = height/140
</script>

<div>
  <label for="height-slider">Height:</label>
  <input type="range" min="0" max="420" bind:value={height} name="height-slider" />
</div>

<div style="padding-top: 50px">

	<Graphic 
		width={420} {height}
		scaleX={scaleLinear().domain([0, 420])}
    scaleY={scaleLinear().domain([0, height])}
	>

		<Grid
			x1={0} x2={420}
			y1={0} y2={height}
			gridTemplateColumns={cols}
			gridTemplateRows={rows}
			gridTemplateAreas={layout}
			let:generatedCells
		>

      <!-- No actual data is used here, only the groups.
           This can be changed later. -->
			{#each groupedData.rows() as facet}

				<Rectangle
					{...generatedCells[facet.fruit]}
					fill={facet.fruit} />

			{/each}
		
		</Grid>

	</Graphic>

</div>
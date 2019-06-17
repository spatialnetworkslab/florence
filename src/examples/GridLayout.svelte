<script>
	import { scaleLinear, scaleBand } from 'd3-scale'
	import { Graphic, Section, Point, DataContainer, Grid } from '../sveg'

	let cols = 2

	function generateData (N) {
  	let newData = { a: [], b: [], fruit: [] }
  	let allFruit = ['red', 'blue', 'green', 'orange']

  	for (let i = 0; i < N; i++) {
  		let cat = Math.floor(Math.random() * 4)

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

  $: rows = Math.ceil(4/cols)
</script>

<div>
  <label for="cols-slider">Columns:</label>
  <input type="range" min="1" max="4" bind:value={cols} name="cols-slider" />
</div>

<div>

	<Graphic 
		width={500} height={500}
	>

		<Grid
			x1={50} x2={450}
			y1={50} y2={450}
			columns={cols}
			rows={rows}
			areaNames={['blue', 'orange', 'red', 'green']}
			let:generatedCells
		>

			{#each groupedData.rows() as facet}

				<Section
					{...generatedCells[facet.fruit]}
					scaleX={scaleA}
					scaleY={scaleB}
				>

					{#each facet.$grouped.rows() as row}

						<Point 
							x={row.a}
							y={row.b} 
							fill={row.fruit}
						/>

					{/each}
		
				</Section>

			{/each}
		
		</Grid>

	</Graphic>

</div>
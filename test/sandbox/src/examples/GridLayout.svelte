<script>
	import { scaleLinear, scaleBand } from 'd3-scale'
	import { Graphic, Section, Point, Rectangle, Grid } from '../../../../src/'
	import DataContainer from '@snlab/florence-datacontainer'

	function generateData (N) {
  	let newData = { a: [], b: [], color: [] }
  	let allColors = ['red', 'blue', 'green', 'orange']

  	for (let i = 0; i < N; i++) {
  		let cat = Math.floor(Math.random() * 4)

  		newData.color.push(allColors[cat])
  		newData.a.push(Math.floor(Math.random() * 50) + 25)
  		newData.b.push(Math.floor(Math.random() * 50))
  	}

  	return newData
  }

  let data = new DataContainer(generateData(50))

  const scaleA = scaleLinear().domain(data.domain('a'))
  const scaleB = scaleLinear().domain(data.domain('b'))

  const groupedData = data.groupBy('color')
</script>

<!-- <div>
  <label for="cols-slider">Columns:</label>
  <input type="range" min="1" max="4" bind:value={cols} name="cols-slider" />
</div> -->

<div>

	<Graphic
		width={500} height={500}
	>

		<Grid
			x1={0.1} x2={0.9}
			y1={0.1} y2={0.9}
			names={groupedData.domain('color')}
			let:cells
		>

			{#each groupedData.rows() as facet (facet.$key)}

				<Section
					{...cells[facet.color]}
					scaleX={scaleA}
					scaleY={scaleB}
				>

          <Rectangle fill={facet.color} opacity={0.4} />

					{#each facet.$grouped.rows() as row (row.$key)}

						<Point 
							x={row.a}
							y={row.b} 
							fill={row.color}
						/>

					{/each}
		
				</Section>

			{/each}
		
		</Grid>

	</Graphic>

</div>

<!-- <script>
	import { scaleLinear, scaleBand } from 'd3-scale'
	import { Graphic, Section, Point, Rectangle, Grid } from '../../../../src/'
	import DataContainer from '@snlab/florence-datacontainer'

	let cols = 2

	function generateData (N) {
  	let newData = { a: [], b: [], color: [] }
  	let allColors = ['red', 'blue', 'green', 'orange']

  	for (let i = 0; i < N; i++) {
  		let cat = Math.floor(Math.random() * 4)

  		newData.color.push(allColors[cat])
  		newData.a.push(Math.floor(Math.random() * 50) + 25)
  		newData.b.push(Math.floor(Math.random() * 50))
  	}

  	return newData
  }

  let data = new DataContainer(generateData(50))

  const scaleA = scaleLinear().domain(data.domain('a'))
  const scaleB = scaleLinear().domain(data.domain('b'))

  const groupedData = data.groupBy('color')

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
			x1={0.1} x2={0.9}
			y1={0.1} y2={0.9}
			columns={cols}
			rows={rows}
			names={groupedData.domain('color')}
			let:cells
		>

			{#each groupedData.rows() as facet (facet.$key)}

				<Section
					{...cells[facet.color]}
					scaleX={scaleA}
					scaleY={scaleB}
				>

          <Rectangle fill={facet.color} opacity={0.4} />

					{#each facet.$grouped.rows() as row (row.$key)}

						<Point 
							x={row.a}
							y={row.b} 
							fill={row.color}
						/>

					{/each}
		
				</Section>

			{/each}
		
		</Grid>

	</Graphic>

</div> -->
<script>
	import { scaleLinear } from 'd3-scale'
	import { Graphic, Section, Point, DataContainer } from '../sveg'

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

	const scaleA = scaleLinear().domain(data.domain('a'))
  const scaleB = scaleLinear().domain(data.domain('b'))
  
  let width = 500
  let height = 500
</script>

<div>
  <label for="height-slider">Height:</label>
  <input type="range" min="0" max="1000" bind:value={height} name="height-slider" />
</div>

<div>

	<Graphic {width} {height}>
		
		<Section
			x={50} w={400}
			y={50} h={400}
			scaleX={scaleA}
			scaleY={scaleB}
		>

			{#each data.rows() as row (row.$index)}

				<Point 
					x={row.a} 
					y={row.b} 
				/>

			{/each}
		
		</Section>

	</Graphic>

</div>
<script>
	import { scaleLinear } from 'd3-scale'
	import { Graphic, Section, CoordinateTransformation, Point, Rectangle, DataContainer } from '../sveg'

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
  
  let height = 500
  let transformation = 'cartesian'
</script>

<div>
  <label for="height-slider">Height:</label>
  <input type="range" min="0" max="500" bind:value={height} name="height-slider" />
</div>

<div>
  <label for="coordinate-select">Coordinates:</label>
  <select name="coordinate-select" bind:value={transformation}>
    <option value="cartesian">Cartesian</option>
    <option value="polar">Polar</option>
  </select>
</div>

<div>

	<Graphic 
    width={500} {height}
    scaleX={scaleLinear().domain([0, 500])}
    scaleY={scaleLinear().domain([0, 500])}
  >
    <Point x={250} y={250} fill="red" radius={10} />
		
		<Section
			x1={50} x2={450}
			y1={50} y2={450}
			scaleX={scaleA}
			scaleY={scaleB}
		>

			<CoordinateTransformation {transformation}>
      
        {#each data.rows() as row (row.$index)}

				  <Point 
					  x={row.a}
					  y={row.b}
            fill="black"
            transition={true}
				  />

			  {/each}

      </CoordinateTransformation>
		
		</Section>

	</Graphic>

</div>
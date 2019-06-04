<script>
	// import { scaleLinear } from 'd3-scale'
	import { Graphic, Section, Point, DataContainer, Grid } from '../sveg'

	// export let N = 100

	// const data = new DataContainer(generateData(N, 0.25))

	// function generateData (N, error) {
	// 	const getError = () => -error + (Math.random() * (2 * error)) * N

	// 	let data = { a: [], b: [] }
	// 	for (let i = 0; i < N; i++) {
	// 		data.a.push(i + getError())
	// 		data.b.push(i + getError())
	// 	}

	// 	return data
	// }

	// const scaleA = scaleLinear().domain(data.domain('a'))
 //    const scaleB = scaleLinear().domain(data.domain('b'))
  
    let height = 500
</script>

<div>

	<Graphic 
    width={500} {height}
  >
		
		<Grid
			x1={50} x2={450}
			y1={50} y2={450}
			gridTemplateRows={['a', 'b', 'c']}
			let:generatedCells
		>

			<Section {...generatedCells} >
	
			</Section>
		
		</Grid>

	</Graphic>

</div>
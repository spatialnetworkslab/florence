<script>
	import { scaleLinear } from 'd3-scale'
	import DataContainer from '../classes/DataContainer'
	import { Graphic, Section, Point } from '../components'

	export let filterT = 0
	export let N = 100

	const unfilteredData = new DataContainer(generateData(N, 0.25))

	function generateData (N, error) {
		const getError = () => -error + (Math.random() * (2 * error)) * N

		let data = { a: [], b: [] }
		for (let i = 0; i < N; i++) {
			data.a.push(i + getError(i))
			data.b.push(i + getError(i))
		}

		return data
	}

	$: filteredData = unfilteredData
		.transform()
		.filter(row => row.a > filterT)
		.done()

	const scaleA = scaleLinear().domain(unfilteredData.domain('a'))
	const scaleB = scaleLinear().domain(unfilteredData.domain('b'))
</script>

<div>

	<!-- Scatterplot: verbose -->
	<Graphic width={500} height={500}>
		
		<Section
			x1={50} x2={450}
			y1={50} y2={450}
			scaleX={scaleA}
			scaleY={scaleB}
			let:scaleX let:scaleY
		>

			{#each filteredData.rows() as row (row.$index)}

				<Point x={scaleX(row.a)} y={scaleY(row.b)} />

			{/each}
		
		</Section>

	</Graphic>

</div>
<script>
	import { scaleLinear } from 'd3-scale'
	import { 
    Graphic, Section, 
    PointLayer, XAxis
  } from '../../../../../src/'
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
  const scaleA = scaleLinear().domain(data.domain('a')).nice()
  const scaleB = scaleLinear().domain(data.domain('b')).nice()
  
  let height = 500
  let background = '#808080'
  let padding = '#E8E8E8'

</script>

<div>
  <label for="height-slider">Height:</label>
  <input type="range" min="0" max="500" bind:value={height} name="height-slider" />
</div>


<div>

	<Graphic 
    width={500} {height}
    scaleX={scaleLinear().domain([0, 500])}
    scaleY={scaleLinear().domain([0, 500])}
  >
		
		<Section
			scaleX={scaleA}
			scaleY={scaleB}
      backgroundColor={background}
      paddingColor={padding}
      padding={{left: 25, right: 100, top: 25, bottom: 100}}
      flipY
		>
        <PointLayer
          x={data.column('a')}
          y={data.column('b')}
          index={data.column('$index')}
        />
		
        <XAxis
          offset={10}
          vjust={'bottom'}
        />
		</Section>

	</Graphic>

</div>
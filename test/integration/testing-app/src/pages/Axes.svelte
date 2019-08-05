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

    export let vjust = "bottom"
  export let y = undefined
  export let offset = 0

  export let ticks = true
  export let tickCount = 10
  export let tickValues = undefined
  export let tickSize = 5
  export let tickWidth = 0.5

  export let labelFormat = undefined
  export let labelOffset = 2
  export let labelRotate = 0
  export let labelFont = "Helvetica"
  export let labelFontSize = 10


  let options = {
    vjust: 'bottom',
    y: undefined,
    offset: 0,
    ticks: 'true',
    tickCount: '10',
    tickValues: '',
    tickSize: 5,
    tickWidth: 0.5
  }

</script>

<div>
  <label for="height-slider">Height:</label>
  <input type="range" min="0" max="500" bind:value={height} name="height-slider" />
</div>

{#each Object.keys(options) as option}
  <div>
    <label for={option}>{option}:</label>
    <input bind:value={options[option]} name={option} />
  </div>
{/each}


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
          offset={Number(options.offset)}
          vjust={isNaN(options.vjust) ? options.vjust : Number(options.vjust)}
          y={Number(options.y)}
          ticks={options.ticks === 'true'}
          tickCount={Number(options.tickCount)}
          tickValues={options.tickValues.split(',')}
          tickSize={Number(options.tickSize)}
          tickWidth={Number(options.tickWidth)}
        />
		</Section>

	</Graphic>

</div>
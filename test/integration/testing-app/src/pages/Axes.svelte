<script>
	import { scaleLinear } from 'd3-scale'
	import { 
    Graphic, Section, 
    PointLayer, XAxis, YAxis
  } from '../../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

	let N = 100
	let data = new DataContainer(generateData(N, 0.25))
	function generateData (N, error) {
		const getError = () => -error + (Math.random() * (2 * error)) * N
		let _data = { a: [], b: [] }
		for (let i = 0; i < N; i++) {
			_data.a.push(i + getError())
			_data.b.push(i + getError())
		}
		return _data
  }
  let scaleA = scaleLinear().domain(data.domain('a')).nice()
  let scaleB = scaleLinear().domain(data.domain('b')).nice()

  $: {
    scaleA = scaleLinear().domain(data.domain('a')).nice()
    scaleB = scaleLinear().domain(data.domain('b')).nice()
  }
  
  function updateData() {
    N = Math.floor(Math.random() * (300 - 50 + 1)) + 50 // random number between 50-300
    data = new DataContainer(generateData(N, 0.25))
  }

  let height = 300
  let width = 300
  let background = '#808080'
  let padding = '#E8E8E8'

  let options = {
    flip: 'false',
    vjust: 'bottom',
    y: undefined,
    yOffset: 0,
    ticks: 'true',
    tickCount: '8',
    tickValues: '',
    tickSize: 5,
    tickWidth: 0.5,
    tickColor: 'black',
    tickOpacity: 1,
    tickExtra: 'false',
    baseLine: 'true',
    baseLineColor: 'black',
    baseLineOpacity: 1,
    baseLineWidth: 1,
    labelFormat: undefined,
    labelOffset: 2,
    labelRotate: 0,
    labelFont: "Helvetica",
    labelFontSize: 10,
    labelFontWeight: 'normal',
    labelOpacity: 1,
    labelColor: 'black',
    titleHjust: 'center',
    titleXOffset: 0,
    titleYOffset: 'axis',
    titleVjust: 'axis',
    title: 'Test Title',
    titleColor: 'black',
    titleFont: 'Helvetica',
    titleFontSize: '12',
    titleFontWeight: 'normal',
    titleOpacity: 1,
    titleRotation: 0,
    titleAnchorPoint: 't'
  }

</script>

<div class="options">
  <button on:click={updateData}>
    Update Data
  </button>
  <div>
    <label for="height-slider">Height:</label>
    <input type="range" min="0" max="500" bind:value={height} name="height-slider" />
  </div>

  <div>
    <label for="width-slider">Width:</label>
    <input type="range" min="0" max="500" bind:value={width} name="width-slider" />
  </div>

  {#each Object.keys(options) as option}
    <div>
      <label for={option}>{option}:</label>
      <input bind:value={options[option]} name={option} />
    </div>
  {/each}
</div>



<div class="graphic">

	<Graphic 
    width={width} {height}
    scaleX={scaleLinear().domain([0, 500])}
    scaleY={scaleLinear().domain([0, 500])}
  >
		
		<Section
			scaleX={scaleA}
			scaleY={scaleB}
      backgroundColor={background}
      padding={{left: 40, right: 25, top: 25, bottom: 40}}
      flipY
		>
        <PointLayer
          x={data.column('a')}
          y={data.column('b')}
        />

        <!-- <PointLayer
          x={data.column('a')}
          y={data.column('b')}
          key={data.column('$key')}
        /> -->
		
        <XAxis
          yOffset={Number(options.yOffset)}
          flip={options.flip === 'true'}
          vjust={isNaN(options.vjust) ? options.vjust : Number(options.vjust)}
          y={Number(options.y)}
          baseLine={options.baseLine === 'true'}
          baseLineColor={options.baseLineColor}
          baseLineOpacity={Number(options.baseLineOpacity)}
          baseLineWidth={Number(options.baseLineWidth)}
          ticks={options.ticks === 'true'}
          tickCount={Number(options.tickCount)}
          tickValues={(options.tickValues.length > 0) ? options.tickValues.split(',') : []}
          tickSize={Number(options.tickSize)}
          tickWidth={Number(options.tickWidth)}
          tickColor={options.tickColor}
          tickOpacity={Number(options.tickOpacity)}
          tickExtra={options.tickExtra === 'true'}
          labelFormat = {options.labelFormat}
          labelOffset = {Number(options.labelOffset)}
          labelRotate = {Number(options.labelRotate)}
          labelFont = {options.labelFont}
          labelFontSize = {Number(options.labelFontSize)}
          labelFontWeight = {options.labelFontWeight}
          labelOpacity = {Number(options.labelOpacity)}
          labelColor={options.labelColor}
          titleHjust={options.titleHjust}
          titleXOffset={Number(options.titleXOffset)}
          titleYOffset={options.titleYOffset}
          titleVjust={options.titleVjust}
          title={options.title}
          titleColor={options.titleColor}
          titleFont={options.titleFont}
          titleFontSize={Number(options.titleFontSize)}
          titleFontWeight={options.titleFontWeight}
          titleOpacity={Number(options.titleOpacity)}
          titleRotation={Number(options.titleRotation)}
          titleAnchorPoint={options.titleAnchorPoint}
        />

        <YAxis hjust={'left'} baseLineWidth={1} title="Test Y Axis"/>
		</Section>

	</Graphic>

</div>

<style>
.options {
  float: left;
  height: 300px;
  overflow: auto;
  padding: 10px;
}
.graphic {
  float: right;
}
</style>
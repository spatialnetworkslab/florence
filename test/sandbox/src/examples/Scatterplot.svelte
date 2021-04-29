<script>
	import { scaleLinear } from 'd3-scale'
	import { Graphic, Section, /* PointLayer, */ Point } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

	const N = 100
  let data = new DataContainer(generateData(N, 0.25))

	function generateData (N, error) {
		const getError = () => -error + (Math.random() * (2 * error)) * N
		let data = { a: [], b: [] }
		for (let i = 0; i < N; i++) {
			data.a.push(i + getError())
			data.b.push(i + getError())
		}
		return data
  }
  
  let threshold = 0
  let filteredData
  $: {
    filteredData = data
    .filter(row => row.a > threshold)
  }

	const scaleA = scaleLinear().domain(data.domain('a'))
  const scaleB = scaleLinear().domain(data.domain('b'))
  
  let height = 500
  let transformation = 'identity'
  let duration = 2000

  const log = console.log

  let background = "white"
  
  let current
</script>

<div>
  <label for="height-slider">Height:</label>
  <input type="range" min="0" max="500" bind:value={height} name="height-slider" />
</div>

<div>
  <label for="coordinate-select">Coordinates:</label>
  <select name="coordinate-select" bind:value={transformation}>
    <option value="identity">Identity</option>
    <option value="polar">Polar</option>
  </select>
</div>

<div>
  <label for="duration">Transition time</label>
  <input name="duration" type="range" min="100" max="5000" bind:value={duration} />
</div>

<div>
  <button on:click={() => threshold = 40}>Filter: x > 40</button>
</div>

<div>

	<Graphic 
    width={500} {height}
    scaleX={scaleLinear().domain([0, 500])}
    scaleY={scaleLinear().domain([0, 500])}
    renderer="canvas"
  >
		
		<Section
			x1={50} x2={450}
			y1={50} y2={450}
			scaleX={scaleA}
			scaleY={scaleB}
      flipY
      {transformation}
		>

			<!-- <PointLayer
        x={filteredData.column('a')}
        y={filteredData.column('b')}
        key={filteredData.keys()}
        fill={transformation === 'identity' ? 'black' : 'blue'}
        radius={transformation === 'identity' ? 4 : 6}
        transition={duration}
      /> -->
      {#each data.keys() as key, i}
        <Point
          x={filteredData.column('a')[i]}
          y={filteredData.column('b')[i]}
          fill={i === current ? 'red': 'black'}
          onMouseover={() => { current = i }}
        />
      {/each}

		</Section>

	</Graphic>

</div>
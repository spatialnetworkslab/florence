<script>
	import { scaleLinear } from 'd3-scale'
	import { 
    Graphic, Section, CoordinateTransformation, 
    PointLayer, Point,
    DataContainer 
  } from '../../../../'

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
  
  let treshold = 0
  $: filteredData = data
    .filter(row => row.a > treshold)
    .done()

	const scaleA = scaleLinear().domain(data.domain('a'))
  const scaleB = scaleLinear().domain(data.domain('b'))
  
  let height = 500
  let transformation = 'identity'
  let duration = 2000

  const log = console.log

  let background = "pink"
  let big = false
  let hoverPoints = {}

  $: hoverPointKeys = Object.keys(hoverPoints)
  function handleMouseout (ix) {
    delete hoverPoints[ix]
    hoverPoints = hoverPoints
  }
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
  <button on:click={() => treshold = 40}>Filter: x > 40</button>
</div>

<div>

	<Graphic 
    width={500} {height}
    scaleX={scaleLinear().domain([0, 500])}
    scaleY={scaleLinear().domain([0, 500])}
  >
		
		<Section
			x1={50} x2={450}
			y1={50} y2={450}
			scaleX={scaleA}
			scaleY={scaleB}
      backgroundColor={background}
		>

			<CoordinateTransformation {transformation}>
        <PointLayer
          x={filteredData.column('a')}
          y={filteredData.column('b')}
          fill={transformation === 'identity' ? 'black' : 'blue'}
          radius={transformation === 'identity' ? 3 : 6}
          index={filteredData.column('$index')}
          onMouseover={ix => hoverPoints[ix] = filteredData.row(ix)}
          onMouseout={handleMouseout}
        />

        <Point
          x={50}
          y={50}
          fill={big ? 'blue' : 'red'}
          radius={big ? 50 : 10}
          onClick={() => log('BOOM')}
          onMouseover={() => big = true}
          onMouseout={() => big = false}
        />

        {#each hoverPointKeys as key (key)}

          <Point
            x={hoverPoints[key].a}
            y={hoverPoints[key].b}
            radius={10}
            fill={'green'}
          />

        {/each}

      </CoordinateTransformation>
		
		</Section>

	</Graphic>

</div>
<script>
	import { scaleLinear } from 'd3-scale'
	import { 
    Graphic, Section, CoordinateTransformation, 
    PointLayer, Point,
    DataContainer 
  } from '../sveg'
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

  let radius = 7

  // how to scale increase/decrease in radius
  // how to scale other props?
  // const handleZoom = {
  //   delta: 'wheelDelta',
  //   zoomFactor: 0.3,
  //   maxZoom: 2,
  //   minZoom: 1,
  //   callback: function (id, event) {
  //     scaleA.domain[0] = scaleA.domain[0] - event[this.delta] * this.zoomFactor
  //     scaleA.domain[1] = scaleA.domain[1] + event[this.delta] * this.zoomFactor
  //     scaleB.domain[0] = scaleB.domain[0] - event[this.delta] * this.zoomFactor
  //     scaleB.domain[1] = scaleB.domain[1] + event[this.delta] * this.zoomFactor
  //     console.log(event)
  //     radius = radius - event[this.delta] * this.zoomFactor >= 0.5 ? radius - event[this.delta] * this.zoomFactor : 0.5
  //   }
  // }

  function handleZoom(id, event) {
    let delta = 'wheelDelta'
    let zoomFactor = 0.3
    let maxZoom = 2
    let minZoom = 1
    radius = radius - event[delta] * zoomFactor >= 0.5 ? radius - event[delta] * zoomFactor : 0.5
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

<!-- <div>
  <button on:click={() => treshold = 40}>Filter: x > 40</button>
</div> -->

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
      onMouseover={() => background = 'orange'}
      onMouseout={() => background = 'pink'}
      onWheel={ handleZoom }
		>

			<CoordinateTransformation {transformation}>
        <PointLayer
          x={filteredData.column('a')}
          y={filteredData.column('b')}
          fill={transformation === 'identity' ? 'black' : 'blue'}
          radius={transformation === 'identity' ? radius : 6}
          index={filteredData.column('$index')}
          transition={duration}
          onMouseover={ix => hoverPoints[ix] = filteredData.row(ix)}
          onMouseout={handleMouseout}
        />

        <Point
          x={50}
          y={50}
          fill={big ? 'blue' : 'red'}
          radius={big ? 50 : radius* 2}
          transition={duration}
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
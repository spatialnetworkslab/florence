<script>
	import { scaleLinear } from 'd3-scale'
	import { Graphic, Grid, Section, PointLayer, Point } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

	export let N = 100
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
    .done()
  }

	const scaleA = scaleLinear().domain(data.domain('a'))
  const scaleB = scaleLinear().domain(data.domain('b'))
  
  let height = 500
  let transformation = 'identity'
  let duration = 2000

  const log = console.log

  let background = "white"
  let big = false
  let hoverPoints = {}

  $: hoverPointKeys = Object.keys(hoverPoints)
  function handleMouseout (ix) {
    delete hoverPoints[ix]
    hoverPoints = hoverPoints
  }
  
  let bigPoint = { x: 50, y: 50 }
  let dragPoint

  function handleDragStart (event) {
    dragPoint = event.localCoords
  }

  function handleDrag (event) {
    dragPoint = event.localCoords
  }

  function handleDragEnd (event) {
    bigPoint = dragPoint
    dragPoint = undefined
  }

  let dragPointLayer
  let dragIndex
  let opacityArray
  $: {
    opacityArray = Array(filteredData._length).fill(1)
    opacityArray[filteredData._indexToRowNumber[dragIndex]] = 0
  }

  function handleLayerDragStart (event) {
    dragIndex = event.hitIndex
    dragPointLayer = event.localCoords
  }

  function handleLayerDrag (event) {
    dragPointLayer = event.localCoords
  }

  function handleLayerDragEnd (event) {
    data.updateRow(event.hitIndex, { a: dragPointLayer.x, b: dragPointLayer.y })
    data = data
    dragPointLayer = undefined
    dragIndex = undefined
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
  <button on:click={() => threshold = 40}>Filter: x > 40</button>
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
      flipY
      {transformation}
		>

			<PointLayer
        x={filteredData.column('a')}
        y={filteredData.column('b')}
        opacity={opacityArray}
        index={filteredData.column('$index')}
        fill={transformation === 'identity' ? 'black' : 'blue'}
        radius={transformation === 'identity' ? 4 : 6}
        onHover={ix => hoverPoints[ix] = filteredData.row(ix)}
        onMouseout={handleMouseout}
        onDragStart={handleLayerDragStart}
        onDrag={handleLayerDrag}
        onDragEnd={handleLayerDragEnd}
      />
        <!-- transition={duration} -->

      {#if dragPointLayer}
        <Point
          x={dragPointLayer.x}
          y={dragPointLayer.y}
          radius={5}
          fill={'black'}
        />
      {/if}

      <!-- {#each filteredData.rows() as row (row.$index)}

        <Point 
          x={row.a}
          y={row.b}
          fill={transformation === 'identity' ? 'black' : 'blue'}
          radius={transformation === 'identity' ? 3 : 6}
          onHover={() => hoverPoints[row.$index] = filteredData.row(row.$index)}
          onMouseout={() => handleMouseout(row.$index)}
        />

      {/each} -->

      <Point
        x={bigPoint.x}
        y={bigPoint.y}
        fill={big ? 'blue' : 'red'}
        opacity={dragPoint ? 0 : 1}
        radius={big ? 50 : 10}
        onClick={() => log('BOOM')}
        onHover={() => big = true}
        onMouseout={() => big = false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />

      {#if dragPoint}
        <Point
          x={dragPoint.x}
          y={dragPoint.y}
          radius={10}
          fill={'red'}
        />
      {/if}

      <!-- {#each hoverPointKeys as key (key)}

        <Point
          x={hoverPoints[key].a}
          y={hoverPoints[key].b}
          radius={10}
          fill={'green'}
        />

      {/each} -->

		</Section>

	</Graphic>

</div>
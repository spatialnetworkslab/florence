<script>
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { Graphic, Section, CoordinateTransformation, Point, Rectangle, DataContainer } from '../sveg'
  
  let data = new DataContainer({ 
    quantity: [1, 4, 2, 3, 3, 5, 6, 9], 
    fruit: [NaN, 'anchovies', 'banana', 'banana', 'coconut', 'coconut', 'durian', 'durian']
  })

  data = data
    .dropNA()
    .filter(row => row.fruit !== 'anchovies')
    .groupBy('fruit')
    .summarise({ meanQuantity: { quantity: 'mean' } })
    .arrange({ meanQuantity: 'descending' })
    .done()

  const scaleFruit = scaleBand().domain(data.domain('fruit')).padding(0.2)
	let meanQuantityDomain = [0, data.domain('meanQuantity')[1]]
  const scaleMeanQuantity = scaleLinear().domain(meanQuantityDomain)

  let height = 500
  let transformation = 'identity'
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

<Graphic 
  width={500} {height}
  scaleX={scaleLinear().domain([0, 500])}
  scaleY={scaleLinear().domain([0, 500])}
>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleFruit} 
		scaleY={scaleMeanQuantity}
  >

    <CoordinateTransformation {transformation}>

      <Rectangle fill="red" transition={2000} />
    
      {#each data.rows() as row}

        <Rectangle
          x1={row.fruit}
          x2={({ scaleX }) => scaleX(row.fruit) + scaleX.bandwidth()}
          y1={0}
          y2={row.meanQuantity}
          transition={2000}
        />

     {/each}

    </CoordinateTransformation>

  </Section>

</Graphic>
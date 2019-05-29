<script>
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { Graphic, Section, Rectangle, DataContainer } from '../sveg'
  
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

  const scaleFruit = scaleBand().domain(data.domain('fruit'))
	let meanQuantityDomain = [0, data.domain('meanQuantity')[1]]
  const scaleMeanQuantity = scaleLinear().domain(meanQuantityDomain)

  let height = 500
</script>

<div>
  <label for="height-slider">Height:</label>
  <input type="range" min="0" max="500" bind:value={height} name="height-slider" />
</div>

<Graphic 
  width={500} {height}
  scaleX={scaleLinear().domain([0, 500])}
  scaleY={scaleLinear().domain([0, 500])}
>

  <Section
    x={50} w={400}
    y={50} h={400}
    scaleX={scaleFruit} 
		scaleY={scaleMeanQuantity}
  >
  
    {#each data.rows() as row}

      <Rectangle
        x={row.fruit}
        w={({ scaleX }) => scaleX.bandwidth()}
        y={0}
        h={row.meanQuantity}
      />

    {/each}

  </Section>

</Graphic>
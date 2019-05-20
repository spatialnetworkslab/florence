<script>
  import { scaleLinear, scaleBand } from 'd3-scale'
  import DataContainer from '../classes/DataContainer'
  import { Graphic, Section, Rectangle } from '../components'
  
  let data = new DataContainer({ 
    quantity: [1, 4, 2, 3, 3, 5, 6, 9], 
    fruit: [NaN, 'anchovies', 'banana', 'banana', 'coconut', 'coconut', 'durian', 'durian']
  })

  data = data.transform()
    .dropNA()
    .filter(row => row.fruit !== 'anchovies')
    .groupBy('fruit')
    .summarise({ meanQuantity: { quantity: 'mean' } })
    .arrange({ meanQuantity: 'descending' })
    .done()

  const scaleFruit = scaleBand().domain(data.domain('fruit'))
	let meanQuantityDomain = [0, data.domain('meanQuantity')[1]]
  const scaleMeanQuantity = scaleLinear().domain(meanQuantityDomain)

  let mutariseTest = new DataContainer({ 
    quantity: [1, 4, 2, 3, 3, 5, 6, 9], 
    fruit: [NaN, 'anchovies', 'banana', 'banana', 'coconut', 'coconut', 'durian', 'durian']
  })

  mutariseTest = mutariseTest.transform()
    .dropNA()
    .filter(row => row.fruit !== 'anchovies')
    .groupBy('fruit')
    .mutarise({ meanQuantity: { quantity: 'mean' } })
    .arrange({ meanQuantity: 'descending' })
    .done()

  console.log(mutariseTest)
</script>

<Graphic width={500} height={500}>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleFruit} 
		scaleY={scaleMeanQuantity}
    let:scaleX let:scaleY
  >
  
    {#each data.rows() as row}

      <Rectangle
        x1={scaleX(row.fruit)}
        x2={scaleX(row.fruit) + scaleX.bandwidth()}
        y1={scaleY(0)}
        y2={scaleY(row.meanQuantity)}
      />

    {/each}

  </Section>

</Graphic>
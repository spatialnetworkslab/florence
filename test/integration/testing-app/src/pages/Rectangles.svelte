<script>
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { Graphic, Section, RectangleLayer } from '../../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  
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

  const scaleFruit = scaleBand().domain(data.domain('fruit')).padding(0.2)
	let meanQuantityDomain = [0, data.domain('meanQuantity')[1]]
  const scaleMeanQuantity = scaleLinear().domain(meanQuantityDomain)

  let height = 500
  let isActive = false

  const log = console.log
</script>

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
    
      <RectangleLayer 
        x1={data.column('fruit')}
        x2={({ scaleX }) => data.map('fruit', v => scaleX(v) + scaleX.bandwidth() )}
        y1={Array(data.nrow()).fill(0)}
        y2={data.column('meanQuantity')}
        onClick={() => isActive = true}
        fill={isActive ? 'blue' : 'yellow'}
      />

  </Section>

</Graphic>
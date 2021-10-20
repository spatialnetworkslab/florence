<script>
  import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale'
  import { schemeAccent } from 'd3-scale-chromatic'
  import { Graphic, Section, Rectangle, XAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  let data = new DataContainer({
    fruit: ['apple', 'banana', 'apple', 'banana', 'apple', 'banana'],
    nutrient: ['carbs', 'carbs', 'fibre', 'fibre', 'protein', 'protein'],
    value: [3, 5, 1, 3, 4, 2]
  })

  const fruitDomain = data.domain('fruit')
  const nutrientDomain = data.domain('nutrient')

  data = data
    .groupBy('fruit')
    .mutarise({ totalValuePerFruit: { value: 'sum' } })
    .mutate({ valueFraction: row => row.value / row.totalValuePerFruit })
    .select(['fruit', 'nutrient', 'valueFraction'])
    .groupBy('fruit')


  const containerPerFruit = data.column('$grouped').map(container => {
    return container.cumsum({ cumsum_value: 'valueFraction' })
  })

  const nutrientColorScale = scaleOrdinal()
    .domain(nutrientDomain)
    .range(schemeAccent)
</script>

<Graphic width={500} height={500}>

  <Section
    padding={24}
    scaleX={scaleBand().domain(fruitDomain).padding(0.3)}
    scaleY={scaleLinear().domain([0, 1])}
  >

    {#each containerPerFruit as container}

      {#each container.rows() as row, i}

        <Rectangle 
          x1={row.fruit}
          x2={({ scaleX }) => scaleX(row.fruit) + scaleX.bandwidth()}
          y1={i === 0 ? 0 : container.row({ index: i - 1 }).cumsum_value}
          y2={row.cumsum_value}
          fill={nutrientColorScale(row.nutrient)}
        />

      {/each}

    {/each}

    <XAxis labelFontSize={13} />
  
  </Section>

</Graphic>
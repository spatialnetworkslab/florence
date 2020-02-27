<script>
  // d3
  import { scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale'
  import * as d3 from 'd3-scale-chromatic'
  import { schemeTableau10 } from 'd3-scale-chromatic'

  // florence
  import { Rectangle, Graphic, Section, DiscreteLegend, XAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // categorical data
  let catData = new DataContainer({
    fruit: ['apple', 'banana', 'apple', 'banana', 'apple', 'banana'],
    nutrient: ['carbs', 'carbs', 'fibre', 'fibre', 'protein', 'protein'],
    value: [3, 5, 1, 3, 4, 2]
  })

  const fruitDomain = catData.domain('fruit')
  const nutrientDomain = catData.domain('nutrient')

  catData = catData
    .groupBy('fruit')
    .mutarise({ totalValuePerFruit: { value: 'sum' } })
    .mutate({ valueFraction: row => row.value / row.totalValuePerFruit })
    .select(['fruit', 'nutrient', 'valueFraction'])
    .groupBy('fruit')

  const containerPerFruit = catData.column('$grouped').map(container => {
    return container.cumsum({ cumsum_value: 'valueFraction' })
  })

  const nutrientColorScale = scaleOrdinal()
    .domain(nutrientDomain)
    .range(schemeTableau10)
</script>

<div>
	<Graphic 
    height={400} width={400}
  >         

    <!-- Categorical -->
    <Section 
      scaleX={scaleBand().domain(fruitDomain).padding(0.3)}
      scaleY={scaleLinear().domain([0, 1])}
      padding={75}
    > 
      <DiscreteLegend
        fill={nutrientColorScale}
        strokeWidth={2}
        stroke={'white'}
        orient={'vertical'}
        vjust={'centre'}
        hjust={'left'}
        flipLabels
        labelPaddingX={10}
        usePadding={true}
      />

      {#each containerPerFruit as container}
        {#each container.rows() as row, i}
          <Rectangle 
            x1={row.fruit}
            x2={({ scaleX }) => scaleX(row.fruit) + scaleX.bandwidth()}
            y1={i === 0 ? 0 : container.prevRow(row.$key).cumsum_value}
            y2={row.cumsum_value}
            fill={nutrientColorScale(row.nutrient)}
          />
        {/each}
      {/each}

      <XAxis labelFontSize={15} />
    
    </Section>

	</Graphic>

</div>
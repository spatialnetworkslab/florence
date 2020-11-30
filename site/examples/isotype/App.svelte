<script>
  import { scaleOrdinal, scaleBand, scalePoint } from 'd3-scale'
  import { Graphic, Section, SymbolLayer, Label } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { cattleShape, pigShape, sheepShape } from './animalShapes.js'
  import livestock from './livestock.js'

  const animals = ['cattle', 'pigs', 'sheep']
  const dataContainer = new DataContainer(livestock)
  const byCountry = dataContainer.groupBy('country')

  const countryScale = scaleBand()
    .domain(dataContainer.domain('country'))
    .padding(0.01)

  const colScale = scalePoint()
    .domain(dataContainer.domain('col'))
    .padding(0.8)
    .round(true)

  const animalScale = scaleBand()
    .domain(animals)
    .padding(0.5)

  const colorScale = scaleOrdinal()
    .domain(animals)
    .range(['#684e32', 'pink', '#5b8395'])

  const shapeScale = scaleOrdinal()
    .domain(animals)
    .range([cattleShape, pigShape, sheepShape])
</script>

<Graphic 
  width={500}
  height={500}
  scaleY={countryScale}
>

  {#each byCountry.rows() as row}

    <Section
      y1={row.country}
      y2={({ scaleY }) => scaleY(row.country) + scaleY.bandwidth()}
      scaleX={colScale}
      scaleY={animalScale}
    >

      <SymbolLayer 
        x={row.$grouped.column('col')}
        y={row.$grouped.column('animal')}
        shape={row.$grouped.map('animal', shapeScale)}
        fill={row.$grouped.map('animal', colorScale)}
        size={80}
      />

      <Label 
        x={() => 10}
        y={'pigs'}
        text={row.country}
        rotation={-90}
        fontFamily={'sans-serif'}
        fontSize={10}
      />
    
    </Section>

  {/each}

</Graphic>

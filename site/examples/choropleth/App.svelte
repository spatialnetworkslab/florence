<script>
  import { json, csv } from 'd3-fetch'
  import { feature } from 'topojson'
  import { schemeBlues } from 'd3-scale-chromatic'
  import { Graphic, PolygonLayer, createGeoScales } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let dataContainer, geoScales, populationScale, ready
  
  (async () => {
    const topojson = await json('/data/us-states.topojson')
    dataContainer = new DataContainer(feature(topojson, topojson.objects.states))

    geoScales = createGeoScales(dataContainer.bbox())

    const population = await csv('/data/us-states-population.csv')
    dataContainer.addColumn('population', population.map(row => +row.population))

    populationScale = dataContainer.classify({
      column: 'population', method: 'Jenks', numClasses: 6
    }, schemeBlues[6])

    ready = true
  })()
</script>

{#if ready}

  <Graphic 
    width={400}
    height={400}
    {...geoScales}
  >

    <PolygonLayer 
      geometry={dataContainer.column('$geometry')}
      fill={dataContainer.map('population', populationScale)}
      stroke={'grey'}
      strokeWidth={0.5}
    />

  </Graphic>

{/if}

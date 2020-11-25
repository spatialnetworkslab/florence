<script>
  import { json, csv } from 'd3-fetch'
  import { feature } from 'topojson'
  import { schemeBlues } from 'd3-scale-chromatic'
  import { Graphic, PolygonLayer, createGeoScales } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let geometries, geoScales, populationScale
  
  (async () => {
    const topojson = await json('/data/us-states.topojson')
    geometries = new DataContainer(feature(topojson, topojson.objects.states))
    geoScales = createGeoScales(geometries.bbox())

    const population = await csv('/data/us-states-population.csv')
    geometries.addColumn('population', population.map(row => +row.population))

    populationScale = geometries.classify({
      column: 'population', method: 'Jenks', numClasses: 6
    }, schemeBlues[6])
  })()
</script>

{#if geometries}

  <Graphic 
    width={500}
    height={500}
    {...geoScales}
  >

    <PolygonLayer 
      geometry={geometries.column('$geometry')}
      fill={geometries.map('population', populationScale)}
      stroke={'grey'}
      strokeWidth={0.5}
    />

  </Graphic>
{/if}

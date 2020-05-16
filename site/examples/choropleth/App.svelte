<script>
  import { Graphic, PolygonLayer, createGeoScales } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { json, csv } from 'd3-fetch'
  import { feature } from 'topojson'
  import { scaleQuantize } from 'd3-scale'
  import { schemeBlues } from 'd3-scale-chromatic'

  let geometries
  let geoScales

  json('/data/us-states.topojson').then(topojson => {
    const features = feature(topojson, topojson.objects.states)
    geometries = new DataContainer(features)
    geoScales = createGeoScales(geometries.domain('$geometry'))
  })

  let population
  let populationScale = scaleQuantize()
    .domain([0, 40000000])
    .range(schemeBlues[9])

  csv('/data/us-states-population.csv').then(csv => {
    population = csv.map(row => +row.population)
  })

  $: done = geometries && population
</script>

{#if done}
  <Graphic 
    width={500}
    height={500}
    {...geoScales}
  >

    <PolygonLayer 
      geometry={geometries.column('$geometry')}
      fill={population.map(populationScale)}
      stroke="grey"
      strokeWidth={0.5}
    />

  </Graphic>
{/if}

<script>
  import { 
    Graphic, Section, PointLayer, PolygonLayer, XAxis, YAxis, createGeoScales,
    Label
  } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleLinear } from 'd3-scale'

  import avocado from '../data/avocado-data.csv'
  import cities from '../data/city-centroids.csv'
  import states from '../data/us-states.json'

  // Data prepapration
  // Load avocado data
  let avocadoPricePerCity = new DataContainer(avocado)
    .rename({ 
      AveragePrice: 'averagePrice', 
      'Total Volume': 'totalVolume',
      Date: 'date'
    })
    .mutate({
      averagePrice: row => parseFloat(row.averagePrice),
      totalVolume: row => parseInt(row.totalVolume),
      date: row => new Date(row.date)
    })
    .groupBy('city')
    .summarise({ 
      avgPriceEntirePeriod: { averagePrice: 'mean' },
      avgVolumeEntirePeriod: { totalVolume: 'mean' }
    }) 

  // Join with city data
  avocadoPricePerCity.join(new DataContainer(cities), { by: ['city', 'city'] })

  avocadoPricePerCity = avocadoPricePerCity
    .select(['city', 'avgPriceEntirePeriod', 'avgVolumeEntirePeriod', 'lng', 'lat', 'population'])
    .mutate({
      lng: row => parseFloat(row.lng),
      lat: row => parseFloat(row.lat),
      population: row => parseInt(row.population)
    })

  // Load us state geometries
  const usStates = new DataContainer(states, { validate: false })
    .filter(row => ['Alaska', 'Hawaii'].includes(row.name) === false)
    .select('$geometry')

  // Scatterplot
  const scalePopulation = scaleLinear().domain(avocadoPricePerCity.domain('population'))
  const scaleVolume = scaleLinear().domain(avocadoPricePerCity.domain('avgVolumeEntirePeriod'))

  let currentKey
  let currentCity
  const setCity = event => {
    if (event) {
      currentKey = event.key
      currentCity = avocadoPricePerCity.row(currentKey).city
    } else {
      currentKey = undefined
      currentCity = undefined
    }
  }

  const geoScales = createGeoScales(usStates.domain('$geometry'))

  let currentVisualization = 'scatterplot'

  $: scales = currentVisualization === 'scatterplot'
    ? { scaleX: scalePopulation, scaleY: scaleVolume }
    : geoScales
</script>

<Graphic width={800} height={800}>

  <Section
    padding={70}
    {...scales}
    flipY={currentVisualization === 'scatterplot' ? true : false}
  >

    {#if currentVisualization === 'map'}
      <PolygonLayer 
        geometry={usStates.column('$geometry')}
        fill="purple"
        opacity={0.4}
      />
    {/if}

    <PointLayer
      x={avocadoPricePerCity.column(currentVisualization === 'scatterplot' ? 'population' : 'lng')}
      y={avocadoPricePerCity.column(currentVisualization === 'scatterplot' ? 'avgVolumeEntirePeriod': 'lat')}
      key={avocadoPricePerCity.column('$key')}
      radius={5}
      onMouseover={event => { setCity(event) }}
      onMouseout={() => { setCity(undefined) }}
      fill={key => key === currentKey ? 'red' : 'steelblue'}
      transition={2000}
    />

    {#if currentVisualization === 'scatterplot'}
      <XAxis title="Population" />
      <YAxis title="Average sales" />
    {/if}
  
  </Section>

  {#if currentCity}
    <Label
      x={170} y={100}
      text={currentCity} fontSize={30} 
    />
  {/if}

</Graphic>

<br />

<select bind:value={currentVisualization}>
  <option value="scatterplot">Scatterplot</option>
  <option value="map">Map</option>
</select>
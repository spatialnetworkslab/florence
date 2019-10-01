<script>
  import { 
    Graphic, Section, 
    PointLayer, PolygonLayer, Line, Label,
    XAxis, YAxis, createGeoScales
  } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleLinear, scaleTime } from 'd3-scale'
  import { format } from 'd3-format'

  import avocado from '../data/avocado-data.csv'
  import cities from '../data/city-centroids.csv'
  import states from '../data/us-states.json'

  // Data prepapration
  // Load avocado data
  const avocadoGrouped = new DataContainer(avocado)
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
    .filter(row => row.date > new Date('2017-03-25'))
    .groupBy('city')

  let avocadoPricePerCity = avocadoGrouped
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

  $: currentLineData = currentKey
    ? avocadoGrouped.row(currentKey).$grouped.arrange({ date: (a, b) => a - b })
    : undefined

  $: lineScaleX = currentLineData
    ? scaleTime().domain(currentLineData.domain('date')).nice()
    : undefined

  $: lineScaleY = currentLineData
    ? scaleLinear().domain(currentLineData.domain('averagePrice'))
    : undefined
</script>

<select bind:value={currentVisualization}>
  <option value="scatterplot">Scatterplot</option>
  <option value="map">Map</option>
</select>

<br />

<Graphic width={1200} height={600}>

  <Section
    x1={0} x2={600}
    padding={70}
    {...scales}
    flipY
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
      transition={{ geometry: 3000 }}
    />

    {#if currentVisualization === 'scatterplot'}
      
      <XAxis title="Population" labelFormat={format('.2s')} titleYOffset={30} />
      <YAxis title="Average sales" labelFormat={format('.2s')} titleXOffset={50} />

    {/if}
  
  </Section>

  {#if currentCity}
    <Label
      x={170} y={100}
      text={currentCity} fontSize={30} 
    />
  {/if}

  {#if currentLineData}

    <Section
      x1={600} x2={1200}
      padding={70}
      scaleX={lineScaleX}
      scaleY={lineScaleY}
      flipY
    >

      <Line
        x={currentLineData.column('date')}
        y={currentLineData.column('averagePrice')}
        strokeWidth={0.5}
        color="#32CD32"
      />

      <XAxis labelRotate={-30} labelOffset={10} />
      <YAxis />
  
  </Section>

  {/if}

</Graphic>

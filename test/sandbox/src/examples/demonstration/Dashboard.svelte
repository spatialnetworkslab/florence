<script>
  import { 
    Graphic, Section, 
    PointLayer, PolygonLayer, Line, Label,
    XAxis, YAxis, fitScales
  } from '../../../../src/'

  import { scaleLinear, scaleTime } from 'd3-scale'
  import { format } from 'd3-format'

  import { getAvocadoDataGrouped, getCityData, getStateGeometries } from '../helpers/prepareData.js'

  // Data loading
  const avocadoDataGrouped = getAvocadoDataGrouped()
  const cities = getCityData()
  const states = getStateGeometries()

  // Calculate average price per city
  let avocadoPricePerCity = avocadoDataGrouped
    .summarise({ 
      avgPriceEntirePeriod: { averagePrice: 'mean' },
      avgVolumeEntirePeriod: { totalVolume: 'mean' }
    })

  // Join with city data
  avocadoPricePerCity.join(cities, { by: ['city', 'city'] })

  // Step 1: creating the scales for the scatterplot
  const scalePopulation = scaleLinear().domain(avocadoPricePerCity.domain('population'))
  const scaleVolume = scaleLinear().domain(avocadoPricePerCity.domain('avgVolumeEntirePeriod'))

  // Step 2: setting up hovering
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

  // Step 3: creating the geo-scales for the map
  const geoScales = fitScales(states.domain('$geometry'))

  // Step 4: allowing switching between the map and the scatterplot 
  let currentVisualization = 'scatterplot'

  $: scales = currentVisualization === 'scatterplot'
    ? { scaleX: scalePopulation, scaleY: scaleVolume }
    : geoScales

  // Step 5: adding a hover effect
  $: currentLineData = currentKey
    ? avocadoDataGrouped.row(currentKey).$grouped.arrange({ date: (a, b) => a - b })
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

<Graphic width={1200} height={600} scaleX={[0, 1200]} scaleY={[0, 600]}>

  <Section
    x1={0} x2={600}
    padding={70}
    {...scales}
    flipY
  >

    {#if currentVisualization === 'map'}

      <PolygonLayer 
        geometry={states.column('$geometry')}
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
        stroke="#32CD32"
      />

      <XAxis labelRotate={-30} labelOffset={10} />
      <YAxis />
  
  </Section>

  {/if}

</Graphic>

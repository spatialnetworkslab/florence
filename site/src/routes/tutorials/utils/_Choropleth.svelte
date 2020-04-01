<script>
  import { Graphic, Section, PolygonLayer, createGeoScales, Title, DiscreteLegend } from '@snlab/florence';
  import DataContainer from '@snlab/florence-datacontainer';
  import { scaleThreshold } from 'd3-scale'

  export let switch1 = false
  export let switch2 = false
  export let switch3 = false

  // import data
  // step1
  import { geodata } from './planning_areas_data.js'
  const data = new DataContainer(geodata)
  const geoScales = createGeoScales(data.domain('$geometry'))

  // step 2
  // compute color scaling
  const colors = ['#d3d3d3', '#fff0d2', '#FDD1A5', '#FD9243', '#982f05', '#4e1802']
  const resalePriceDomain = data.domain('resale_price_sqm')
  const thresholds = []
  const interval = Math.floor((resalePriceDomain[1] - resalePriceDomain[0]) / colors.length)
  let start = Math.floor(resalePriceDomain[0])

  for (let i = 0; i < colors.length; i += 1) {
    thresholds.push(start + interval * i)
  }

  // step 3
  // assign colors
  const priceColorScale = scaleThreshold().domain(thresholds).range(colors)
  const priceColors = data.map('resale_price_sqm', priceColorScale)
</script>


<Graphic width={500} height={500}>

  <Section
    {...geoScales}
    flipY
  >
    <!-- steps 1, 2 and 3 -->
    <PolygonLayer 
      geometry={data.column('$geometry')}
      fill={switch1 ? priceColors : '#d3d3d3'}
      stroke={'white'} 
      strokeWidth={1}
    />
    
    {#if switch2}
      <!-- step 4 (optional) -->
      <Title
        title={'Mean resale price per m2 (S$)'} 
        titleFontFamily={'Montserrat'}
      />
    {/if}
    
    <!-- step 5 (optional) -->
    {#if switch3}
      <DiscreteLegend
        fill={priceColorScale}
        vjust={'top'}
        hjust={'right'}
        labelAnchorPoint={'r'}
        usePadding={true}
        title={'Mean Resale Price / m2 (SGD)'}
        labelFontSize={12}
        orient={'horizontal'}
        height={25}
        width={250}
        stroke={'white'}
        flipLabels
      />
    {/if}
  </Section>
</Graphic>
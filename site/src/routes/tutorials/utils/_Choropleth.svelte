<script>
  import { Graphic, Section, PolygonLayer, createGeoScales, DiscreteLegend } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
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

  // obtain bins from DataContainer method
  const binsData = data.dropNA('resale_price_sqm').bin({ groupBy: 'resale_price_sqm', method: 'EqualInterval', numClasses: colors.length - 2 })
  
  // Obtain bins from data container
  const bins = binsData.column('bins')

  // Flatten bins array into individual numbers: [[a, b], [b, c], [c, d]...] => [a, b, b, c, c, d...]
  // Get unique values from array and turn them into integers
  let thresholds = []
  for (let i = 0; i < bins.length; i += 1) {
    if (i === 0) {
      thresholds.push(Math.floor(bins[i][0]))
      thresholds.push(Math.floor(bins[i][1]))
    } else {
      thresholds.push(Math.floor(bins[i][1]))
    }
  }

  // step 3
  // assign colors
  const priceColorScale = scaleThreshold().domain(thresholds).range(colors)
  const priceColors = data.map('resale_price_sqm', priceColorScale)
</script>


<Graphic width={500} height={500}>

  <Section
    {...geoScales}
    padding={switch2 ? 30 : 0}
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
      <!-- <Title
        title={'Mean resale price per m2 (S$)'} 
        titleFontFamily={'Montserrat'}
        usePadding={true}
      /> -->
    {/if}
    
    <!-- step 5 (optional) -->
    {#if switch3}
      <!-- <DiscreteLegend
        fill={priceColorScale}
        labelAnchorPoint={'r'}
        title={'Mean Resale Price / m2 (SGD)'}
        orient={'horizontal'}
        vjust={'top'}
        hjust={'right'}
        flipLabels
        usePadding={true}
      /> -->
    {/if}
  </Section>
</Graphic>
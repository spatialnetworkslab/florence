<script>
  import { Graphic, Section, PolygonLayer, createGeoScales, DiscreteLegend } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleThreshold } from 'd3-scale'

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
    <!-- step 1 and 2 -->
    <PolygonLayer 
      geometry={data.column('$geometry')}
      fill={priceColors}
      stroke={'white'} 
      strokeWidth={1}
    />

  </Section>

</Graphic>
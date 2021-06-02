<script>
  import { 
    Graphic, Section, PolygonLayer, fitScales, DiscreteLegend, getClassLabels
  } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleThreshold } from 'd3-scale'

  // import data
  // step1
  import geo from '../data/planning_areas_data.json'
  const data = new DataContainer(geo)
  const geoScales = fitScales(data.bbox())

  // step 2
  // compute color scaling
  const colors = ['#d3d3d3', '#fff0d2', '#FDD1A5', '#FD9243', '#982f05', '#4e1802']
  const priceColorScale = data
    .dropNA('resale_price_sqm')
    .classify(
      { column: 'resale_price_sqm', method: 'EqualInterval', numClasses: colors.length },
      colors
    )
  
  // step 3
  const priceColors = data.map('resale_price_sqm', priceColorScale)
</script>

<Graphic width={500} height={500}>

  <Section
    {...geoScales}
    padding={30}
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

  <DiscreteLegend
    x1={0.6} x2={0.9}
    y1={0} y2={0.2}
    fill={colors}
    labels={getClassLabels(priceColorScale, Math.floor)}
  />

</Graphic>
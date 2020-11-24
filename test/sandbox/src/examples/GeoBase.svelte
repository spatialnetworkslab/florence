<script>
  import { Graphic, Section, PolygonLayer, createGeoScales, DiscreteLegend, Title } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleThreshold } from 'd3-scale'

  // import data
  // step1
  import geo from '../data/planning_areas_data.json'
  const data = new DataContainer(geo)
  const geoScales = createGeoScales(data.bbox())

  // step 2
  // compute color scaling
  const colors = ['#d3d3d3', '#fff0d2', '#FDD1A5', '#FD9243', '#982f05', '#4e1802']
  const priceColorScale = data
    .dropNA('resale_price_sqm')
    .classify(
      { column: 'resale_price_sqm', method: 'EqualInterval', numClasses: colors.length - 2 },
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

    <!-- step 4 (optional) -->
    <DiscreteLegend
      fill={priceColorScale}
      labelAnchorPoint={'r'}
      title={'Mean Resale Price / m2 (SGD)'}
      orient={'horizontal'}
      vjust={'top'}
      hjust={'right'}
      flipLabels
      usePadding={true}
    />
    <Title
      title={'Mean resale price per m2 (S$)'} 
      titleFontFamily={'Montserrat'}
      usePadding={true}
    />
  </Section>


</Graphic>
<script>
  import { geojson } from './planning_areas_data.js'
  import { 
    Graphic, Section, PolygonLayer, createGeoScales,
    Label, DiscreteLegend, getClassLabels
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  const COLORS = ['#fff0d2', '#FDD1A5', '#FD9243', '#982f05', '#4e1802']

  const convertNullToUndefined = value => value === null ? undefined : value

  const dataContainer = new DataContainer(geojson)
    .mutate({ resale_price_sqm: r => convertNullToUndefined(r.resale_price_sqm) })

  const geoScales = createGeoScales(dataContainer.bbox())

  const priceColorScale = dataContainer
    .dropNA('resale_price_sqm')
    .classify(
      { column: 'resale_price_sqm', method: 'EqualInterval', numClasses: 5 },
      COLORS
    )
    .unknown('#d3d3d3')
</script>

<Graphic width={500} height={500}>

  <Section
    padding={30}
    {...geoScales}
    flipY
  >
    
    <PolygonLayer 
      geometry={dataContainer.column('$geometry')}
      fill={dataContainer.map('resale_price_sqm', priceColorScale)}
      stroke={'white'} 
      strokeWidth={1}
    />

  </Section>

  <Label
    x={250}
    y={70}
    text={'Mean resale price per m2 (S$)'}
    fontFamily={'Montserrat'}
    fontSize={18}
  />

  <DiscreteLegend
    x1={300} x2={400}
    y1={0} y2={100}
    labels={getClassLabels(priceColorScale, Math.floor)}
    fill={priceColorScale.range()}
  >

    <Label
      x={0.5}
      y={0.1}
      text={'Mean Resale Price / m2 (SGD)'}
      fontSize={14}
    />

  </DiscreteLegend>

</Graphic>

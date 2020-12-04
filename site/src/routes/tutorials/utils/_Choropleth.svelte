<script>
  import { json } from 'd3-fetch'
  import { 
    Graphic, Section, PolygonLayer, createGeoScales,
    Label, DiscreteLegend, getClassLabels
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  const COLORS = ['#fff0d2', '#FDD1A5', '#FD9243', '#982f05', '#4e1802']

  let dataContainer, geoScales, priceColorScale, ready

  (async () => {
    const geojson = await json('/data/plan_areas_choropleth.json')
    dataContainer = new DataContainer(geojson).mutate({ 
      resale_price_sqm: r => r.resale_price_sqm === null ? undefined : r.resale_price_sqm
    })
    geoScales = createGeoScales(dataContainer.bbox())

    priceColorScale = dataContainer
      .dropNA('resale_price_sqm')
      .classify({
        column: 'resale_price_sqm', method: 'EqualInterval', numClasses: 5
      }, COLORS)
      .unknown('#d3d3d3')

    ready = true
  })()
</script>

{#if ready}

  <Graphic
    width={400}
    height={400}
  >

    <Section
      {...geoScales}
      flipY
      padding={30}
    >
    
      <PolygonLayer 
        geometry={dataContainer.column('$geometry')}
        fill={dataContainer.map('resale_price_sqm', priceColorScale)}
        stroke={'white'} 
        strokeWidth={1}
      />

    </Section>

    <Label
      x={200}
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
        x1={0.5}
        y1={0.1}
        text={'Mean Resale Price / m2 (SGD)'}
        fontSize={14}
      />

    </DiscreteLegend>

  </Graphic>

{/if}
<script>
  import { json } from 'd3-fetch'
  import { 
    Graphic, PolygonLayer, createGeoScales, Title, DiscreteLegend 
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
    width={500}
    height={500}
    {...geoScales}
    flipY
    padding={30}
  >

    <Title
      title={'Mean resale price per m2 (S$)'} 
      titleFontFamily={'Montserrat'}
      usePadding={true}
    />

    <PolygonLayer 
      geometry={dataContainer.column('$geometry')}
      fill={dataContainer.map('resale_price_sqm', priceColorScale)}
      stroke={'white'} 
      strokeWidth={1}
    />
    
    <DiscreteLegend
      fill={priceColorScale}
      labelAnchorPoint={'r'}
      title={'Mean Resale Price / m2 (SGD)'}
      orient={'horizontal'}
      vjust={'top'}
      hjust={'right'}
      flipLabels
      usePadding={true}
      format={Math.floor}
    />

  </Graphic>

{/if}
<script>
  import { json } from 'd3-fetch'
  import { 
    Graphic, PolygonLayer, createGeoScales, Title, DiscreteLegend 
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  const COLORS = ['#d3d3d3', '#fff0d2', '#FDD1A5', '#FD9243', '#982f05', '#4e1802']

  let dataContainer, geoScales, priceColorScale

  (async () => {
    const geojson = await json('/data/plan_areas_choropleth.json')
    dataContainer = new DataContainer(geojson).dropNA('resale_price_sqm')
    geoScales = createGeoScales(data.domain('$geometry'))

    priceColorScale = dataContainer.classify({
      column: 'resale_price_sqm', method: 'Jenks', numClasses: COLORS.length
    }, COLORS)
  })()
</script>

{#if dataContainer}

  <Graphic>

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
    />

  </Graphic>

{/if}
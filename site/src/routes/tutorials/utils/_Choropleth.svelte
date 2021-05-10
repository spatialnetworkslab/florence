<script>
  import { 
    Graphic, Section, PolygonLayer, fitScales,
    Label, DiscreteLegend, getClassLabels
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { geojson } from './planning_areas_data.js'

  export let switchColor = false
  export let switchTitle = false
  export let switchLegend = false

  const convertNullToUndefined = value => value === null ? undefined : value

  const dataContainer = new DataContainer(geojson)
    .mutate({ resale_price_sqm: r => convertNullToUndefined(r.resale_price_sqm) })

  const geoScales = fitScales(dataContainer.bbox())

  const COLORS = ['#fff0d2', '#FDD1A5', '#FD9243', '#982f05', '#4e1802']
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
    {...geoScales}
    flipY
  >
    
    <PolygonLayer 
      geometry={dataContainer.column('$geometry')}
      fill={switchColor ? dataContainer.map('resale_price_sqm', priceColorScale) : '#d3d3d3'}
      stroke={'white'} 
      strokeWidth={1}
    />

  </Section>

  {#if switchTitle}
    <Label
      x={250}
      y={70}
      text={'Mean resale price per m2 (S$)'}
      fontFamily={'Montserrat'}
      fontSize={18}
    />
  {/if}

  {#if switchLegend}
    <DiscreteLegend
      x1={300} x2={400}
      y1={300} y2={400}
      labels={getClassLabels(priceColorScale, Math.floor)}
      fill={COLORS}
    />
  {/if}

</Graphic>

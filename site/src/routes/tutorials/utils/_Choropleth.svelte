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
      x={0.5}
      y={0.14}
      text={'Mean resale price per m2 (S$)'}
      fontFamily={'Montserrat'}
      fontSize={18}
    />
  {/if}

  {#if switchLegend}
    <DiscreteLegend
      x1={0.75} x2={1}
      y1={0.75} y2={1}
      labels={getClassLabels(priceColorScale, Math.floor)}
      fill={COLORS}
    />
  {/if}

</Graphic>

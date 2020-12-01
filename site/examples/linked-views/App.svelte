<script>
  import { scaleBand } from 'd3-scale'
  import { json } from 'd3-fetch'
  import { tick } from 'svelte'
  import {
    Graphic,
    Section,
    createGeoScales,
    PolygonLayer,
    RectangleLayer,
    XAxis,
    YAxis,
    Title,
    DiscreteLegend
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  const COLORS = [
    '#d3d3d3',
    '#fff0d2',
    '#FDD1A5',
    '#FD9243',
    '#982f05',
    '#4e1802'
  ]

  const yearScale = scaleBand()
    .domain([2015, 2016, 2017, 2018, 2019])
    .padding(0.1)
    
  const monthScale = scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    .padding(0.1)

  let geoData, timeData, heatmapData, geoScales, priceColorScale, ready

  (async () => {
    geoData = new DataContainer(await json('/data/base_map.json'))
      .rename({ PLN_AREA_N: 'town' })

    timeData = new DataContainer(await json('/data/time.json'))
      .groupBy('town')

    geoData.setKey('town')
    timeData.setKey('town')

    geoScales = createGeoScales(geoData.bbox())

    priceColorScale = geoData
      .dropNA('resale_price_sqm')
      .classify({ 
        column: 'resale_price_sqm', 
        method: 'EqualInterval',
        numClasses: COLORS.length
      }, COLORS)

    ready = true
  })()

  let hoverKey

  function onMouseover({ key }) {
    hoverKey = key

    if (timeData.hasRow({ key })) {
      heatmapData = timeData.row({ key }).$grouped
    }
  }

  function onMouseout({ key }) {
    hoverKey = undefined
    heatmapData = undefined
  }
</script>

{#if ready}

  <Graphic width={500} height={800}>

    <Section
      y1={0} y2={400}
      {...geoScales}
      padding={25}
      flipY
    >

      <PolygonLayer
        geometry={geoData.column('$geometry')}
        key={geoData.keys()}
        fill={geoData.map('resale_price_sqm', priceColorScale)}
        fillOpacity={({ key }) => hoverKey === key ? 1 : 0.5}
        stroke={'white'}
        strokeWidth={1}
        {onMouseover}
        {onMouseout}
        transition={1000}
      />

      <!-- <DiscreteLegend
        fill={priceColorScale}
        labelAnchorPoint={'r'}
        title={'Ave. Resale Price/m2 (S$)'}
        orient={'horizontal'}
        vjust={'top'}
        hjust={'right'}
        flipLabels
        usePadding={true}
      /> -->
    
    </Section>

    <Section 
      y1={400} y2={800}
      scaleX={monthScale}
      scaleY={yearScale}
      padding={50}
    >

      {#if heatmapData}

        <RectangleLayer 
          x1={heatmapData.column('month')}
          x2={({ scaleX }) => heatmapData.map('month', m => scaleX(m) + scaleX.bandwidth())}
          y1={heatmapData.column('year')}
          y2={({ scaleY }) => heatmapData.map('year', y => scaleY(y) + scaleY.bandwidth())}
          fill={heatmapData.map('resale_price_sqm', priceColorScale)}
        />

        <XAxis flip vjust={'top'} baseLineOpacity={0} yOffset={3}/> 
        <YAxis baseLineOpacity={0} xOffset={3}/>

      {/if}

      <Title 
        title={heatmapData ? hoverKey : 'Hover over an area in the map'} 
        titleFill={hoverKey ? 'black' : 'gray'}
        titleFontFamily={'Montserrat'} 
        yOffset={-30}
        usePadding={true}
      />

    </Section>
  
  </Graphic>

{/if}

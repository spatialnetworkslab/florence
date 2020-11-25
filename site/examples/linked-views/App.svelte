<script>
  import { scaleBand } from 'd3-scale'
  import { json } from 'd3-fetch'
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

  let geoData, timeData, heatmapData, geoScales, priceColorScale

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
  })()

  let hoverKey

  function onMouseover({ key }) {
    hoverKey = key

    if (timeData.hasRow({ key })) {
      heatmapData = timeData.row({ key }).$grouped
    }
  }

  function onMouseout({ key }) {
    if (hoverKey) hoverKey = undefined
    heatmapData = undefined
  }
</script>

{#if geoData}

  <Graphic width={1000} height={800}>

    <Section
      x1={50} x2={475}
      y1={50} y2={350}
      {...geoScales}
      flipY
    >

      <PolygonLayer
        geometry={geoData.column('$geometry')}
        keys={geoData.keys()}
        fill={geoData.map('resale_price_sqm', priceColorScale)}
        fillOpacity={({ key }) => hoverKey === key ? 1 : 0.5}
        stroke={'white'}
        strokeWidth={1}
        {onMouseover}
        {onMouseout}
        transition={1000}
      />

      <DiscreteLegend
        fill={priceColorScale}
        labelAnchorPoint={'r'}
        title={'Ave. Resale Price/m2 (S$)'}
        orient={'horizontal'}
        vjust={'top'}
        hjust={'right'}
        flipLabels
        usePadding={true}
      />
    
    </Section>

    <Section 
      x1={50} x2={475}
      y1={350} y2={650}
      scaleY={yearScale}
      scaleX={monthScale}
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

<!-- <Graphic width={1000} height={800}
>   
  {#if timeDone && geoDone}  
    <Section
      x1={50} x2={475}
      y1={50} y2={350}
      {...geoScales}
      flipY
    >
      {#each mapData.rows() as row, i (row.$key)}
        <Polygon 
          geometry={row.$geometry}
          fill={priceColors[i]}
          fillOpacity={hoverKey === row.$key ? 1 : 0.5} 
          stroke={'white'} 
          strokeWidth={1}
          onMouseover={() => { onMouseover({ key: i, town: row.PLN_AREA_N }) }}
          onMouseout={() => { onMouseout({ key: i, town: row.PLN_AREA_N }) }}
          transition={1000}
        />
      {/each}

      <DiscreteLegend
        fill={priceColorScale}
        labelAnchorPoint={'r'}
        title={'Ave. Resale Price/m2 (S$)'}
        orient={'horizontal'}
        vjust={'top'}
        hjust={'right'}
        flipLabels
        usePadding={true}
      />
    </Section>

    <Section 
      x1={50} x2={475}
      y1={350} y2={650}
      scaleY={yearScale}
      scaleX={monthScale}
      padding={50}
    > 
    {#if heatmapData}
      {#each heatmapData.rows() as row, i (row.$key)}
        <Rectangle 
          x1={row.month}
          x2={({ scaleX }) => scaleX(row.month) + scaleX.bandwidth()}
          y1={row.year}
          y2={({ scaleY }) => scaleY(row.year) + scaleY.bandwidth()}
          fill={heatmapColors[i]}
        />
      {/each}
      <YAxis baseLineOpacity={0} xOffset={3}/>
      <XAxis flip vjust={'top'} baseLineOpacity={0} yOffset={3}/> 
    {/if}

      <Title 
        title={heatmapData ? hoverTown : 'Hover over an area in the map'} 
        titleFill={hoverTown ? 'black' : 'gray'}
        titleFontFamily={'Montserrat'} 
        yOffset={-30}
        usePadding={true}
      />
    </Section>
  {/if}
</Graphic> -->
<script>
  'use strict'
  // d3
  import { scaleLinear, scaleThreshold, scalePoint } from 'd3-scale'

  // florence
  import { Graphic, Section, fitScales, XAxis, YAxis, SymbolLayer, PolygonLayer, Polygon } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // geodata
  import geo from '../data/planning_areas_lonlat.json'
  import metadata from '../data/test.json'
  import time from '../data/time.json'
  
  // data storage / props
  let background
  let base
  let baseGeometry
  let geoScale
  let geometry

  // private variables
  let meanPriceDomain
  let meanLeaseDomain
  let meanFloorDomain

  let processedGeom

  let priceScale
  let leaseScale
  let floorScale

  let postBg
  let priceColors
  let leaseColors
  let floorColors

  let timeData
  timeData = new DataContainer(time)

  $: {
    base = new DataContainer(geo)
    baseGeometry = base.column('$geometry')
  }

  // process relevant data to get backgroundagons with mean price data
  background = new DataContainer(metadata)
  const bbox = background.domain('$geometry')
  geoScale = fitScales(bbox)
  geometry = background.column('$geometry')
  postBg = background.dropNA(['resale_price_sqm', 'remaining_lease', 'floor_area_sqm']) // remove na values
  processedGeom = postBg.column('$geometry')
  meanPriceDomain = postBg.domain('resale_price_sqm')
  meanLeaseDomain = postBg.domain('remaining_lease')
  meanFloorDomain = postBg.domain('floor_area_sqm')

  const items = 5
  const colors = ['#FFF5EB', '#FDD1A5', '#FD9243', '#DE4F05', '#7F2704']

  // create scale for coloring backgroundagons
  let priceDomain = [...Array(items)].map((x, y) => +(Math.floor(meanPriceDomain[0] / 1000) * 1000 + ((meanPriceDomain[1] - meanPriceDomain[0]) / items) * y).toFixed(0))
  let leaseDomain = [...Array(items)].map((x, y) => +(Math.floor(meanLeaseDomain[0] / 10) * 10 + ((meanLeaseDomain[1] - meanLeaseDomain[0]) / items) * y).toFixed(0))
  let floorDomain = [...Array(items)].map((x, y) => +(Math.floor(meanFloorDomain[0] / 10) * 10 + ((meanFloorDomain[1] - meanFloorDomain[0]) / items) * y).toFixed(0))

  priceScale = scaleThreshold()
    .domain(priceDomain)
    .range(colors)
  leaseScale = scaleThreshold()
    .domain(leaseDomain)
    .range(colors)
  floorScale = scaleThreshold()
    .domain(floorDomain)
    .range(colors)

  priceColors = postBg.map('resale_price_sqm', priceScale)
  leaseColors = postBg.map('remaining_lease', leaseScale)
  floorColors = postBg.map('floor_area_sqm', floorScale)
  console.log(priceColors)
  let hoverKey
  let hoverTown

  let clickKey
  let clickTown

  function onMouseover ({ key, town }) {
    hoverKey = key
    hoverTown = town
  }

  function onMouseout ({ key, town }) {
    if (hoverKey === key) hoverKey = undefined
    if (hoverTown === town) hoverTown = undefined
  }

  function onMousedown ({ key, town }) {
    clickKey = key
    clickTown = town
  }

  function onMouseup ({ key, town }) {
    if (clickKey === key) clickKey = undefined
    if (clickTown === town) clickTown = undefined
  }

  let heatmapData
  let heatmapPrice

  const yearScale = scalePoint().domain([2015, 2016, 2017, 2018, 2019]).padding(0.2)
  const monthScale = scalePoint().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).padding(0.2)

  let heatmapPriceColors

  $: {
    if (hoverTown !== undefined) {
      heatmapData = timeData.filter(row => row.town === hoverTown)
      priceDomain = [...Array(items)].map((x, y) => +(Math.floor(heatmapData.domain('resale_price_sqm')[0] / 1000) * 1000 + ((meanPriceDomain[1] - meanPriceDomain[0]) / items) * y).toFixed(0))
      heatmapPrice = scaleThreshold()
        .domain(priceDomain)
        .range(colors)

      heatmapPriceColors = heatmapData.map('resale_price_sqm', heatmapPrice)
    }
  }

  let transition = 250
</script>

<Graphic width={500} height={1000}
>     
   <Section 
    x1={20} x2={480}
    y1={50} y2={300}
    {...geoScale}
    padding={30}
    flipY
  > 
    <PolygonLayer geometry={baseGeometry} fill={'#d3d3d3'} stroke={'white'} strokeWidth={1} />
    <PolygonLayer geometry={geometry} fill={'white'} stroke={'white'} strokeWidth={1} />
    {#each background.rows() as row, i (row.$key)}
      <Polygon geometry={row.$geometry} 
        fillOpacity={hoverKey === row.$key ? 1 : 0.8}
        stroke={'white'} 
        strokeWidth={2} 
        fill={priceColors[row.$key]}
        onMouseover={() => { onMouseover({ key: row.$key, town: row.PLN_AREA_N }) }}
        onMouseout={() => { onMouseout({ key: row.$key, town: row.PLN_AREA_N }) }}
        onMousedown={() => { onMousedown({ key: row.$key, town: row.PLN_AREA_N }) }}
        onMouseup={() => { onMouseup({ key: row.$key, town: row.PLN_AREA_N }) }}
        />
    {/each}

  </Section>

  {#if hoverTown}
    <Section 
      x1={100} x2={350}
      y1={350} y2={480}
      scaleY={yearScale}
      scaleX={monthScale}
      padding={36}
      flipY
    > 
        <SymbolLayer
          x={heatmapData.column('adjMonth')}
          y={heatmapData.column('adjYear')}
          shape={'square'}
          fill={heatmapPriceColors}
          radius={8}
        />
        <YAxis baseLineOpacity={0} xOffset={6} />
        <XAxis flip vjust={'top'} baseLineOpacity={0} yOffset={6} />

    </Section>
  {/if}
</Graphic>
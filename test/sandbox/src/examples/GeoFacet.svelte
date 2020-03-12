<script>
  'use strict'
  // d3
  import { scaleLinear, scaleThreshold } from 'd3-scale'

  // florence
  import { Graphic, Section, createGeoScales, PolygonLayer, Polygon, DiscreteLegend } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // geodata
  import geo from '../data/planning_areas_lonlat.json'
  import metadata from '../data/test.json'
  
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

  $: {
    base = new DataContainer(geo)
    baseGeometry = base.column('$geometry')
  }

  // process relevant data to get backgroundagons with mean price data
  $: {
    background = new DataContainer(metadata)
    const bbox = background.domain('$geometry')
    geoScale = createGeoScales(bbox)
    geometry = background.column('$geometry')
    postBg = background.dropNA(['resale_price_sqm', 'remaining_lease', 'floor_area_sqm']) // remove na values
    processedGeom = postBg.column('$geometry')
    meanPriceDomain = postBg.domain('resale_price_sqm')
    meanLeaseDomain = postBg.domain('remaining_lease')
    meanFloorDomain = postBg.domain('floor_area_sqm')
  }

  $: {
    // create scale for coloring backgroundagons
    const items = 5
    const colors = ['#FFF5EB', '#FDD1A5', '#FD9243', '#DE4F05', '#7F2704']

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
  }

  let hoverKey

  function onMouseover ({ key }) {
    hoverKey = key
    console.log(hoverKey)
  }

  function onMouseout ({ key }) {
    if (hoverKey === key) hoverKey = undefined
  }

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
    <PolygonLayer geometry={baseGeometry} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
    <PolygonLayer geometry={geometry} fill={'white'} stroke={'white'} strokeWidth={2} />
    {#each background.rows() as row, i (row.$key)}
      <Polygon geometry={row.$geometry} 
        fillOpacity={hoverKey === row.$key ? 1 : 0.5} 
        transition={750}
        stroke={'white'} 
        strokeWidth={2} 
        key={row.$key}
        fill={priceColors[row.$key]}
        onMouseover={() => { onMouseover({ key: row.$key }) }}
        onMouseout={() => { onMouseout({ key: row.$key }) }}
        />
    {/each}

    <DiscreteLegend
      fill={priceScale}
      vjust={'bottom'}
      hjust={'right'}
      labelAnchorPoint={'bl'}
      usePadding={true}
      title={'Mean Price (SGD)'}
      titlePaddingY={-8}
      orient={'horizontal'}
      height={30}
      width={150}
      stroke={'white'}
    />
  </Section>

  <!-- <Section 
    x1={20} x2={480}
    y1={350} y2={600}
    {...geoScale}
    padding={20}
    flipY
  > 
    <PolygonLayer geometry={geometry} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
    <PolygonLayer geometry={processedGeom} fill={leaseColors} stroke={'white'} strokeWidth={2} />
    <DiscreteLegend
      fill={leaseScale}
      vjust={'top'}
      hjust={'right'}
      labelAnchorPoint={'bl'}
      labelPaddingX={-5}
      usePadding={true}
      title={'Mean Lease (Years)'}
      titlePaddingY={-8}
      orient={'horizontal'}
      height={30}
      width={150}
      stroke={'white'}
    />
  </Section>

  <Section 
    x1={20} x2={480}
    y1={650} y2={900}
    {...geoScale}
    padding={20}
    flipY
  > 
    <PolygonLayer geometry={geometry} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
    <PolygonLayer geometry={processedGeom} fill={floorColors} stroke={'white'} strokeWidth={2} />

    <DiscreteLegend
      fill={floorScale}
      vjust={'top'}
      hjust={'right'}
      labelAnchorPoint={'bl'}
      labelPaddingX={-5}
      usePadding={true}
      title={'Mean Floor Area (m2)'}
      titlePaddingY={-8}
      orient={'horizontal'}
      height={30}
      width={150}
      stroke={'white'}
    />
  </Section> -->
</Graphic>
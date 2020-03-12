<script>
  'use strict'
  // d3
  import { scaleLinear, scaleThreshold } from 'd3-scale'

  // florence
  import { Graphic, Section, createGeoScales, PolygonLayer, DiscreteLegend } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // geodata
  import sg from '../data/planning_areas.json'
  import hexagons from '../data/hex_grid.json'
  
  // data storage
  let background
  let hex
  let geoScale
  let hexGeom
  let meanPriceDomain
  let meanLeaseDomain
  let meanFloorDomain

  let processedGeom

  let priceScale
  let leaseScale
  let floorScale

  let processedHex
  let priceColors
  let leaseColors
  let floorColors

  // upload data
  $: {
    background = new DataContainer(sg)
    const bbox = background.domain('$geometry')
    geoScale = createGeoScales(bbox)
  }

  // process relevant data to get hexagons with mean price data
  $: {
    hex = new DataContainer(hexagons)
    // const hexBbox = hex.domain('$geometry')
    hexGeom = hex.column('$geometry')
    processedHex = hex.dropNA(['mean_price', 'mean_lease', 'mean_floor_area']) // remove na values
    processedGeom = processedHex.column('$geometry')
    meanPriceDomain = processedHex.domain('mean_price')
    meanLeaseDomain = processedHex.domain('mean_lease')
    meanFloorDomain = processedHex.domain('mean_floor_area')
  }

  $: {
    // create scale for coloring hexagons
    const items = 5
    const colors = ['#FFF5EB', '#FDD1A5', '#FD9243', '#DE4F05', '#7F2704']

    let priceDomain = [...Array(items)].map((x, y) => +(Math.floor(meanPriceDomain[0] / 1000) * 1000 + ((meanPriceDomain[1] - meanPriceDomain[0]) / items) * y).toFixed(0))
    let leaseDomain = [...Array(items)].map((x, y) => +(Math.floor(meanLeaseDomain[0] / 10) * 10 + ((meanLeaseDomain[1] - meanLeaseDomain[0]) / items) * y).toFixed(0))
    let floorDomain = [...Array(items)].map((x, y) => +(Math.floor(meanFloorDomain[0] / 10) * 10 + ((meanFloorDomain[1] - meanFloorDomain[0]) / items) * y).toFixed(0))

    console.log(leaseDomain, floorDomain)
    priceScale = scaleThreshold()
      .domain(priceDomain)
      .range(colors)
    leaseScale = scaleThreshold()
      .domain(leaseDomain)
      .range(colors)
    floorScale = scaleThreshold()
      .domain(floorDomain)
      .range(colors)

    priceColors = processedHex.map('mean_price', priceScale)
    leaseColors = processedHex.map('mean_lease', leaseScale)
    floorColors = processedHex.map('mean_floor_area', floorScale)
  }
</script>

<Graphic width={500} height={1000}
>     
   <Section 
    x1={20} x2={480}
    y1={50} y2={300}
    {...geoScale}
    padding={20}
    flipY
  > 
    <PolygonLayer geometry={hexGeom} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
    <PolygonLayer geometry={processedGeom} fill={priceColors} stroke={'white'} strokeWidth={2} />
    <DiscreteLegend
      fill={priceScale}
      vjust={'top'}
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

  <Section 
    x1={20} x2={480}
    y1={350} y2={600}
    {...geoScale}
    padding={20}
    flipY
  > 
    <PolygonLayer geometry={hexGeom} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
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
    <PolygonLayer geometry={hexGeom} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
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
  </Section>
</Graphic>
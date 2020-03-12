<script>
  'use strict'
  // d3
  import { scaleLinear, scaleThreshold } from 'd3-scale'

  import { schemeBlues } from 'd3-scale-chromatic'

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
  let bgGeom
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
    bgGeom = background.column('$geometry')
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
    const items = 6

    let priceDomain = [...Array(items)].map((x, y) => +(Math.floor(meanPriceDomain[0] / 1000) * 1000 + ((meanPriceDomain[1] - meanPriceDomain[0]) / items) * y).toFixed(0))
    let leaseDomain = [...Array(items)].map((x, y) => +(Math.floor(meanLeaseDomain[0] / 10) * 10 + ((meanLeaseDomain[1] - meanLeaseDomain[0]) / items) * y).toFixed(0))
    let floorDomain = [...Array(items)].map((x, y) => +(Math.floor(meanFloorDomain[0] / 10) * 10 + ((meanFloorDomain[1] - meanFloorDomain[0]) / items) * y).toFixed(0))

    console.log(leaseDomain, floorDomain)
    priceScale = scaleThreshold()
      .domain(priceDomain)
      .range(['#FFF5EB', '#FDD1A5', '#FD9243', '#DE4F05', '#7F2704'])
    leaseScale = scaleThreshold()
      .domain(leaseDomain)
      .range(['#FFF5EB', '#FDD1A5', '#FD9243', '#DE4F05', '#7F2704'])
    floorScale = scaleThreshold()
      .domain(floorDomain)
      .range(['#FFF5EB', '#FDD1A5', '#FD9243', '#DE4F05', '#7F2704'])

    priceColors = processedHex.map('mean_price', priceScale)
    leaseColors = processedHex.map('mean_lease', leaseScale)
    floorColors = processedHex.map('mean_floor_area', floorScale)
  }
</script>

<Graphic width={500} height={1000}
>     
   <Section 
    x1={20} x2={480}
    y1={300} y2={50}
    {...geoScale}
    padding={10}
  > 
    <PolygonLayer geometry={hexGeom} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
    <PolygonLayer geometry={processedGeom} fill={priceColors} stroke={'white'} strokeWidth={2} />

    <DiscreteLegend
      fill={priceScale}
      usePadding={true}
    />
  </Section>

  <Section 
    x1={20} x2={480}
    y1={600} y2={350}
    {...geoScale}
    padding={10}
  > 
    <PolygonLayer geometry={hexGeom} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
    <PolygonLayer geometry={processedGeom} fill={leaseColors} stroke={'white'} strokeWidth={2} />
  </Section>

  <Section 
    x1={20} x2={480}
    y1={900} y2={650}
    {...geoScale}
    padding={10}
  > 
    <PolygonLayer geometry={hexGeom} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
    <PolygonLayer geometry={processedGeom} fill={floorColors} stroke={'white'} strokeWidth={2} />
  </Section>
<!-- 
  <Section 
    x1={20} x2={480}
    y1={900} y2={500}
    {...geoScale}
    padding={10}
  > 
    <PolygonLayer geometry={hexGeom} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
    <PolygonLayer geometry={processedGeom} fill={processedHex.map('mean_lease', leaseScale)} stroke={'white'} strokeWidth={2} />

  </Section> -->
</Graphic>
<script>
  'use strict'
  // d3
  import { scaleLinear, scaleThreshold } from 'd3-scale'

  // florence
  import { Graphic, Section, fitScales, PolygonLayer } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // geodata TODO CONVERT TO PLANNING AREA
  import hexagons from '../data/hex_grid.json'
  
  // data storage / props
  let background
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

  // process relevant data to get backgroundagons with mean price data
  $: {
    background = new DataContainer(hexagons)
    const bbox = background.bbox()
    geoScale = fitScales(bbox)
    geometry = background.column('$geometry')
    postBg = background.dropNA(['mean_price', 'mean_lease', 'mean_floor_area']) // remove na values
    processedGeom = postBg.column('$geometry')
    meanPriceDomain = postBg.domain('mean_price')
    meanLeaseDomain = postBg.domain('mean_lease')
    meanFloorDomain = postBg.domain('mean_floor_area')
  }

  $: {
    // create scale for coloring backgroundagons
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

    priceColors = postBg.map('mean_price', priceScale)
    leaseColors = postBg.map('mean_lease', leaseScale)
    floorColors = postBg.map('mean_floor_area', floorScale)
  }
</script>

<Graphic width={500} height={1000} scaleX={[0, 500]} scaleY={[0, 1000]}>     
   <Section 
    x1={20} x2={480}
    y1={50} y2={300}
    {...geoScale}
    padding={20}
    flipY
  > 
    <PolygonLayer geometry={geometry} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
    <PolygonLayer geometry={processedGeom} fill={priceColors} stroke={'white'} strokeWidth={2} />

  </Section>

  <Section 
    x1={20} x2={480}
    y1={350} y2={600}
    {...geoScale}
    padding={20}
    flipY
  > 
    <PolygonLayer geometry={geometry} fill={'#d3d3d3'} stroke={'white'} strokeWidth={2} />
    <PolygonLayer geometry={processedGeom} fill={leaseColors} stroke={'white'} strokeWidth={2} />

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

  </Section>
</Graphic>
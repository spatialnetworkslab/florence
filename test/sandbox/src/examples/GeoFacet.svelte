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
  let bgGeom

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
    <PolygonLayer geometry={bgGeom} fill={'#d3d3d3'} stroke={'white'} strokeWidth={1} />
  </Section>

  <!-- <Section 
    x1={20} x2={480}
    y1={350} y2={600}
    {...geoScale}
    padding={20}
    flipY
  > 
    <PolygonLayer geometry={bgGeom} fill={'#d3d3d3'} stroke={'white'} strokeWidth={1} />
  </Section>

  <Section 
    x1={20} x2={480}
    y1={650} y2={900}
    {...geoScale}
    padding={20}
    flipY
  > 
    <PolygonLayer geometry={bgGeom} fill={'#d3d3d3'} stroke={'white'} strokeWidth={1} />
  </Section> -->
</Graphic>
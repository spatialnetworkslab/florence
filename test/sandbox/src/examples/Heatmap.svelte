<script>
  'use strict'
  // d3
  import { scaleLinear, scalePoint } from 'd3-scale'
  import { schemeBlues } from 'd3-scale-chromatic'

  // florence
  import { Graphic, Section, SymbolLayer, PointLayer, RectangleLayer, Rectangle, DiscreteLegend, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // geodata
  import time from '../data/time.json'

  let data
  let years
  let months

  let priceScale
  let leaseScale
  let floorScale

  let priceDomain
  let leaseDomain
  let floorDomain

  // private
  const town = 'ANG MO KIO'

  // process relevant data to get time data relevant to town
  // $: {
  data = new DataContainer(time)
  data = data.filter(row => row.town === 'ANG MO KIO')
  years = data.domain('adjYear')
  months = data.domain('adjMonth')
  priceDomain = data.domain('resale_price_sqm')
  leaseDomain = data.domain('remaining_lease')
  floorDomain = data.domain('floor_area_sqm')
  // }

  const yearScale = scalePoint().domain([2015, 2016, 2017, 2018, 2019]).padding(0.2)
  const monthScale = scalePoint().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).padding(0.2)

  priceScale = scaleLinear()
    .domain(priceDomain)
    .range(['white', 'blue'])
  leaseScale = scaleLinear()
    .domain(leaseDomain)
    .range(['yellow', 'red'])
  floorScale = scaleLinear()
    .domain(floorDomain)
    .range(['yellow', 'red'])

  let priceColors = data.map('resale_price_sqm', priceScale)
  let leaseColors = data.map('remaining_lease', leaseScale)
  let floorColors = data.map('floor_area_sqm', floorScale)
</script>

<Graphic width={500} height={500}
>     
   <Section 
    x1={20} x2={240}
    y1={20} y2={140}
    padding={33}
    scaleY={yearScale}
    scaleX={monthScale}
    flipY
  > 

      <SymbolLayer
        x={data.column('adjMonth')}
        y={data.column('adjYear')}
        shape={'square'}
        fill={priceColors}
        size={14}
      />

    <!-- <Rectangle
      x1={0.5}
      x2={1.5}
      y1={0.5}
      y2={1.5}
      fill={'red'}
    /> -->

  <YAxis baseLineOpacity={0} xOffset={3}/>
  <XAxis flip vjust={'top'} baseLineOpacity={0} yOffset={3}/>

  <!-- xaxis, yaxis-->
  
  </Section>

</Graphic>
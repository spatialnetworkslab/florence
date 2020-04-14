<script>
  'use strict'
  // d3
  import { scaleThreshold, scaleBand } from 'd3-scale'
  import { schemeBlues } from 'd3-scale-chromatic'

  // florence
  import { Graphic, Section, Rectangle, XAxis, YAxis, Title, DiscreteLegend } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // step 0
  // heatmap data
  import { time } from '../data/time.js'
  let data
  let priceScale
  let priceDomain

  // town filter
  const town = 'ANG MO KIO'

  // step 4
  // process relevant data to get time data relevant to town
  data = new DataContainer(time)
  data = data.filter(row => row.town === town)
  
  // step 5: get time scales
  // time 
  const yearScale = scaleBand().domain([2015, 2016, 2017, 2018, 2019]).padding(0.1)
  const monthScale = scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).padding(0.1)

  // step 6
  // create scales for heatmaps
  const resalePriceDomain = data.domain('resale_price_sqm')
  const colors = ['#d3d3d3', '#fff0d2', '#FDD1A5', '#FD9243', '#982f05', '#4e1802']
  const thresholds = []
  const interval = Math.floor((resalePriceDomain[1] - resalePriceDomain[0]) / colors.length)
  let start = Math.floor(resalePriceDomain[0])

  for (let i = 0; i < colors.length - 1; i += 1) {
    thresholds.push(start + interval * i)
  }

  // step 4
  // assign colors
  const priceColorScale = scaleThreshold().domain(thresholds).range(colors)
  const priceColors = data.map('resale_price_sqm', priceColorScale)
  console.log(priceColors)
</script>

<Graphic width={1000} height={400}
>     

  <!-- step 1 -->
  <!-- step 3: add padding -->
   <Section 
    x1={50} x2={475}
    y1={50} y2={350}
    padding={50}
    scaleY={yearScale}
    scaleX={monthScale}
    backgroundColor={'#d3d3d3'}
  > 
    <!-- step 5-->
    {#each data.rows() as row (row.$key)}
      <Rectangle 
        x1={row.adjMonth}
        x2={({ scaleX }) => scaleX(row.adjMonth) + scaleX.bandwidth()}
        y1={row.adjYear}
        y2={({ scaleY }) => scaleY(row.adjYear) + scaleY.bandwidth()}
      />
    {/each}

    <!-- step 7 -->
    {#each data.rows() as row (row.$key)}
      <Rectangle 
        x1={row.adjMonth}
        x2={({ scaleX }) => scaleX(row.adjMonth) + scaleX.bandwidth()}
        y1={row.adjYear}
        y2={({ scaleY }) => scaleY(row.adjYear) + scaleY.bandwidth()}
        fill={priceColors[row.$key]}
      />
    {/each}

    <!-- step 2 -->
    <YAxis baseLineOpacity={0} xOffset={3}/>
    <XAxis flip vjust={'top'} baseLineOpacity={0} yOffset={3}/> 
  
    <Title title={town} yOffset={0} titleFontFamily={'Montserrat'} usePadding={true}/>
  </Section>

  <Section
    x1={525} x2={950}
    y1={50} y2={350}
    backgroundColor={'#d3d3d3'}
    flipY
  >

  </Section>
<!-- 
  <DiscreteLegend
      fill={priceColorScale}
      labelAnchorPoint={'r'}
      title={'Mean resale price/m2 (SGD)'}
      stroke={'white'}
      orient={'horizontal'}
      vjust={'bottom'}
      hjust={'center'}
    /> -->

</Graphic>
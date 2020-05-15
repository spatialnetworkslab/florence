<script>
  'use strict'
  // d3
  import { scaleThreshold, scaleBand } from 'd3-scale'

  // florence
  import { Graphic, Section, Rectangle, XAxis, YAxis, Title, PolygonLayer, createGeoScales, DiscreteLegend } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // step 0
  // import data
  import { time } from '../data/time.js'
  import { geoData } from '../data/planning_areas_data.js'

  // heatmaps 
  // town filter
  const town = 'ANG MO KIO'
  let heatmapData = new DataContainer(time)
  heatmapData = heatmapData.filter(row => row.town === town)

  // time scales
  const yearScale = scaleBand().domain([2015, 2016, 2017, 2018, 2019]).padding(0.1)
  const monthScale = scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).padding(0.1)

  // maps
  const mapData = new DataContainer(geoData)
  const geoScales = createGeoScales(mapData.domain('$geometry'))

  // step
  // create scales for heatmaps and maps
  const resalePriceDomain = mapData.domain('resale_price_sqm')
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
  const mapColors = mapData.map('resale_price_sqm', priceColorScale)
  const heatmapColors = heatmapData.map('resale_price_sqm', priceColorScale)
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
    {#each heatmapData.rows() as row (row.$key)}
      <Rectangle 
        x1={row.adjMonth}
        x2={({ scaleX }) => scaleX(row.adjMonth) + scaleX.bandwidth()}
        y1={row.adjYear}
        y2={({ scaleY }) => scaleY(row.adjYear) + scaleY.bandwidth()}
      />
    {/each}

    <!-- step 7 -->
    {#each heatmapData.rows() as row (row.$key)}
      <Rectangle 
        x1={row.adjMonth}
        x2={({ scaleX }) => scaleX(row.adjMonth) + scaleX.bandwidth()}
        y1={row.adjYear}
        y2={({ scaleY }) => scaleY(row.adjYear) + scaleY.bandwidth()}
        fill={heatmapColors[row.$key]}
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
    {...geoScales}
    flipY
  >

    <PolygonLayer 
      geometry={mapData.column('$geometry')}
      fill={mapColors}
      stroke={'white'} 
      strokeWidth={1}
    />

  </Section>

  <DiscreteLegend
      fill={priceColorScale}
      labelAnchorPoint={'r'}
      title={'Mean resale price/m2 (SGD)'}
      stroke={'white'}
      orient={'horizontal'}
      vjust={'bottom'}
      hjust={'center'}
    />

</Graphic>
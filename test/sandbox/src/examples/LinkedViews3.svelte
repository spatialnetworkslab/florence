<script>
  'use strict'
  // d3
  import { scaleThreshold, scaleBand } from 'd3-scale'

  // florence
  import {
    Graphic, Section, Rectangle, XAxis, YAxis, Title, PolygonLayer, Polygon,
    createGeoScales, DiscreteLegend
  } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // step 0
  // import data
  import { time } from '../data/time.js'
  import { geoData } from '../data/planning_areas_data.js'

  // heatmaps
  // town filter
  let timeData = new DataContainer(time)
  let heatmapData
  let heatmapColors

  // time scales
  const yearScale = scaleBand().domain([2015, 2016, 2017, 2018, 2019]).padding(0.1)
  const monthScale = scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).padding(0.1)

  // maps
  const mapData = new DataContainer(geoData)
  const geoScales = createGeoScales(mapData.domain('$geometry'))

  // step
  // create scales for heatmaps and maps
  const colors = ['#d3d3d3', '#fff0d2', '#FDD1A5', '#FD9243', '#982f05', '#4e1802']
  // obtain bins from DataContainer method
  const binsData = mapData.dropNA('resale_price_sqm').bin({ groupBy: 'resale_price_sqm', method: 'EqualInterval', numClasses: colors.length - 2 })
  
  // Obtain bins from data container
  const bins = binsData.column('bins')

  // Flatten bins array into individual numbers: [[a, b], [b, c], [c, d]...] => [a, b, b, c, c, d...]
  // Get unique values from array and turn them into integers
  let thresholds = []
  for (let i = 0; i < bins.length; i += 1) {
    if (i === 0) {
      thresholds.push(Math.floor(bins[i][0]))
      thresholds.push(Math.floor(bins[i][1]))
    } else {
      thresholds.push(Math.floor(bins[i][1]))
    }
  }

  // step 4
  // assign colors
  const priceColorScale = scaleThreshold().domain(thresholds).range(colors)
  const mapColors = mapData.map('resale_price_sqm', priceColorScale)

  // step x
  // create interaction functions
  let hoverKey
  let hoverTown

  function onMouseover ({ key, town }) {
    hoverKey = key
    hoverTown = town
    if (timeData.column('town').includes(hoverTown)) {
      heatmapData = timeData.filter(row => row.town === hoverTown)
      heatmapColors = heatmapData.map('resale_price_sqm', priceColorScale)
    }
  }

  function onMouseout ({ key, town }) {
    if (hoverKey === key) hoverKey = undefined
    if (hoverTown === town) hoverTown = undefined
    heatmapData = undefined
    heatmapColors = undefined
  }

  // last step
  let transition = 750
</script>

<Graphic width={1000} height={400}
>     
  <!-- step 1 -->
  <!-- step 3: add padding -->
   <Section 
    x1={525} x2={950}
    y1={50} y2={350}
    padding={50}
    scaleY={yearScale}
    scaleX={monthScale}
  > 

    <!-- step 7 -->
    {#if heatmapData}
      {#each heatmapData.rows() as row, i (row.$key)}
        <Rectangle 
          x1={row.adjMonth}
          x2={({ scaleX }) => scaleX(row.adjMonth) + scaleX.bandwidth()}
          y1={row.adjYear}
          y2={({ scaleY }) => scaleY(row.adjYear) + scaleY.bandwidth()}
          fill={heatmapColors[i]}
          {transition}
        />
      {/each}

      <!-- step 2 -->
      <YAxis baseLineOpacity={0} xOffset={3} {transition}/>
      <XAxis flip vjust={'top'} baseLineOpacity={0} yOffset={3} {transition}/> 
    {/if}

    <Title 
      title={heatmapData ? hoverTown : 'Hover over an area in the map'} 
      titleFill={heatmapData ? 'black' : 'gray'}
      titleFontFamily={'Montserrat'} 
      yOffset={-30}
      usePadding={true}/>

  </Section>

  <Section
    x1={50} x2={475}
    y1={50} y2={350}
    {...geoScales}
    flipY
  >
    {#each mapData.rows() as row, i (row.$key)}
      <Polygon 
        geometry={row.$geometry}
        fill={mapColors[row.$key]}
        fillOpacity={hoverKey === row.$key ? 1 : 0.7} 
        {transition}
        stroke={'white'} 
        strokeWidth={1}
        onMouseover={() => { onMouseover({ key: row.$key, town: row.PLN_AREA_N }) }}
        onMouseout={() => { onMouseout({ key: row.$key, town: row.PLN_AREA_N }) }}
      />
    {/each}
  </Section>

</Graphic>
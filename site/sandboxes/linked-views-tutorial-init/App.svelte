<script>
  'use strict'
  // d3
  import { scaleThreshold, scaleBand } from 'd3-scale'

  // florence
  import {
    Graphic, Section, createGeoScales, Polygon
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  // step 0
  // import data
  import { time } from '../time.js'
  import { geodata } from '../planning_areas_data.js'

  // heatmaps
  // town filter
  let timeData = new DataContainer(time)
  
  // time scales
  const yearScale = scaleBand().domain([2015, 2016, 2017, 2018, 2019]).padding(0.1)
  const monthScale = scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).padding(0.1)

  // maps
  const mapData = new DataContainer(geodata)
  const geoScales = createGeoScales(mapData.domain('$geometry'))

  // compute color scaling
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

  // assign colors
  const priceColorScale = scaleThreshold().domain(thresholds).range(colors)
  const priceColors = mapData.map('resale_price_sqm', priceColorScale)
</script>

<Graphic width={1000} height={400}
>     
  <Section
    x1={50} x2={475}
    y1={50} y2={350}
    {...geoScales}
    backgroundColor={'steelblue'}
    flipY
  >

    {#each mapData.rows() as row, i (row.$key)}
      <Polygon 
        geometry={row.$geometry}
        fill={priceColors[row.$key]}
        stroke={'white'} 
        strokeWidth={1}
      />
    {/each}

  </Section>
  <Section 
    x1={525} x2={950}
    y1={50} y2={350}
    backgroundColor={'coral'}
  > 
  </Section>
</Graphic>
<script>
  'use strict'
  // d3
  import { scaleThreshold, scaleBand } from 'd3-scale'

  // florence
  import {
    Graphic, Section, Rectangle, XAxis, YAxis, Title, PolygonLayer, Polygon,
    createGeoScales, Grid, DiscreteLegend
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
</script>

<Graphic width={1000} height={400}
>     
   <Section 
    x1={525} x2={950}
    y1={50} y2={350}
    padding={50}
    scaleY={yearScale}
    scaleX={monthScale}
    backgroundColor={'orange'}
  > 


  </Section>
  <Section
    x1={50} x2={475}
    y1={50} y2={350}
    {...geoScales}
    backgroundColor={'steelblue'}
    flipY
  >
  </Section>

</Graphic>
<script>
  'use strict'
  // d3
  import { scaleThreshold, scaleBand } from 'd3-scale'

  // florence
  import {
    Graphic, Section, createGeoScales, Polygon, XAxis, YAxis, Rectangle, Title, DiscreteLegend
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { json } from 'd3-fetch'

  // step 1
  // import data
  // import { time } from '../time.js'
  // import { geodata } from '../planning_areas_data.js'

  let geoDone = false
  let timeDone = false
  let geodata
  let time

  json('/data/base_map.json').then(d => {
    geodata = d
    geoDone = true
  })

  json('/data/time.json').then(d => {
    time = d
    timeDone = true
  })

  let geoScales
  let priceColors, priceColorScale
  let heatmapData, heatmapColors
  let timeData, mapData

  // time scales
  const yearScale = scaleBand().domain([2015, 2016, 2017, 2018, 2019]).padding(0.1)
  const monthScale = scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).padding(0.1)

  $: {
    if (geoDone && timeDone) {
      // heatmaps
      // town filter
      timeData = new DataContainer(time)

      // maps
      mapData = new DataContainer(geodata)
      geoScales = createGeoScales(mapData.domain('$geometry'))

      // step 2
      // compute color scaling
      const colors = ['#d3d3d3', '#fff0d2', '#FDD1A5', '#FD9243', '#982f05', '#4e1802']

      // obtain bins from DataContainer method
      const binsData = mapData.dropNA('resale_price_sqm').bin({ groupBy: 'resale_price_sqm', method: 'EqualInterval', numClasses: colors.length - 2 })

      // Obtain bins from data container
      const bins = binsData.column('bins')

      // Flatten bins array into individual numbers: [[a, b], [b, c], [c, d]...] => [a, b, b, c, c, d...]
      // Get unique values from array and turn them into integers
      const thresholds = []
      for (let i = 0; i < bins.length; i += 1) {
        if (i === 0) {
          thresholds.push(Math.floor(bins[i][0]))
          thresholds.push(Math.floor(bins[i][1]))
        } else {
          thresholds.push(Math.floor(bins[i][1]))
        }
      }

      // step 3
      // assign colors
      priceColorScale = scaleThreshold().domain(thresholds).range(colors)
      priceColors = mapData.map('resale_price_sqm', priceColorScale)
      if (heatmapData) {
        heatmapColors = heatmapData.map('resale_price_sqm', priceColorScale)
      }
    }
  }

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
    if (hoverKey) hoverKey = undefined
    if (hoverTown) hoverTown = undefined
    heatmapData = undefined
    heatmapColors = undefined
  }
</script>

<Graphic width={1000} height={400}
>   
  {#if timeDone && geoDone}  
    <Section
      x1={50} x2={475}
      y1={50} y2={350}
      {...geoScales}
      flipY
    >
      {#each mapData.rows() as row, i (row.$key)}
        <Polygon 
          geometry={row.$geometry}
          fill={priceColors[i]}
          fillOpacity={hoverKey === row.$key ? 1 : 0.5} 
          stroke={'white'} 
          strokeWidth={1}
          onMouseover={() => { onMouseover({ key: i, town: row.PLN_AREA_N }) }}
          onMouseout={() => { onMouseout({ key: i, town: row.PLN_AREA_N }) }}
          transition={1000}
        />
      {/each}

      <DiscreteLegend
        fill={priceColorScale}
        labelAnchorPoint={'r'}
        title={'Ave. Resale Price/m2 (S$)'}
        orient={'horizontal'}
        vjust={'top'}
        hjust={'right'}
        flipLabels
        usePadding={true}
      />
    </Section>

    <Section 
      x1={525} x2={950}
      y1={50} y2={350}
      scaleY={yearScale}
      scaleX={monthScale}
      padding={50}
    > 
    {#if heatmapData}
      {#each heatmapData.rows() as row, i (row.$key)}
        <Rectangle 
          x1={row.month}
          x2={({ scaleX }) => scaleX(row.month) + scaleX.bandwidth()}
          y1={row.year}
          y2={({ scaleY }) => scaleY(row.year) + scaleY.bandwidth()}
          fill={heatmapColors[i]}
        />
      {/each}
      <YAxis baseLineOpacity={0} xOffset={3}/>
      <XAxis flip vjust={'top'} baseLineOpacity={0} yOffset={3}/> 
    {/if}

      <Title 
        title={heatmapData ? hoverTown : 'Hover over an area in the map'} 
        titleFill={hoverTown ? 'black' : 'gray'}
        titleFontFamily={'Montserrat'} 
        yOffset={-30}
        usePadding={true}
      />
    </Section>
  {/if}
</Graphic>
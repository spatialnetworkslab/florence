<!-- 
  Replica of Mathieu Rajerison's (@datagistips) original work
  https://twitter.com/datagistips/status/1248508331263545344?s=20
-->
<script>
  import { scaleLinear, scaleTime } from 'd3-scale'

  import {
    Graphic,
    Section,
    PolygonLayer,
    PointLayer,
    Line,
    Point,
    Label,
    fitScales
  } from '@snlab/florence'
  import { loadPolygons, loadCSV } from './utils.js'

  // instead of a sudden change in the date, we set things up to tween/transition nicely
  // see: https://svelte.dev/tutorial/tweened
  // note that currentDate is a store (https://svelte.dev/docs#svelte_store)
  import { tweened } from 'svelte/motion'
  import { linear } from 'svelte/easing'

  const currentDate = tweened(new Date('2020-02-28'), {
    duration: 1000,
    easing: linear
  })

  // we will load data asychronously so we need a variable to keep track of this
  // otherwise we will attempt to draw a graph without the data loaded
  // done is set to true once data is loaded, and only then we will start drawing
  let done

  // data vars
  let provinces
  let cases
  let casesPerProvince
  let geoScales
  let casesPerProvinceFiltered
  let casesPerProvinceLastRow

  // we load the province and case data in two separate functions
  // data fetching is asynchronous is javascript
  // since we can't do anything until data is loaded we await all the async functions
  // N.B. nothing will happen until we execute the getData() function
  // province geo data from https://cartomap.github.io/nl/rd/provincie_2020.geojson
  // covid cases from https://github.com/J535D165/CoronaWatchNL/blob/master/data/rivm_NL_covid19_province.csv

  async function getData() {
    [provinces, cases] = await Promise.all([
      loadPolygons('data/provinces.geojson'),
      loadCSV('data/cases.csv')
    ]);

    // group data per province so it's easier to access
    casesPerProvince = cases.groupBy('province')

    // add x/y centroid to the case data for starting point of line
    casesPerProvince.join(provinces.select(['statnaam', 'x', 'y']), {
      by: ['province', 'statnaam']
    })

    // create geo-scales
    geoScales = fitScales(provinces.domain('$geometry'))
    done = true // this will trigger the actual drawing
  }

  // go get the data
  getData()

  // when the currentDate changes, we want to filter our chart data accordingly
  $: {
    if (done) {
      casesPerProvinceFiltered = casesPerProvince
        .rows()
        .map(province =>
          province.$grouped.filter(row => row.date <= $currentDate)
        )
      casesPerProvinceLastRow = casesPerProvinceFiltered.map(province => {
        const rows = province.rows()
        return rows[rows.length - 1]
      })
    }
  }

  function playReplay () {
    if ($currentDate > new Date('2020-04-11')) {
      currentDate.set(new Date('2020-02-28'))
    } else {
      currentDate.set(new Date('2020-04-12'))
    }
  }
</script>

<div class="graph">

  <label>Current date is {$currentDate.toLocaleDateString('en-GB')}</label>
  <button
    on:click={playReplay}
    type="button">
    Play animation
  </button>
  
  <div class="main-chart">
    <!-- we only display the graph once data is loaded -->
    {#if done}
      
      <Graphic width={400} height={500}>

        <!-- main section with geographic scales -->
        <Section padding={50} {...geoScales} flipY>

          <!-- one polygon for each province -->
          <PolygonLayer 
            geometry={provinces.column('$geometry')}
            fill={'rgb(230, 230, 230)'}
            stroke={'white'}
            strokeWidth={1}
          />

          <!-- we will create a section for each province, to draw the line chart -->
          <!-- each section will have its own coordinate system based on the max number of cases and date range -->
          {#each casesPerProvince.rows() as {x, y, $key}}
            <Section
              padding={{left: 1, right: 20, top: 15, bottom: 1}}
              x1={x}
              x2={x + 70000}
              y1={y}
              y2={y + 130000}
              scaleX={scaleTime().domain(cases.domain('date'))}
              scaleY={scaleLinear().domain(cases.domain('cases'))}
            >
             
             <!-- draw a single point at the start of the line -->
             <Point
                x={casesPerProvinceFiltered[$key].column('date')[0]}
                y={casesPerProvinceFiltered[$key].column('cases')[0]}
                radius={1.5}
              />

              <!-- the actual line chart -->
              <Line
                x={casesPerProvinceFiltered[$key].column('date')}
                y={casesPerProvinceFiltered[$key].column('cases')}
                strokeWidth={1}
              />

              <!-- draw a single point at the end of the line -->
              <!-- this point changes as the date changes -->
              <Point
                x={casesPerProvinceLastRow[$key]['date']}
                y={casesPerProvinceLastRow[$key]['cases']}
                radius={1.5}
              />

              <!-- draw a label to annote the number of cases -->
              <!-- this label changes as the date changes -->
              <!-- we use function syntax to position it 2 pixels to the right/top of the scaled last value -->
              <Label
                x={({ scaleX }) => scaleX(casesPerProvinceLastRow[$key]['date']) + 2}
                y={({ scaleY }) => scaleY(casesPerProvinceLastRow[$key]['cases']) - 2}
                text={casesPerProvinceLastRow[$key]['cases']}
                fontSize={8}
                anchorPoint={'lb'}
              />

            </Section>

            <!-- this section is mirrored from our normal line chart section -->
            <!-- the y2 prop is the only thing that changes -->
            <!-- we use it to draw the shadow line -->
            <Section
              padding={{left: 1, right: 20, top: 1, bottom: 15}}
              x1={x}
              x2={x + 70000}
              y1={y}
              y2={y - 120000}
              scaleX={scaleTime().domain(cases.domain('date'))}
              scaleY={scaleLinear().domain(cases.domain('cases'))}
            >
              <Line
                x={casesPerProvinceFiltered[$key].column('date')}
                y={casesPerProvinceFiltered[$key].column('cases')}
                stroke='rgba(100, 100, 100, 0.2)'
                strokeWidth={2}
              />
            </Section>
          {/each}
        </Section>
      </Graphic>
    
    {/if}
  </div>

</div>
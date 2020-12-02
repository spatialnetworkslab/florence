<script>
  import { autoType } from 'd3-dsv'
  import { csv } from 'd3-fetch'
  import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale'
  import { schemeSpectral } from 'd3-scale-chromatic'
  import { formatPrefix } from 'd3-format'
  import { Graphic, RectangleLayer, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  
  const ageGroups = [
    '<10', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '≥80'
  ]

  const dataURL = '/data/population-stacked-bars.csv'

  let dataContainer, maxX, groupedByState, scaleColor, ready

  (async () => {
    dataContainer = new DataContainer(await csv(dataURL, autoType))
      .rename({ name: 'state' })
      .rowCumsum(ageGroups, { asInterval: true })
      .pivotLonger({
        columns: ageGroups,
        namesTo: 'ageGroup',
        valuesTo: 'countInterval'
      })
      .mutate({ upper: r => r.countInterval[1] })
		  .arrange({ upper: 'descending' })
      
    maxX = dataContainer.max('countInterval')

    dataContainer = dataContainer.groupBy('state')

    scaleColor = scaleOrdinal()
      .domain(ageGroups)
      .range(schemeSpectral[ageGroups.length])
      .unknown('#ccc')

    ready = true
  })()
</script>

{#if ready}

  <Graphic
    width={500}
    height={500}
    scaleX={scaleLinear().domain([0, maxX])}
    scaleY={scaleBand().domain(dataContainer.domain('state')).padding(0.1)}
    padding={{ left: 30, right: 10, top: 30, bottom: 0 }}
  >

    {#each dataContainer.rows() as stateGroup}

      <RectangleLayer 
        x1={stateGroup.$grouped.map('countInterval', d => d[0])}
        x2={stateGroup.$grouped.map('countInterval', d => d[1])}
        y1={stateGroup.state}
        y2={({ scaleY }) => scaleY(stateGroup.state) + scaleY.bandwidth()}
        fill={stateGroup.$grouped.map('ageGroup', scaleColor)}
      />

    {/each}

    <XAxis vjust={'top'} flip={true} baseLine={false} labelFormat={formatPrefix(",.0", 1e6)}/> 
    <YAxis baseLine={false} /> 

  </Graphic>

{/if}

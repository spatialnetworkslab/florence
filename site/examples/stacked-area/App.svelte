<script>
  import { scaleLinear, scaleUtc, scaleOrdinal } from 'd3-scale'
  import { schemeCategory10 } from 'd3-scale-chromatic'
  import { autoType } from 'd3-dsv'
  import { csv } from 'd3-fetch'
  import { Graphic, AreaLayer, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let dataContainer, industries, scaleColor, ready

  (async () => {
    dataContainer = new DataContainer(await csv('/data/unemployment.csv', autoType))
    
    industries = dataContainer.columnNames().filter(c => !['date', '$key'].includes(c))
    
    dataContainer = dataContainer.rowCumsum(industries, { asInterval: true })

    scaleColor = scaleOrdinal()
        .domain(industries)
        .range(schemeCategory10)

    ready = true
  })()
</script>

{#if ready}

  <Graphic
    width={400}
    height={400}
    scaleX={scaleUtc().domain(dataContainer.domain('date'))}
    scaleY={scaleLinear().domain([0, dataContainer.max(industries[industries.length - 1])])}
    padding={{ top: 20, right: 20, bottom: 30, left: 40 }}
    flipY
  >

    <AreaLayer 
      x1={industries.map(_ => dataContainer.column('date'))}
      y1={industries.map(industry => dataContainer.map(industry, d => d[0]))}
      y2={industries.map(industry => dataContainer.map(industry, d => d[1]))}
      fill={industries.map(scaleColor)}
    />

    <XAxis baseLine={false} />

    <YAxis
      baseLine={false}
      title={'Unemployment'}
      titleVjust={'top'}
      titleHjust={0.05}
      titleRotation={0}
      titleFontWeight={'bold'}
    />
  
  </Graphic>

{/if}

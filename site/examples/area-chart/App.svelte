<script>
  import { scaleLinear, scaleUtc } from 'd3-scale'
  import { csv } from 'd3-fetch'
  import { Graphic, Area, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let appleStockData

  csv('/data/apple-stocks-area.csv').then(data => {
    appleStockData = new DataContainer(data)
  })
</script>

{#if appleStockData}
  
  <Graphic
    width={500}
    height={500}
    padding={{ top: 20, right: 20, bottom: 30, left: 30 }}
    scaleX={scaleUtc().domain(appleStockData.domain('date'))}
    scaleY={scaleLinear().domain(appleStockData.domain('close'))}
  >

    <Area
      x1={appleStockData.column('date')}
      y1={appleStockData.column('close')}
      y2={Array(1280).fill(0)}
      fill={'steelblue'}
    />

    <XAxis baseLine={false} />
    
    <YAxis
      baseLine={false}
      title={'$ close'}
      titleVjust={'top'}
      titleHjust={0.035}
    />

  </Graphic>

{/if}

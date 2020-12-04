<script>
  import { scaleOrdinal } from 'd3-scale'
  import { quantize } from 'd3-interpolate'
  import { interpolateSpectral } from 'd3-scale-chromatic'
  import { csv } from 'd3-fetch'
  import { autoType } from 'd3-dsv'
  import { Graphic, Section, RectangleLayer, LabelLayer } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let dataContainer, nrow, scaleColor, ready

  (async () => {
    const data = await csv('/data/population.csv', autoType)

    dataContainer = new DataContainer(data)
      .rename({ value: 'population', name: 'age_group' })
      .cumsum(
        { cumulativePopulation: 'population' },
        { asInterval: true }
      ).mutate({
        lower: row => row.cumulativePopulation[0],
        upper: row => row.cumulativePopulation[1]
      }).mutate({
        mid: ({ lower, upper }) => lower + (upper - lower) / 2
      })

    nrow = dataContainer.nrow()

    const colors = quantize(
      t => interpolateSpectral(t * 0.8 + 0.1),
      dataContainer.nrow()
    ).reverse()

    scaleColor = scaleOrdinal()
      .domain(dataContainer.domain('age_group'))
      .range(colors)

    ready = true
  })()
</script>

{#if ready}

  <Graphic
    width={400}
    height={400}
    flipY
  >

    <Section
      scaleX={[0, dataContainer.max('cumulativePopulation')]}
      scaleY={[0, 15]}
      transformation={'polar'}
    >
    
      <RectangleLayer 
        x1={dataContainer.column('lower')}
        x2={dataContainer.column('upper')}
        y1={Array(nrow).fill(10)}
        y2={Array(nrow).fill(15)}
        fill={dataContainer.map('age_group', scaleColor)}
        stroke={'white'}
        strokeWidth={1}
      />
  
      <!-- age groups -->
      <LabelLayer
        x={dataContainer.column('mid')}
        y={Array(nrow).fill(12.5)}
        text={dataContainer.column('age_group')}
        fontSize={11}
        fontWeight={'bold'}
        fontFamily={'sans-serif'}
      />

    </Section>

    <Section
      scaleX={[0, dataContainer.max('cumulativePopulation')]}
      scaleY={[0, 15]}
      transformation={'polar'}
      zoomIdentity={{ y: 15 }}
    >

      <!-- population labels, except last four -->
      <LabelLayer
        x={dataContainer.column('mid').slice(0, nrow - 4)}
        y={Array(nrow - 4).fill(12.5)}
        text={dataContainer.column('population').slice(0, nrow - 4).map(d => d.toLocaleString())}
        fontSize={11}
        fontWeight={'lighter'}
        fontFamily={'sans-serif'}
      />
    
    </Section>

  </Graphic>

{/if}

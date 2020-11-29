<script>
  import { csv  } from 'd3-fetch'
  import { autoType } from 'd3-dsv'
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { Graphic, Section, Area, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { kernelDensityEstimator, kernelEpanechnikov } from './kernelDensity.js'

  let dataContainer, scaleSpecies, scaleDimension
  let densitiesX, densityY, densityDomain, ready

  (async () => {
    dataContainer = new DataContainer(await csv('/data/iris.csv', autoType))
      .groupBy('Species')

    scaleSpecies = scaleBand().domain(dataContainer.domain('Species')).padding(0.05)
    scaleDimension = scaleLinear().domain([3.5, 8])

    densityY = scaleDimension.ticks(50)
    
    const kde = kernelDensityEstimator(
      kernelEpanechnikov(0.2),
      densityY
    )
    
    densitiesX = dataContainer
      .map('$grouped', group => group.column('Sepal_Length'))
      .map(kde)

    const maxDensity = densitiesX
      .flat()
      .reduce((a, b) => Math.max(a, b))

    densityDomain [-maxDensity, maxDensity]

    ready = true
  })()
</script>

{#if ready}

  <Graphic
    width={500}
    height={500}
    scaleX={scaleSpecies}
    flipY
    padding={{ top: 20, right: 20, bottom: 30, left: 30 }}
  >

    {#each densitiesX as densityX, index}

      <Section
        scaleX={scaleLinear().domain(densityDomain)}
        scaleY={scaleDimension}
        x1={dataContainer.row({ index }).Species}
        x2={({ scaleX }) => {
          return scaleX(dataContainer.row({ index }).Species) + scaleX.bandwidth()
        }}
      >

        <Area
          x1={densityX.map(d => -d)}
          x2={densityX}
          y1={densityY}
          independentAxis={'y'}
          fill={'#c080ff'}
        />
      
      </Section>

    {/each}

  </Graphic>

{/if}

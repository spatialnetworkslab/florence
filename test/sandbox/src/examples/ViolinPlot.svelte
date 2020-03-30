<!-- adapted from https://www.d3-graph-gallery.com/graph/violin_basicDens.html -->
<script>
  import { Graphic, Section, Area, XAxis, YAxis } from '../../../../src'
  import DataContainer from '@snlab/florence-datacontainer'
  import { csv } from 'd3-fetch'
  import { autoType } from 'd3-dsv'
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { mean, max } from 'd3-array'

  const padding = {top: 20, right: 20, bottom: 30, left: 30}

  // set to true once data is loaded
  let done

  let parsedData
  csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv', autoType)
    .then(d => { parsedData = d; done = true })

  let dataContainer
  let speciesDomain, dimensionDomain
  let scaleSpecies, scaleDimension, violinScaleX
  let groupedCols, density

  $: {
    if (done) {
      dataContainer = new DataContainer(parsedData)

      // group data by species
      const grouped = dataContainer.groupBy('Species')
      groupedCols = grouped.column('Species')

      // domains of outer section
      speciesDomain = dataContainer.domain('Species')
      dimensionDomain = dataContainer.domain('Sepal_Length') // for inspection

      // scales of outer section
      scaleDimension = scaleLinear().domain([3.5, 8])
      scaleSpecies = scaleBand().domain(speciesDomain).padding(0.05)

      // apply kde on sepal length
      const kde = kernelDensityEstimator(kernelEpanechnikov(0.2), scaleDimension.ticks(50))
      const groupedSepalLengths = grouped.map('$grouped', group => group.column('Sepal_Length'))
      density = groupedSepalLengths.map(specie => kde(specie))

      // domain of inner section
      let maxNum = 0
      for (const i in density){
        const allBins = density[i]
        const kdeValues = allBins.map(a => a[1])
        const biggest = max(kdeValues)
        if (biggest > maxNum) { maxNum = biggest }
      }

      // scale of inner section (each containing an area plot)
      violinScaleX = scaleLinear().domain([-maxNum, maxNum])
    }
  }

function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, mean(V, v => kernel(x - v))]
    })
  }
}

function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0
  }
}
</script>

<Graphic
  width={700}
  height={500}
>

  {#if done}
    <Section
      scaleX={scaleSpecies}
      scaleY={scaleDimension}
      flipY={false}
      {padding}
    >

    {#each density as d, i}
      <Section
        scaleX={violinScaleX}
        scaleY={scaleDimension}
        flipY
        x1={groupedCols[i]}
        x2={({scaleX}) => scaleX(groupedCols[i]) + scaleX.bandwidth()}
      >
        <Area
          x1={d.map(v => (v[1]))}
          y1={d.map(v => v[0])}
          x2={d.map(v => -v[1])}
          independentAxis={'y'}
          fill={'#c080ff'}
        />
      </Section>
    {/each}

      <XAxis
        baseLine={false}
      />

      <YAxis
        baseLine={false}
      />

    </Section>
  {/if}

</Graphic>

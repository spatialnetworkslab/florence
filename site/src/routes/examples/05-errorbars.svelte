<!-- adapted from https://vega.github.io/vega-lite/examples/layer_point_errorbar_ci.html -->

<script context="module">
  export async function preload() {
    // instead of dealing with promises we await async functions here
    // this.fetch works on both client and server (as opposed to d3-fetch)
    const response = await this.fetch('/barley.json')
    const data = await response.json()

    return { data }
  }
</script>

<script>
  import { scaleLinear, scalePoint } from 'd3-scale'
  import { Graphic, Section, Label, PointLayer, LineLayer, XAxis, YAxis } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  
  export let data

  // set up data container 
  const dataContainer = new DataContainer(data)

  // get population statistics
  const popStats = dataContainer
    .summarise({
      pop_mean_yield: { yield: 'mean' },
      pop_count_yield: { yield: 'count' }
    })
  const calcMean = arr => arr.reduce((acc, curr) => acc + curr) / popStats.column('pop_count_yield')
  const popVar = calcMean( dataContainer.map('yield'
                            , el => Math.pow(el - popStats.column('pop_mean_yield') 
                            , 2
                            )))
  const popStdDev = Math.sqrt(popVar)

  // get sample statistics
  const sampleStats = dataContainer
    .groupBy('variety')
    .summarise({
      mean_yield: { yield: 'mean' },
      count_per_variety: { yield: 'count' }
    })

  // calculate error margin for 95% confidence level
  const err = sampleStats.map('count_per_variety', el => 1.96 * popStdDev / Math.sqrt(el))

  // set domainX to account for confidence intervals
  const domainX = sampleStats.domain('mean_yield')
  domainX[0] = 23
  domainX[1] = 50

  // set scales based on ungrouped sample stats
  const scaleMeanYield = scaleLinear().domain(domainX)
  const scaleVariety = scalePoint().domain(sampleStats.domain('variety')).padding(0.4)

  // group sample stats by variety so as to plot one line per group
  const groupedSampleStats = sampleStats.groupBy('variety')

</script>

<Graphic
  width={500}
  height={500}
>

  <Label
    x={250}
    y={10}
    text={'Errorbars with confidence interval'}
  />

  <Section
    scaleX={scaleMeanYield} 
		scaleY={scaleVariety}
    padding={{left: 90, right: 25, top: 25, bottom: 40}}
  >  

    <PointLayer
     x={sampleStats.column('mean_yield')}
     y={sampleStats.column('variety')}
     radius={4}
     fill={'#eeca3b'}
    />

    <LineLayer
      x={groupedSampleStats.map('$grouped', (group, i) => [group.column('mean_yield')[0] - err[i], group.column('mean_yield')[0] + err[i]])}
      y={groupedSampleStats.map('$grouped', group => [group.column('variety')[0], group.column('variety')[0]])}
      strokeWidth={2}
      stroke={'#eeca3b'}
    />

    <XAxis
      title={'Mean yield'}
      titleFontWeight={'bold'}
    />

    <YAxis
      title='Variety'
      titleFontWeight={'bold'}
    />

  </Section>

</Graphic>
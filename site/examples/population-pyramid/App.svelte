<script>
  import { scaleLinear, scaleBand } from 'd3-scale'
  import { formatPrefix } from 'd3-format'
  import { Graphic, Section, RectangleLayer, XAxis, YAxis } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { data } from './population.js'

  const padding = { bottom: 50, top: 0, left: 0, right: 0 }
  const tickFormatter = formatPrefix('.0', 1e6)

  const dataContainer = new DataContainer(data)
  const grouped = dataContainer.groupBy('sex')

  const scaleX = scaleLinear().domain([0, dataContainer.max('value')])
  const scaleY = scaleBand().domain(dataContainer.domain('age')).padding(0.1)

  const [maleValues, femaleValues] = grouped.map('$grouped', group => group.column('value'))
  const ages = grouped.map('$grouped', group => group.column('age'))[0]
</script>

<Graphic width={760/2} height={400}>

  <!-- male -->
  <Section
    x1={0} 
    x2={380/2}
    {scaleX}
    {scaleY}
    {padding}
    flipX
    flipY
  >

    <RectangleLayer 
      x1={Array(maleValues.length).fill(0)}
      x2={maleValues}
      y1={ages}
      y2={({scaleY}) => ages.map(age => scaleY(age) + scaleY.bandwidth())}
      fill={'steelblue'}
    />

    <XAxis labelFormat={tickFormatter} baseLine={false} />

  </Section>

  <!-- female -->
  <Section
    x1={380/2}
    x2={760/2}
    {scaleX}
    {scaleY}
    {padding}
    flipY
  >

    <RectangleLayer 
      x1={Array(femaleValues.length).fill(0)}
      x2={femaleValues}
      y1={ages}
      y2={({scaleY}) => ages.map(age => scaleY(age) + scaleY.bandwidth())}
      fill={'crimson'}
    />

    <XAxis labelFormat={tickFormatter} baseLine={false} />
    <YAxis flip={true}/>

  </Section>

</Graphic>

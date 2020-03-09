<script>
  import { scaleLinear, scalePoint } from 'd3-scale'
  import {
    Graphic,
    Section,
    PointLayer,
    XAxis,
    YAxis,
  } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  let data = new DataContainer({
    diameter: [
      4.7,
      6.1,
      7.9,
      6.6,
      6.7,
      5.3,
      11.6,
      11.1,
      5.5,
      10.6,
      6.4,
      4.9,
      8.8,
      12.5,
      12.7,
      8.6,
      13.1,
      5.8,
      8.9,
      9.1,
      10.3,
      9.4,
      10.1
    ],
    fruit: [
      'lime',
      'lemon',
      'grapefruit',
      'lemon',
      'orange',
      'lemon',
      'pomelo',
      'grapefruit',
      'lime',
      'pomelo',
      'lemon',
      'lime',
      'grapefruit',
      'pomelo',
      'grapefruit',
      'grapefruit',
      'pomelo',
      'lime',
      'orange',
      'grapefruit',
      'pomelo',
      'grapefruit',
      'anchovies'
    ]
  })

  const processedData = data
    .dropNA()
    .filter(row => row.fruit !== 'anchovies')
    .groupBy('fruit')
    .summarise({ meanDiameter: { diameter: 'mean' } })
    .arrange({ meanDiameter: 'descending' })

  const fruitDomain = data.domain('fruit')
  const scaleFruit = scalePoint().domain(fruitDomain).padding(0.2)
  const meanDiameterDomain = [0, processedData.domain('meanDiameter')[1] * 1.5]
  const scaleMeanDiameter = scaleLinear().domain(meanDiameterDomain)
</script>


<Graphic 
  width={500} height={500}
>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    padding={40}
    scaleX={scaleFruit}
    scaleY={scaleMeanDiameter}
  >

    <PointLayer
      x={data.column('fruit')}
      y={data.column('diameter')}
      key={data.column('$key')}
    />

    <XAxis
    />
    <YAxis 
    />
  </Section>

</Graphic>
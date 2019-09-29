<script>
  import { Graphic, Section, RectangleLayer, XAxis, YAxis } from '../../../../src/'
  import { scaleBand, scaleLinear } from 'd3-scale'
  import DataContainer from '@snlab/florence-datacontainer'

  const data = new DataContainer({ 
    fruit: ['apple', 'banana', 'coconut', 'durian'],
    sales: [5, 2, 7, 4]
  })

  const scaleX = scaleBand().domain(data.domain('fruit')).padding(0.2)
  const scaleY = scaleLinear().domain([0, 7])
</script>

<Graphic width={500} height={500}>

  <Section
    {scaleX}
    {scaleY}
    padding={30}
  >

    <RectangleLayer
      x1={data.column('fruit')}
      x2={({ scaleX }) => data.map('fruit', fruit => scaleX(fruit) + scaleX.bandwidth())}
      y1={0}
      y2={data.column('sales')}
    />

    <XAxis />
    <YAxis />
  
  </Section>

</Graphic>
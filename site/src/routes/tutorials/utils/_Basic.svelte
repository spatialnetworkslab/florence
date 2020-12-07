<script>
  import { Graphic, Section, PointLayer } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scalePoint, scaleLinear } from 'd3-scale'

  const data = {
    diameter: [
      4.7, 6.1, 7.9, 6.6, 6.7, 5.3, 11.6, 11.1, 5.5, 10.6, 6.4,
      4.9, 8.8, 12.5, 12.7, 8.6, 13.1, 5.8, 8.9, 9.1, 10.3, 9.4, 0.5
    ],
  
    fruit: [
      'lime', 'lemon', 'grapefruit', 'lemon', 'orange', 'lemon', 
      'pomelo', 'grapefruit', 'lime', 'pomelo', 'lemon',
      'lime', 'grapefruit', 'pomelo', 'grapefruit', 'grapefruit',
      'pomelo', 'lime', 'orange', 'grapefruit', 'pomelo', 
      'grapefruit', 'anchovies'
    ]
  }

  const dataContainer = new DataContainer(data)
    .filter(row => row.fruit !== 'anchovies')

  const fruitDomain = dataContainer.domain('fruit')
  const scaleFruit = scalePoint().domain(fruitDomain).padding(0.2)
  const diameterDomain = [0, dataContainer.max('diameter')]
  const scaleDiameter = scaleLinear().domain(diameterDomain)
</script>

<Graphic width={500} height={500}>

  <Section
    padding={25}
    scaleX={scaleFruit}
    scaleY={scaleDiameter}
  >

    <PointLayer
      x={dataContainer.column('fruit')}
      y={dataContainer.column('diameter')}
    />

  </Section>

</Graphic>
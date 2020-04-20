<script>
  import { Graphic, Section, PolygonLayer, createGeoScales, Point } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // import data
  import hex from '../data/hexagons.json'

  const data = new DataContainer(hex)
  const geoScales = createGeoScales(data.domain('$geometry'))
  console.log(data)
</script>

<Graphic width={500} height={500}>

  <Section
    {...geoScales}
    flipY
  >
    <PolygonLayer 
      geometry={data.column('$geometry')}
      opacity={0.5}
    />
    <Point
      x={[2971330.946649554, 2975532.7286153506]}
      y={[-5548087.999411765, -5550513.899360795]}
    />
     
  </Section>

</Graphic>
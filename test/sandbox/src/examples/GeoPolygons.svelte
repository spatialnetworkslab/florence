<script>
  import { Graphic, Section, PolygonLayer, fitScales } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'

  // import data
  import hex from '../data/hexagons.json'

  const data = new DataContainer(hex)
  const geoScales = fitScales(data.domain('$geometry'))
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
  
  </Section>

</Graphic>
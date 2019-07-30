<script>
  import { Graphic, Section, PolygonLayer, DataContainer, createGeoScales } from '../../../../src/'

  // import data
  import hex from '../data/hexagons.json'

  const data = new DataContainer(hex)
  const geoScales = createGeoScales(data.domain('$geometry'))
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
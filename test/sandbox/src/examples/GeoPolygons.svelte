<script>
  import { Graphic, Section, PolygonLayer, DataContainer, createGeoScales } from '../../../../src/'

  // import data
  import hex from '../data/hexagons.json'

  const data = new DataContainer(hex)
  const geoScales = createGeoScales(data.domain('$geometry'))
</script>

<Graphic width={500} height={500}>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    {...geoScales}
  >

    <PolygonLayer 
      geometry={data.column('$geometry')}
      opacity={0.5}
    />
  
  </Section>

</Graphic>
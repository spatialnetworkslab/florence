<script>
  import { Graphic, Section, PolygonLayer, createGeoScales } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  // import data
  // step1
  import { geodata } from './planning_areas_data.js'
  const data = new DataContainer(geodata)
  const geoScales = createGeoScales(data.domain('$geometry'))
</script>


<Graphic width={500} height={500}>

  <Section
    {...geoScales}
    flipY
  >
    <!-- step 1 and 2 -->
    <PolygonLayer 
      geometry={data.column('$geometry')}
      fill={'#d3d3d3'}
      stroke={'white'} 
      strokeWidth={1}
    />

  </Section>

</Graphic>
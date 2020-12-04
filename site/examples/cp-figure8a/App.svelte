<script>
  import { Graphic, Section, PolygonLayer, createGeoScales } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { provincesGeoJSON } from './provinces.js'

  const provinces = new DataContainer(provincesGeoJSON)
  const geoScales = createGeoScales(provinces.bbox())
</script>

<Graphic width={400} height={400} {...geoScales} flipY>
  <PolygonLayer
    geometry={provinces.column('$geometry')}
    fill={'rgb(230,230,230)'}
    stroke={'white'}
    strokeWidth={1}
  />
</Graphic>
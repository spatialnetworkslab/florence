<script>
  import { Graphic, Section, PolygonLayer, createGeoScales } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { provincesGeoJSON } from './provinces.js'

  const provinces = new DataContainer(provincesGeoJSON)
  const geoScales = createGeoScales(provinces.bbox())

  let selectedIndex = null
</script>

<Graphic width={500} height={500} {...geoScales} flipY>
  <PolygonLayer
    geometry={provinces.column('$geometry')}
    fill={({ index }) => index === selectedIndex ? 'yellow' : 'rgb(230,230,230)'}
    stroke={'white'}
    strokeWidth={1}
    onMouseover={e => { selectedIndex = e.index }}
    onMouseout={e => { selectedIndex = null }}
  />
</Graphic>

<h1>{selectedIndex ? provinces.row({ index: selectedIndex }).statnaam : 'No province selected'}</h1>
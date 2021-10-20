<script>
  import { Graphic, Section, PolygonLayer, fitScales } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleOrdinal } from 'd3-scale'
  import { schemeCategory10 } from 'd3-scale-chromatic'
  import { provincesGeoJSON } from './provinces.js'

  const provinces = new DataContainer(provincesGeoJSON)
  const geoScales = fitScales(provinces.bbox())

  const colorScale = scaleOrdinal()
    .domain(provinces.domain('statcode'))
    .range(schemeCategory10)
</script>

<Graphic width={400} height={400} {...geoScales} flipY>
  <PolygonLayer
    geometry={provinces.column('$geometry')}
    fill={provinces.map('statcode', colorScale)}
    stroke={'white'}
    strokeWidth={1}
  />
</Graphic>
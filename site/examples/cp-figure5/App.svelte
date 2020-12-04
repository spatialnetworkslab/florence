<script>
  import { Graphic, Point } from '@snlab/florence'

  const myGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [125.6, 10.1]
    },
    properties: {
      name: 'Dinagat Islands'
    }
  }
</script>

<Graphic width={400} height={400} backgroundColor={'gray'}>
  <Point 
    geometry={myGeoJSON.geometry}
  />
</Graphic>

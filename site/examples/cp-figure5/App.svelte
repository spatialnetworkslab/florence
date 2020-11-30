<script>
import { Graphic, Point } from '@snlab/florence'
const myGeoJSON = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
}
</script>

<Graphic width={500} height={500} backgroundColor={'gray'}>
    <Point 
        geometry={myGeoJSON.geometry}
    />
</Graphic>

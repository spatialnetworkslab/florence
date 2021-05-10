<script>
  import { Graphic, PolygonLayer, fitScales } from '@snlab/florence'

  const triangles = [
    { type: 'Polygon', coordinates: [[[0, 0], [5, 2.5], [0, 5], [0, 0]]] },
    { type: 'Polygon', coordinates: [[[10, 0], [5, 2.5], [10, 5], [10, 0]]] }
  ]

  const bbox = {
    x: [0, 10],
    y: [0, 5]
  }

  const geoScales = fitScales(bbox)
</script>

<Graphic
  width={400} height={400}
  backgroundColor={'grey'} 
  {...geoScales}
>
  <PolygonLayer geometry={triangles} fill={['red', 'green']} />
</Graphic>
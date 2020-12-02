<script>
  import { 
    Graphic,
    Area,
    AreaLayer,
    XAxis,
    YAxis
  } from '../../../../src/'
</script>

<Graphic flipY padding={30}>

  <Area 
    x1={[100, 200, 300]}
    y1={[200, 100, 300]}
  />

  <XAxis />
  <YAxis />

</Graphic>
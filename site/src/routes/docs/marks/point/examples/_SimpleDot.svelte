<script>
  import { Graphic, Section, Point } from '@snlab/florence'
  export let radius = 5
  export let fill = 'black'
  export let geometry = {
    type: 'Polygon',
    coordinates: [[[2.91, 5.54], [2.95, 5.55], [2.91, 5.55], [2.91, 5.545]]]
  }
</script>

<style>
  td svg {
    margin: auto;
  }
</style>

<Graphic width={50} height={50}>
  <Point {radius} {fill} {geometry} />
  <Graphic width={50} height={50}>
</Graphic>

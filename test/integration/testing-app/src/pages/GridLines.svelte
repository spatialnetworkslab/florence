<script>
  import { Graphic, XGridLines, YGridLines } from '../../../../../src/'
</script>

<Graphic 
  width={500}
  height={500}
  flipX={false}
  flipY={false}
  padding={{ left: 50, right: 50, top: 50, bottom: 20 }}
>

  <g class="x-grid-lines"><XGridLines /></g>
  <g class="y-grid-lines"><YGridLines /></g>

</Graphic>
<script>
  import { Graphic, RectangleLayer } from '../../../../src/index.js'

  let hoverIndex
</script>

<Graphic width={500} height={500}>
  <RectangleLayer 
    x1={[0, 0.6]}
    x2={[0.2, 0.8 ]}
    fill={({ index }) => hoverIndex === index ? 'red' : 'grey'}
    onMouseover={({ index }) => { console.log(index); hoverIndex = index }}
    onMouseout={() => { console.log('out'); hoverIndex = undefined }}
    stroke={'red'}
    strokeWidth={20}
  />
</Graphic>
<!-- <script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, FuncLine, createPanHandler, createZoomHandler, XAxis, YAxis } from '../../../../src/'

  let funcName = 'sin'

  const funcs = {
    sin: Math.sin,
    exp: Math.exp,
    linear: x => x,
    power2: x => x ** 2
  }

  $: func = funcs[funcName]

  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }
  let blockReindexing = false

  const setZoomIdentity = zoomId => { zoomIdentity = zoomId }
  const setBlockReindexing = bool => { blockReindexing = bool }

  const pan = createPanHandler(zoomIdentity, {
    setZoomIdentity,
    setBlockReindexing,
    extentX: [-500, 500],
    extentY: [-500, 500]
  })

  const zoom = createZoomHandler(zoomIdentity, {
    setZoomIdentity,
    minZoom: 0.2,
    maxZoom: 3,
    step: 1,
    center: { x: 0, y: 0 }
  })
</script>

<div>
  <label for="func-name">Function:</label>
    
  <select name="func-name" bind:value={funcName}>
    <option value="sin">Sine</option>
    <option value="exp">Exp</option>
    <option value="linear">Linear</option>
    <option value="power2">Power 2</option>
  </select>
    
</div> -->

<!-- <Graphic width={500} height={500}>

  <Section
    x1={50} x2={450}
    y1={50} y2={450}
    scaleX={scaleLinear().domain([-3, 3])}
    scaleY={scaleLinear().domain([-2, 2])}
    flipY
    backgroundColor="#d3d3d3"
    {zoomIdentity}
    {...pan.handlers}
    {...zoom.handlers}
    {blockReindexing}
  >

    <FuncLine
      {func}
      stroke="red"
      strokeWidth={7}
      transition={2000}
    />
  
  </Section>

</Graphic> -->

<script>
  import { Graphic, FuncLine, XAxis, YAxis } from '../../../../src/'
</script>

<Graphic 
  width={500}
  height={500}
  scaleX={[0, 10]}
  scaleY={[0, 10]}
  padding={20}
  flipY
>

  <FuncLine func={x => Math.exp(x / 4)} stroke={'red'} />

  <XAxis />
  <YAxis />

</Graphic>
<script>
  import { scaleLinear } from 'd3-scale'
  import { 
    Graphic, Section, PolygonLayer, Rectangle,
    XAxis, YAxis, Title
  } from '../../../../src'

  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }
  let blockReindexing = false

  const setZoomIdentity = zoomId => { zoomIdentity = zoomId }
  const setBlockReindexing = bool => { blockReindexing = bool }

  let vjust = 'top'
  let hjust = 'center'
  let graphicPadding = 10
  let sectionPadding = 30
  let gUsePadding = true
  let sUsePadding = true
</script>

<Graphic width={500} height={500} padding={graphicPadding}>

 <Section 
    x1={50} x2={450}
    y1={50} y2={450}
    padding={sectionPadding}
    scaleX={scaleLinear().domain([0, 4])}
    scaleY={scaleLinear().domain([0, 4])}
    {zoomIdentity}
    {blockReindexing}
  > 

    <Title 
      title={'Lorem ipsum dolor sit amet, consectetur adipiscing'} 
      subtitle={'elit, sed do eiusmod tempor incididunt'}
      {vjust}
      {hjust}
      subtitleFontFamily={'Garamond'}
      subtitleStroke={'green'}
      subtitleStrokeWidth={2}
      usePadding={false}
      />

    <XAxis zoomIdentity={{ y: 0, ky: 1 }} />
    <YAxis zoomIdentity={{ x: 0, kx: 1 }} />
  
  </Section>

  <Title 
    title={'Test'} 
    subtitle={'subtitle'}
    vjust={'bottom'}
    {hjust}
    titleFontFamily={'Baskerville'}
    titleFill={'pink'}
    usePadding={false}
    />

</Graphic>
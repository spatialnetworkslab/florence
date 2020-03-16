<script>
  import { scaleLinear } from 'd3-scale'
  import { 
    Graphic, Section, PolygonLayer, Rectangle,
    XAxis, YAxis, Title
  } from '../../../../src'

  let zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }
  let blockReindexing = false

  let vjust = 'top'
  let hjust = 'center'
  let graphicPadding = 10
  let sectionPadding = 40
</script>

<Graphic width={500} height={500} padding={graphicPadding}>

 <Section 
    x1={50} x2={450}
    y1={50} y2={450}
    padding={30}
    scaleX={scaleLinear().domain([0, 4])}
    scaleY={scaleLinear().domain([0, 4])}
    {zoomIdentity}
    {blockReindexing}
  > 

    <Title 
      title={'Lorem ipsum dolor sit amet'} 
      titleFontFamily={'Papyrus'}
      subtitle={'elit, sed do eiusmod tempor incididunt'}
      subtitleFontFamily={'Garamond'}
      subtitleStroke={'green'}
      subtitleStrokeWidth={2}
      usePadding={true}
      />

    <XAxis />
    <YAxis />
  
  </Section>

  <Title 
    title={'Test text at bottom of chart'} 
    subtitle={'elit, sed do eiusmod tempor incididunt'}
    vjust={'bottom'}
    {hjust}
    titleFontFamily={'Baskerville'}
    titleFill={'pink'}
    usePadding={false}
    />

</Graphic>
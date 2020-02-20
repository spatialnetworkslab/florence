<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, XAxis, YAxis, Title } from '@snlab/florence'

  const zoomIdentity = { x: 0, y: 0, kx: 1, ky: 1 }
  const blockReindexing = false

  const vjust = 'bottom'
  const hjust = 'center'
  const graphicPadding = 5
  const sectionPadding = 30
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
      title={'This title uses the padding of the section'} 
      titleFontFamily={'Baskerville'}
      titleFill={'steelblue'}
      subtitle={'Subtitle'}
      subtitleFontFamily={'Helvetica'}
      subtitleStrokeWidth={1.5}
      usePadding={true}
      />

    <XAxis zoomIdentity={{ y: 0, ky: 1 }} />
    <YAxis zoomIdentity={{ x: 0, kx: 1 }} />
  
  </Section>

  <Title 
    title={'This title does not use the padding of the section'} 
    titleFill={'pink'}
    subtitle={'Here is the subtitle'}
    subtitleFontFamily={'Baskerville'}
    {vjust}
    {hjust}
    usePadding={false}
    />

</Graphic>
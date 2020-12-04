<script>
  import { scaleLinear } from 'd3-scale'
  import { Graphic, Section, Title } from '../../../../../src/'

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
      fontFamily={'Papyrus'}
    />
  
  </Section>

  <Title 
    title={'Test text at bottom of chart'} 
    vjust={0.9}
    {hjust}
    fontFamily={'Baskerville'}
    fill={'pink'}
    />

</Graphic>
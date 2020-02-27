<script>
  import { 
    Graphic, Section, PolygonLayer, Rectangle,
    XAxis, YAxis, Title
  } from '../../../../src'

  const sectionPadding = 75
  const background = '#808080'
  const padding = '#E8E8E8'
</script>

<Graphic width={500} height={500}
>

 <Section
    x1={50} x2={450}
    y1={50} y2={450}
    padding={sectionPadding}
    backgroundColor={background}
    paddingColor={padding}
    flipY
  > 

      <Title 
      title={'Inside'} 
      titleFontFamily={'Baskerville'}
      usePadding={true}
      />

      <Title 
      title={'Outside'} 
      titleFontFamily={'Baskerville'}
      />

    <XAxis />
    <YAxis />
  
  </Section>

  <Title 
    title={'This title is placed outside of the section'} 
    titleFill={'pink'}
    subtitle={'Its parent is the Graphic'}
    subtitleFontFamily={'Baskerville'}
    vjust={'top'}
    hjust={'center'}
    usePadding={false}
    />

</Graphic>
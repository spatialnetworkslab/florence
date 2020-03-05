<script>
  import { Graphic, Section, XAxis, YAxis, Title } from '../../../../src'
  const sectionPadding = 75
  const graphicPadding = 50
  const background = '#808080'
  const padding = '#E8E8E8'
</script>

<Graphic width={500} height={500}
  padding={graphicPadding}
>

 <Section
    x1={0} x2={500}
    y1={0} y2={500}
    padding={sectionPadding}
    backgroundColor={background}
    paddingColor={padding} 
  > 
    <Title 
      title={'Title is inside of the padding of the section'} 
      titleFontFamily={'Baskerville'}
      subtitle={'Its parent is the Section'}
      subtitleFill={'steelblue'}
      vjust={'bottom'}
      usePadding={true}
      />

    <Title 
      title={'Title is outside of the padding of the section'} 
      titleFontFamily={'Baskerville'}
      subtitle={'Its parent is the Section'}
      subtitleFill={'coral'}
      vjust={'bottom'}
      />

    <XAxis />
    <YAxis />
  
  </Section>

  <Title 
    title={'This title is placed inside of the graphic'} 
    subtitle={'Its parent is the Graphic'}
    titleFill={'coral'}
    subtitleFontFamily={'Baskerville'}
    />

  <Title 
    title={'This title is placed outside of the graphic'} 
    titleFill={'steelblue'}
    subtitle={'Its parent is the Graphic'}
    subtitleFontFamily={'Baskerville'}
    usePadding={true}
    />
</Graphic>
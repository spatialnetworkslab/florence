<script>
  import { Graphic, Section, XAxis, YAxis, Title } from '../../../../src'

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
      title={'Title is inside of the padding of the section'} 
      subtitle={'Its parent is the Section'}
      subtitleFill={'steelblue'}
      titleFontFamily={'Baskerville'}
      usePadding={true}
      />

    <Title 
      title={'Title is outside of the padding of the section'} 
      subtitle={'Its parent is the Section'}
      subtitleFill={'pink'}
      titleFontFamily={'Baskerville'}
      usePadding={false}
      />

    <XAxis />
    <YAxis />
  
  </Section>

  <Title 
    title={'This title is placed inside of the graphic'} 
    titleFill={'pink'}
    subtitleFontFamily={'Baskerville'}
    usePadding={true}
    />

  <Title 
    title={'This title is placed outside of the graphic'} 
    titleFill={'pink'}
    subtitle={'Its parent is the Graphic'}
    subtitleFontFamily={'Baskerville'}
    usePadding={true}
    />
</Graphic>
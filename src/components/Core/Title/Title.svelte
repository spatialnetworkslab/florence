<script>
  import {
    getAbsoluteXPosition,
    getAbsoluteYPosition
  } from '../../Guides/Axes/absolutePosition.js'
  import * as SectionContext from '../Section/SectionContext'
  import Label from '../../Marks/Label/Label.svelte'

  // Positioning
  export let vjust = 'top'
  export let hjust = 'center'
  export let xOffset = 0
  export let yOffset = 0
  export let anchorPoint = 'center'

  // Aesthetics: Title
  export let title = 'Title Text'
  export let fill = 'black'
  export let stroke = undefined
  export let strokeWidth = undefined
  export let strokeOpacity = undefined
  export let fillOpacity = undefined
  export let opacity = 1
  export let fontFamily = 'Helvetica'
  export let fontSize = 18
  export let fontWeight = 'bold'
  export let rotation = 0

  // Other
  export let transition = undefined
  export let clip = false

  const sectionContext = SectionContext.subscribe()

  $: x = getAbsoluteXPosition(hjust, xOffset, $sectionContext)
  $: y = getAbsoluteYPosition(vjust, yOffset, $sectionContext)

  $: {
    console.log(x)
    console.log(y)
  }
</script>

<Label
  x={ () => x } 
  y={ () => y }
  text={title}
  {fill} 
  {stroke} 
  {strokeWidth}
  {strokeOpacity}
  {fillOpacity}
  {opacity}
  {fontFamily}
  {fontSize}
  {fontWeight}
  {rotation}
  {anchorPoint}
  {transition}
  {clip}
/>

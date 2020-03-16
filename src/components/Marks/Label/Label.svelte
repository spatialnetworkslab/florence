<script>
  import Mark from '../Mark/Mark.svelte'

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

  // Aesthetics: other
  export let fill = undefined
  export let stroke = undefined
  export let strokeWidth = undefined
  export let strokeOpacity = undefined
  export let fillOpacity = undefined
  export let opacity = undefined
  export let text = undefined
  export let fontFamily = undefined
  export let fontSize = undefined
  export let fontWeight = undefined
  export let rotation = undefined
  export let anchorPoint = undefined

  // Transitions
  export let transition = undefined

  // Mouse interactions
  export let onClick = undefined
  export let onMousedown = undefined
  export let onMouseup = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
  export let onMousedrag = undefined

  // Touch interactions
  export let onTouchdown = undefined
  export let onTouchup = undefined
  export let onTouchover = undefined
  export let onTouchout = undefined
  export let onTouchdrag = undefined

  // Select interactions
  export let onSelect = undefined
  export let onDeselect = undefined

  // Other
  export let renderSettings = undefined
  export let blockReindexing = false
</script>

<Mark
  type="Label"
  {x} {y} {geometry} 
  {fill} {stroke} {strokeWidth}
  {strokeOpacity} {fillOpacity} {opacity}
  {text}
  {fontFamily} {fontSize} {fontWeight} {rotation} {anchorPoint}
  {transition} 
  {onClick} {onMousedown} {onMouseup} {onMouseover} {onMouseout} {onMousedrag}
  {onTouchdown} {onTouchup} {onTouchover} {onTouchout} {onTouchdrag}
  {onSelect} {onDeselect}
  {renderSettings} {blockReindexing}
  _asPolygon={false}
/>
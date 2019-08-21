<script>
  import Layer from '../Mark/Layer.svelte'

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

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onHover = undefined
  export let onMouseout = undefined

  // Other
  export let index = undefined
  export let zoomIdentity = undefined
</script>

<Layer 
  type="Label"
  {x} {y} {geometry}
  {fill} {stroke} {strokeWidth}
  {strokeOpacity} {fillOpacity} {opacity}
  {text}
  {fontFamily} {fontSize} {fontWeight} {rotation} {anchorPoint}
  {transition} {onClick} {onHover} {onMouseout}
  {index} {zoomIdentity} _asPolygon={false}
/>
<script>
  import Mark from '../Mark/Mark.svelte'

  // Aesthetics: positioning
  export let x
  export let y
  export let geometry

  // Aesthetics: other
  export let fill
  export let stroke
  export let strokeWidth
  export let strokeOpacity
  export let fillOpacity
  export let opacity
  export let text
  export let fontFamily
  export let fontSize
  export let fontWeight
  export let rotation
  export let anchorPoint

  // Transitions
  export let transition

  // Mouse interactions
  export let onClick
  export let onMousedown
  export let onMouseup
  export let onMouseover
  export let onMouseout
  export let onMousedrag

  // Touch interactions
  // TODO

  // Select interactions
  export let onSelect
  export let onDeselect

  // Other
  export let zoomIdentity
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
  {onSelect} {onDeselect}
  {zoomIdentity} _asPolygon={false} {blockReindexing}
/>
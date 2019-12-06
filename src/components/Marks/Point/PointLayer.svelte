<script>
  import Layer from '../Mark/Layer.svelte'

  // Aesthetics: positioning
  export let x
  export let y
  export let geometry

  // Aesthetics: other
  export let radius
  export let fill
  export let stroke
  export let strokeWidth
  export let strokeOpacity
  export let fillOpacity
  export let opacity

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
  export let key
  export let zoomIdentity
  export let blockReindexing = false
</script>

<Layer 
  type="Point"
  {x} {y} {geometry} {radius}
  {fill} {stroke} {strokeWidth}
  {strokeOpacity} {fillOpacity} {opacity}
  {transition} 
  {onClick} {onMousedown} {onMouseup} {onMouseover} {onMouseout} {onMousedrag}
  {onSelect} {onDeselect}
  {key} {zoomIdentity} _asPolygon={false} {blockReindexing}
/>
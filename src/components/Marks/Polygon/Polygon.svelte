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
  export let onTouchdown = undefined
  export let onTouchup = undefined
  export let onTouchover = undefined
  export let onTouchout = undefined
  export let onTouchdrag = undefined

  // Select interactions
  export let onSelect
  export let onDeselect

  // Other
  export let interpolate = false
  export let zoomIdentity
  export let blockReindexing = false
</script>

<Mark
  type="Polygon"
  {x} {y} {geometry}
  {fill} {stroke} {strokeWidth}
  {strokeOpacity} {fillOpacity} {opacity}
  {transition} 
  {onClick} {onMousedown} {onMouseup} {onMouseover} {onMouseout} {onMousedrag}
  {onTouchdown} {onTouchup} {onTouchover} {onTouchout} {onTouchdrag}
  {onSelect} {onDeselect}
  {interpolate} {zoomIdentity} {blockReindexing}
/>
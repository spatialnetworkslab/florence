<script>
  import Layer from '../Mark/Layer.svelte'

  // Aesthetics: positioning
  export let x
  export let y
  export let geometry

  // Aesthetics: other
  export let strokeWidth
  export let stroke
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
  export let key
  export let interpolate = true
  export let zoomIdentity
  export let blockReindexing = false
</script>

<Layer 
  type="Line"
  {x} {y} {geometry}
  {strokeWidth} {stroke} {opacity}
  {transition} 
  {onClick} {onMousedown} {onMouseup} {onMouseover} {onMouseout} {onMousedrag}
  {onTouchdown} {onTouchup} {onTouchover} {onTouchout} {onTouchdrag}
  {onSelect} {onDeselect}
  {interpolate} {zoomIdentity} {key} _asPolygon={false} {blockReindexing}
/>
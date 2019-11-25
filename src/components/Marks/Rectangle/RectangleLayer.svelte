<script>
  import Layer from '../Mark/Layer.svelte'

  // Aesthetics: positioning
  export let x1
  export let x2
  export let y1
  export let y2

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
  export let key
  export let interpolate = true
  export let zoomIdentity
  export let blockReindexing = false
</script>

<Layer 
  type="Rectangle"
  {x1} {x2} {y1} {y2}
  {fill} {stroke} {strokeWidth}
  {strokeOpacity} {fillOpacity} {opacity}
  {transition} 
  {onClick} {onMousedown} {onMouseup} {onMouseover} {onMouseout} {onMousedrag}
  {onTouchdown} {onTouchup} {onTouchover} {onTouchout} {onTouchdrag}
  {onSelect} {onDeselect}
  {key} {zoomIdentity} {interpolate} {blockReindexing}
/>
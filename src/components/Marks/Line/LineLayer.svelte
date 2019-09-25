<script>
  import Layer from '../Mark/Layer.svelte'

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

  // Aesthetics: other
  export let strokeWidth = undefined
  export let stroke = undefined
  export let opacity = undefined

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
  // TODO

  // Select interactions
  export let onSelect = undefined
  export let onDeselect = undefined

  // Other
  export let key = undefined
  export let interpolate = true
  export let zoomIdentity = undefined
  export let blockReindexing = false
</script>

<Layer 
  type="Line"
  {x} {y} {geometry}
  {strokeWidth} {stroke} {opacity}
  {transition} 
  {onClick} {onMousedown} {onMouseup} {onMouseover} {onMouseout} {onMousedrag}
  {onSelect} {onDeselect}
  {interpolate} {zoomIdentity} {key} _asPolygon={false} {blockReindexing}
/>
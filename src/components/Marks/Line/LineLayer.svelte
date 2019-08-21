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

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onHover = undefined
  export let onMouseout = undefined

  // Other
  export let index = undefined
  export let interpolate = true
  export let zoomIdentity = undefined
</script>

<Layer 
  type="Line"
  {x} {y} {geometry}
  {strokeWidth} {stroke} {opacity}
  {transition} {onClick} {onHover} {onMouseout}
  {interpolate} {zoomIdentity} {index} _asPolygon={false}
/>
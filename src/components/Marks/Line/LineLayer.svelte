<script>
  import Layer from '../Mark/Layer.svelte'

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined
  export let func = undefined

  // Aesthetics: other
  export let strokeWidth = undefined
  export let stroke = undefined
  export let opacity = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Other
  export let index = undefined
  export let interpolate = true
</script>

<Layer 
  type="Line"
  {x} {y} {geometry} {func}
  {strokeWidth} {stroke} {opacity}
  {transition} {onClick} {onMouseover} {onMouseout}
  {interpolate} {index} _asPolygon={false}
/>
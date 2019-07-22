<script>
  import Layer from '../Mark/Layer.svelte'

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

  // Aesthetics: other
  export let fill = undefined
  export let opacity = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Other
  export let interpolate = false
  export let index = undefined
</script>

<Layer 
  type="Polygon"
  {x} {y} {geometry}
  {fill} {opacity}
  {transition} {onClick} {onMouseover} {onMouseout}
  {index} {interpolate}
/>
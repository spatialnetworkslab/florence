<script>
  import Layer from '../Mark/Layer.svelte'

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

  // Aesthetics: other
  export let radius = 3
  export let fill = 'black'
  export let opacity = 1

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Other
  export let index = undefined
</script>

<Layer 
  type="Point"
  {x} {y} {geometry} {radius}
  {fill} {opacity}
  {transition} {onClick} {onMouseover} {onMouseout}
  {index} _asPath={false}
/>
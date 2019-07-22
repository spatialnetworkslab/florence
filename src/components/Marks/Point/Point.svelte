<script>
  import Mark from '../Mark/Mark.svelte'

  // Aesthetics: positioning
  export let x = undefined
  export let y = undefined
  export let geometry = undefined

  // Aesthetics: other
  export let radius = undefined
  export let fill = undefined
  export let opacity = undefined

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
</script>

<Mark
  type="Point"
  {x} {y} {geometry} {radius} 
  {fill} {opacity} 
  {transition} {onClick} {onMouseover} {onMouseout}
  _asPath={false}
/>
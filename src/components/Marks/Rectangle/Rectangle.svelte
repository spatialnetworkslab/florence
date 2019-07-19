<script>
  import Mark from '../Mark/Mark.svelte'

  // Aesthetics: positioning
  export let x1 = undefined
  export let x2 = undefined
  export let y1 = undefined
  export let y2 = undefined

  // Aesthetics: other
  export let fill = 'black'
  export let opacity = 1

  // Transitions and interactions
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined

  // Other
  export let interpolate = true
</script>

<Mark
  type="Rectangle"
  {x1} {x2} {y1} {y2}
  {fill} {opacity}
  {transition} {interpolate} {onClick} {onMouseover} {onMouseout}
/>
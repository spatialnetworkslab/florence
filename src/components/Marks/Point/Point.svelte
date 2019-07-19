<script>
  import Mark from '../Mark/Mark.svelte'

  // Props
  export let x = undefined
  export let y = undefined
  export let geometry = undefined
  export let radius = 3
  export let fill = 'black'
  export let opacity = 1
  export let transition = undefined
  export let onClick = undefined
  export let onMouseover = undefined
  export let onMouseout = undefined
</script>

<Mark
  type="Point"
  {x} {y} {geometry} {radius} {fill} {opacity} 
  {transition} {onClick} {onMouseover} {onMouseout} 
/>
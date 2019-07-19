<script>
  import Layer from '../Mark/Layer.svelte'

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
  export let index = undefined
  export let interpolate = true
</script>

<Layer 
  type="Rectangle"
  {x1} {x2} {y1} {y2}
  {fill} {opacity}
  {transition} {onClick} {onMouseover} {onMouseout}
  {index} {interpolate}
/>
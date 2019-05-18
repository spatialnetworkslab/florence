<script>
  import { onMount } from 'svelte'

  export let x1
  export let x2
  export let y1
  export let y2

  export let scaleX = undefined
  export let scaleY = undefined

  $: rangeX = [x1, x2]
  $: rangeY = [y1, y2]

  $: scales = parseScales(scaleX, scaleY, rangeX, rangeY)
   
  function parseScales (scaleX, scaleY, rangeX, rangeY) {
    return {
      x: scaleX ? scaleX.copy().range(rangeX) : undefined,
      y: scaleY ? scaleY.copy().range(rangeY) : undefined
    }
  }
</script>

<g>
  <slot scaleX={scales.x} scaleY={scales.y} />
</g>
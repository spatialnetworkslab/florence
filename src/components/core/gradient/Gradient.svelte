<script context="module">
  let idCounter = 0

  function getId () {
    return 'gradient' + idCounter++
  }
</script>

<script>
  import { getContext } from 'svelte'
  import { getGradientStops, getCanvasGradient } from '@snlab/rendervous'

  export let colors
  export let opacities = undefined
  export let stops = undefined

  const id = getId()

  const { renderer, canvasContext } = getContext('graphic')

  $: stops = getGradientStops(colors, opacities, stops)
  
  $: svgGradient = renderer === 'svg'
    ? `url(#${id})`
    : undefined
  
  $: canvasGradient = renderer === 'canvas'
    ? getCanvasGradient(stops, $canvasContext)
    : undefined
</script>

{#if renderer === 'svg'}
  <linearGradient {id}>
    {#each stops as {offset, color}}
      <stop offset={`${offset * 100}%`} stop-color={color} />
    {/each}
  </linearGradient>

  <slot gradient={svgGradient} />
{/if}

{#if renderer === 'canvas'}
  <slot gradient={canvasGradient} />
{/if}
<script>
  import { generateStopOffsets } from './gradientLegend.js'

  export let gradientId
  export let colors

  $: stopOffsets = generateStopOffsets(colors.length)
</script>

<defs>

    <linearGradient id={gradientId} gradientTransform="rotate(90)">

      {#each colors as color, i}

        <stop offset={stopOffsets[i]} stop-color={color} />

      {/each}

    </linearGradient>

</defs>
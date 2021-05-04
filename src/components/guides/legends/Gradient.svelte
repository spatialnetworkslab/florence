<script>
  import { generateStopOffsets } from './gradientLegend.js'

  export let gradientId
  export let fills
  export let opacities

  $: stopOffsets = generateStopOffsets(fills.length)
</script>

<defs>

    <linearGradient id={gradientId} gradientTransform="rotate(90)">

      {#each fills as _, i}

        <stop 
          offset={stopOffsets[i]}
          style={`
            stop-color: ${fills[i]};
            stop-opacity: ${opacities[i]}
          `}
        />

      {/each}

    </linearGradient>

</defs>
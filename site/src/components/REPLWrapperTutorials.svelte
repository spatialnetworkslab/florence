<script>
import REPL from '@snlab/florence-repl'

export let replFiles

let containerWidth
let windowHeight
</script>

<style>
.repl {
  left: 50%;
	margin-left: -55vw;
	margin-right: -55vw;
	max-width: 96vw;
	position: relative;
	right: 50%;
  background-color: white;
  @apply border border-gray-100;
}
</style>

<svelte:window bind:innerHeight={windowHeight}/>
<div class="repl" bind:clientWidth={containerWidth}>
  {#if containerWidth}
    <REPL
      {replFiles}
      width={containerWidth}
      height={windowHeight * 0.8}
      debounce={400}
    />
  {/if}
</div>

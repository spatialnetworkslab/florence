<script>
import REPL from '@snlab/florence-repl'

export let replFiles

let containerWidth
let windowHeight
</script>

<style>
.repl {
  left: 0;
	margin-left: 2vw;
	margin-right: 2vw;
	max-width: 96vw;
	position: absolute;
	right: 0;
  background-color: white;
  @apply border border-gray-100;
}
</style>

<svelte:window bind:innerHeight={windowHeight}/>

<div>
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
</div>

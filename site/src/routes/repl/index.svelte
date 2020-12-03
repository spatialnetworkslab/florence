<script>
import REPL from '@snlab/florence-repl'
import { onMount, onDestroy } from 'svelte'
import appSource from './appSource.js'

let containerWidth
let windowHeight

const replFiles = [
  {
    id: 0,
    name: 'App',
    type: 'svelte',
    source: appSource
  }
]
</script>

<style>
.repl {
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

<script>
  import REPLWrapper from '../../components/REPLWrapper.svelte'
  import appSource from './appSource.js'

  const replFiles = [
    {
      id: 0,
      name: 'App',
      type: 'svelte',
      source: appSource
    }
  ]
</script>

<REPLWrapper {replFiles} /> 

<!-- <script>
import REPL from '@snlab/florence-repl'
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
  left: 50%;
	margin-left: -48vw;
	margin-right: -48vw;
	max-width: 96vw;
	position: relative;
	right: 50%;
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
</div> -->

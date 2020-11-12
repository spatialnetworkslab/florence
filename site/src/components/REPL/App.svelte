<script>
  import { onMount } from 'svelte'
  import preloadPackages from './preload/preloadPackages.js'
  import DataContainer from './packages/DataContainer.js'
  import florence from './packages/florence.js'
  // import d3Scale from './packages/d3scale.js'
  import REPL from './repl/REPL.svelte'
  import appSource from './appSource.js'

  const replFiles = [
    {
      id: 0,
      name: 'App',
			type: 'svelte',
			source: appSource.trim(),
    },
    
    {
      id: 1,
      name: 'Component1',
      type: 'svelte',
	    source: '<h1>Hello</h1>',
    }
  ]
  
  let currentFileId = 0

  let preloaded

  onMount(async () => {
    preloaded = await preloadPackages([DataContainer, florence/*, d3Scale*/])
  })

  let width
  let height

  // let width = 1300
  // let height = 500

  let layout = 'horizontal'
</script>

<svelte:window
  bind:innerWidth={width}
  bind:innerHeight={height}
/>

{#if preloaded}

  <div style="position: absolute; left: 0px; top: 0px;">

    <REPL
      {replFiles}
      {currentFileId}
      {preloaded}
      {width}
      {height}
      {layout}
    />

  </div>

{/if}

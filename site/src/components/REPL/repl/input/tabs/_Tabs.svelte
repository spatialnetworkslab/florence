<script>
	export let replFiles
	export let currentFileName
</script>

<ul>

	{#each Object.keys(replFiles) as fileName}

		<li 
      class:active={currentFileName === fileName} 
      on:click={() => (currentFileName = fileName)}
    >
			{fileName}
		</li>

	{/each}

	<!-- <li>
    <button 
      on:click={() => dispatch('new')}
    >
      +
    </button>
  </li> -->
</ul>

<style>
	.active {
		font-weight: 900;
		text-decoration: underline;
	}
</style>

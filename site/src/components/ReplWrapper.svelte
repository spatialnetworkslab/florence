<!--
	this wrapper component is taken from the amazing example 
	in the Svelte site (https://github.com/sveltejs/svelte/blob/master/site/src/components/Repl/ReplWidget.svelte)

 -->
<script>
    import { onMount } from "svelte"
    import Repl from '@sveltejs/svelte-repl'
    
    export let components
    export let width = 1000
    export let version = 3
    let repl
	let checked = false

    onMount(() => {
        if (version !== 'local') {
			fetch(`https://unpkg.com/svelte@${version}/package.json`)
				.then(r => r.json())
				.then(pkg => {
					version = pkg.version;
				});
        }
        repl.set({
            components: components
        });
    })

	$: if (repl) repl.set({components: components})
    $: mobile = width < 560;
    $: svelteUrl = process.browser && version === 'local' ?
		`${location.origin}/repl/local` :
		`https://unpkg.com/svelte@${version}`
	const rollupUrl = `https://unpkg.com/rollup@1/dist/rollup.browser.js`
</script>

<div class="repl">
	<div class="repl-outer" bind:clientWidth={width} class:mobile>
		<div class="viewport" class:offset={checked}>
			{#if process.browser}
				<Repl
					bind:this={repl}
					workersUrl="workers"
					{svelteUrl}
					{rollupUrl}
				/>
			{/if}
		</div>

	</div>
</div>

<style>
.repl-outer {
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--back);
		overflow: hidden;
		box-sizing: border-box;
		--pane-controls-h: 4.2rem;
	}
	.viewport {
		width: 100%;
		height: 100%;
	}
	.mobile .viewport {
		width: 200%;
		height: calc(100% - 42px);
		transition: transform 0.3s;
	}
	.mobile .offset {
		transform: translate(-50%, 0);
	}
.repl {
		width: 100%;
        min-width: 800px;
		height: calc(100vh - 55px);
	}
</style>
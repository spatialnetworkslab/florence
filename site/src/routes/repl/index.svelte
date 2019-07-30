<script context="module">
	export async function preload() {
		const examples = await this.fetch(`repl.json`).then(r => r.json())
		const title_by_slug = {}
		examples.forEach(({slug, title}) => {
				title_by_slug[slug] = title
			})
		return {examples, title_by_slug};
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { goto } from '@sapper/app';
	import ReplPreprocess from '../../components/ReplWrapper.svelte'

	export let examples
	export let title_by_slug

	let width = process.browser
		? window.innerWidth - 32
		: 1000
	
	const cache = {}
	let active_slug
	let components
	$: title = title_by_slug[active_slug] || ''
	$: first_slug = examples[0].slug
	$: if (active_slug) {
		if (active_slug in cache) {
			components = cache[active_slug]
		} else {
			fetch(`repl/${active_slug}.json`)
				.then(async response => {
					if (response.ok) {
						const {files} = await response.json();
						return processExample(files);
					}
				})
				.then(c => {
					cache[active_slug] = c;
					components = cache[active_slug]
				})
		}
	}

	onMount(() => {
		const onhashchange = () => {
			active_slug = window.location.hash.slice(1)
		};
		window.addEventListener('hashchange', onhashchange, false)
		const fragment = window.location.hash.slice(1)
		if (fragment) {
			active_slug = fragment
		} else {
			active_slug = first_slug;
			goto(`repl#${active_slug}`)
		}
		return () => {
			window.removeEventListener('hashchange', onhashchange, false);
		}
	})

	function processExample(files) {
		return files
			.map(file => {
				const [name, type] = file.name.split('.');
				return { name, type, source: file.source };
			})
			.sort((a, b) => {
				if (a.name === 'App' && a.type === 'svelte') return -1;
				if (b.name === 'App' && b.type === 'svelte') return 1;

				if (a.type === b.type) return a.name < b.name ? -1 : 1;

				if (a.type === 'svelte') return -1;
				if (b.type === 'svelte') return 1;
			});
	}

</script>

<style>
	input {
		background: none;
		border: none;
		font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
		font-size: 16px;
		padding-left: 8px;
		color: lightgray;
	}
	.header {
		width: 100%;
		background: #535963;
		padding: 1em 3em;
	}
</style>

<div class="header">
	<input value={title}>
</div>
{#if components}
	<ReplPreprocess {components} {width} />
{/if}
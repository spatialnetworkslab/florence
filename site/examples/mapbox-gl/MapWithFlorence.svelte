<script>
	import { onMount, setContext, createEventDispatcher } from 'svelte'
	import { mapbox, key } from './mapbox.js'

	const dispatch = createEventDispatcher()
	setContext(key, {
		getMap: () => map
	})

	export let center
  export let zoom

  export let width
  export let height

	let map
	let container
	

	onMount(() => {
		map = new mapbox.Map({
			container,
			style: 'mapbox://styles/mapbox/streets-v9',
			center: center,
			zoom
		})
		dispatch('load', map)
		map.on('render', () => dispatch('pan', map.getBounds()))
		map.on('zoom', () => dispatch('zoom', map.getBounds()))

		return () => {
			map.remove()
		}
	})
</script>

<svelte:head>
	<link rel="stylesheet" href="href="https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.css"
      rel="stylesheet"">
</svelte:head>
<div style="width: {width}px; height: {height}px;" bind:this={container}>
</div>
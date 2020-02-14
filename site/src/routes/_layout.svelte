<script>
	import Nav from '../components/Nav.svelte'
	export let segment
</script>

<style>
</style>

<Nav {segment} class='border border-gray-500'/>

<main class='main-body'>
	<slot></slot>
</main>
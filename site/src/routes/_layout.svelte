<script>
	import Nav from '../components/Nav.svelte'
	export let segment
</script>

<style>
</style>

<Nav {segment}/>

<main class='container'>
	<slot></slot>
</main>
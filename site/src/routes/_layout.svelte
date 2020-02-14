<script>
	import Nav from '../components/Nav.svelte'
	export let segment
</script>

<style>
</style>

<Nav {segment} class='border border-gray-500'/>

<main class='bg-white static p-8 my-0 mx-auto'>
	<slot></slot>
</main>
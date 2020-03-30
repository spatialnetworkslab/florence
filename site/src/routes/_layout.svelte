<script>
	import Nav from '../components/Nav.svelte'
	export let segment
</script>

<style>
</style>

<svelte:head>
	<title>Florence: A grammar of graphics, built on Svelte's template syntax.</title>
</svelte:head>

<Nav {segment}/>

<main class='main-body'>
	<slot></slot>
</main>
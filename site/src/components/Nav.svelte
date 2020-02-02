<script>
	export let segment
</script>

<style>
</style>

<nav>
	<ul>
		<li><a class='{segment === undefined ? "selected" : ""}' href='.'>home</a></li>
		<li><a rel=prefetch class='{segment === "examples" ? "selected" : ""}' href='examples'>examples</a></li>
		<li><a rel=prefetch class='{segment === "docs" ? "selected" : ""}' href='docs'>docs</a></li>
	</ul>
</nav>
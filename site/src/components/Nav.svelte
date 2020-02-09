<script>
	export let segment
</script>

<style>
</style>

<nav>
	<ul>
		<li><a class='{segment === undefined ? "selected" : ""}' href='.'>Home</a></li>
		<li><a rel=prefetch class='{segment === "gallery" ? "selected" : ""}' href='gallery'>Gallery</a></li>
		<li><a rel=prefetch class='{segment === "docs" ? "selected" : ""}' href='docs'>Docs</a></li>
		<li><a rel=prefetch class='{segment === "inspiration" ? "selected" : ""}' href='inspiration'>Inspiration</a></li>
	</ul>
</nav>
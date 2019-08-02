<script>
	export let items;
</script>

<style>
.toc {
    list-style-type: none;
}
</style>

<nav>
    <ul class="toc">
        {#each items as item}
            <li><a rel=prefetch href={item.path}>{item.name}</a></li>  
        {/each}
    </ul>
</nav>
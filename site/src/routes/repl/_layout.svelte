<script context="module">
  export async function preload() {
    const res = await this.fetch(`repl.json`)
    const items = await res.json()
    if (res.status === 200) {
      return { items }
    } else {
      this.error(res.status, items.message)
    }
  }
</script>

<script>
	import SideNav from '../../components/SideNav.svelte'
	export let items
</script>

<style>
.flex-grid {
  display: flex;
}

.left-col {
  margin-right: 80px;
}

.toc {
    list-style-type: none;
}
</style>

<div class="flex-grid">
	<div class="left-col">
		<nav>
      <ul class="toc">
          {#each items as item}
              <li><a href=repl#{item.slug}>{item.title}</a></li>
          {/each}
      </ul>
    </nav>
    <!-- this is a horrible hack but sapper needs to know about all the 
    [slug].json links and we don't have them in preload currently so this
    will point to a page that has all of the json files listes -->
    <a style="visibility: hidden" href="repl/all">List of all examples (just to get export to work..)</a>
	</div>
	<div class="right-col">
		<main>
			<slot></slot>
		</main>
	</div>
</div>


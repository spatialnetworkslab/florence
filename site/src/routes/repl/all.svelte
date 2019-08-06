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
	export let items
</script>

{#each items as item}
    <a href=repl/{item.slug}.json>{item.title}</a>
{/each}
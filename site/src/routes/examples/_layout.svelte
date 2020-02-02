<script context="module">
  export async function preload () {
    const res = await this.fetch('examples.json')
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
</style>

<div class="flex-grid">
	<div class="left-col">
		<SideNav { items }/>
	</div>
	<div class="right-col">
		<main>
			<slot></slot>
		</main>
	</div>
</div>


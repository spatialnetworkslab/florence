<script context="module">
  export async function preload () {
    const res = await this.fetch('gallery.json')
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
.exampleContainer {
  @apply flex flex-row;
}
.left-col {
  @apply w-2/12;
}
.right-col {
  @apply w-auto;
}
</style>

<div class="exampleContainer">
	<div class="left-col">
		<SideNav { items }/>
	</div>
	<div class="right-col">
		<main>
			<slot></slot>
		</main>
	</div>
</div>


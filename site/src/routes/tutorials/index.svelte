<script context="module">
  export async function preload () {
    const res = await this.fetch('tutorials.json')
    const items = await res.json()
    if (res.status === 200) {
      return this.redirect(303, items[0].path)
    } else {
      this.error(res.status, items.message)
    }
  }
</script>
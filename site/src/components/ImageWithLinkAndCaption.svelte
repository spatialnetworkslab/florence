<script>
export let imageURL = undefined
export let linkURL = undefined
export let caption = undefined

if (imageURL === undefined) {
  const linkSplit = linkURL.split('/')
  imageURL = 'images/examples/' + linkSplit[linkSplit.length - 1] + '.png'
}
</script>

<style>
    img {
        max-height: 275px;
    }
</style>

<div class="p-1 flex flex-col justify-between">
    <a href={linkURL}>
        <img src={imageURL} alt={caption}>
        <label class="mt-1">{caption}</label>
    </a>
    
</div>
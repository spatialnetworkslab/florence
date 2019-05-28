<script>
  import { line } from 'd3-shape'

  export let x1
  export let x2
  export let y1
  export let y2

  $: points = generatePoints(x1, x2, y1, y2)

  function generatePoints (x1, x2, y1, y2) {
    return [
        [x1, y1],
        [x1, y2],
        [x2, y2],
        [x2, y1],
        [x1, y1]
      ]
  }

  $: path = line()(points)
</script>

<path d={path} />

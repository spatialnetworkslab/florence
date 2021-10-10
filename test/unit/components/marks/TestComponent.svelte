<script>
  import { Graphic } from '../../../../src/index.js'

  export let graphicProps = {}
  export let component
  export let componentProps = {}

  function parseGraphicProps (props) {
    const clone = Object.assign({}, graphicProps)
    return Object.assign(clone, {
      width: 500,
      height: 500
    })
  }
</script>

<Graphic {...graphicProps}>
  <svelte:component this={component} {...componentProps} />
</Graphic>
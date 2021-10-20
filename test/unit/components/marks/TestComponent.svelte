<script>
  import { Graphic } from '../../../../src/index.js'

  export let graphicProps = {}
  export let component
  export let componentProps = {}
  export let dummyRoot = undefined
  export let dummyWindow = undefined

  function parseGraphicProps (props) {
    const clone = Object.assign({}, graphicProps)
    
    return Object.assign(clone, {
      width: 500,
      height: 500,
      _testDummies: { dummyRoot, dummyWindow }
    })
  }
</script>

<Graphic {...parseGraphicProps(graphicProps)}>
  <svelte:component this={component} {...componentProps} />
</Graphic>
<script>
  import _debounce from 'lodash.debounce'

  import Input from './input/Input.svelte'
	import Output from './output/Output.svelte'

  import injectPreloadedCode from '../preload/injectPreloadedCode.js'
  import getFileName from '../utils/getFileName.js'
  import getDummyCodePackages from '../utils/getDummyCodePackages.js'

  export let replFiles
  export let currentFileId = 0
  export let preloaded = undefined
  export let width
  export let height
  export let layout = 'horizontal'
  export let debounce = 150

  if (!(getFileName(replFiles[0]) === 'App.svelte')) {
    throw new Error('First file must be \'App.svelte\'')
  }

  let bundled
  let error = null
  let bundling = false

  const bundler = new Worker('./bundler.js')

	bundler.addEventListener('message', event => {
    bundling = false

    if (event.data.error) {
      error = event.data.error
      return
    }

    error = null

		if (preloaded) {
      bundled = injectPreloadedCode(
        event.data.bundled,
        event.data.preloadedPackagesUsed,
        preloaded
      )

      return
    }

    bundled = event.data.bundled
	})

  function bundleFn (replFiles) {
    bundling = true

    const dummyCodePackages = getDummyCodePackages(preloaded)
    bundler.postMessage({ replFiles, dummyCodePackages })
	}

	$: bundle = debounce ? _debounce(bundleFn, debounce) : bundleFn

  $: bundle(replFiles, preloaded)

  $: inputClass = `split ${layout} ${layout === 'horizontal' ? 'left' : 'top' }`
  $: outputClass = `split ${layout} ${layout === 'horizontal' ? 'right': 'bottom' }`

  $: loadingEditor = bundled ? null : { message: 'Loading editor...' }
</script>

<style>
.split {
  position: absolute;
}

.horizontal {
  width: 50%; 
  height: 100%;
}

.vertical {
  width: 100%; 
  height: 50%;
}

.left {
  left: 0;
  border-right: 1px solid #eee;
}

.right {
  right: 0;
  border-left: 1px solid #eee;
}

.top {
  top: 0;
  border-bottom: 1px solid #eee;
}

.bottom {
  bottom: 0;
  border-top: 1px solid #eee;
}
</style>

<div
  style={`width: ${width}px; height: ${height}px;`}
>

  <div class={inputClass}>

    <Input
      bind:replFiles 
      bind:currentFileId
      height={layout === 'horizontal' ? height : height / 2}
    />

  </div>

  <div class={outputClass}>

    <Output
      {bundled}
      {error}
      {bundling}
    />

  </div>

</div>

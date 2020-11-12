<script>
  import { onMount } from 'svelte'
  import Editor from './codemirror/Editor.svelte'
  import Tabs from './tabs/Tabs.svelte'
  import getFileIndex from '../../utils/getFileIndex.js'

  export let replFiles
  export let currentFileId
  export let height

  $ :currentFileIndex = getFileIndex(replFiles, currentFileId)
  $: currentFile = replFiles[currentFileIndex]

  function updateCurrentFile (newCode) {
    replFiles[currentFileIndex].source = newCode.detail
  }

  let tabsHeight
  let editorHeight

  $: {
    editorHeight = height - tabsHeight
  }
</script>

<div bind:clientHeight={tabsHeight}>
  <Tabs
    bind:replFiles
    bind:currentFileId
  />
</div>

{#if editorHeight}
  <Editor 
    {currentFile}
    on:change={updateCurrentFile}
    height={editorHeight}
  />
{/if}

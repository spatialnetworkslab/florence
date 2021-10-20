<script>
import REPL from '@snlab/florence-repl'

export let replFiles
</script>

<style>
  .repl {
    left: 50%;
    margin-left: -48vw;
    margin-right: -48vw;
    max-width: 96vw;
    position: relative;
    right: 50%;
    @apply border border-gray-100;
  }
</style>

<div class="repl">
  <REPL {replFiles} />
</div>
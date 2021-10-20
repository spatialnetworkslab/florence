<script>
import REPL from '@snlab/florence-repl'

export let replFiles

</script>

<style>
.repl {
  left: 0;
	margin-left: 2vw;
	margin-right: 2vw;
	max-width: 96vw;
	position: absolute;
	right: 0;
  background-color: white;
  @apply border border-gray-100;
}
</style>

<div>
  <div class="repl">
    <REPL {replFiles} />
  </div>
</div>

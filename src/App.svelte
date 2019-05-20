<script>
  import BarChart from './examples/BarChart.svelte'
  import Scatterplot from './examples/Scatterplot.svelte'

  let filterT = 0
  let N = 10000

  $: inputMax = N * 1.5
</script>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: row;
    max-height: 100vh;
  }

  .graphic-holder {
    text-align: center;
  }
</style> 

<div class="container">

  <!-- <div class="graphic-holder">
    <h1>Bar chart:</h1>
    <BarChart />
  </div> -->

  <div class="graphic-holder">
    <h1>Filter:</h1>
    <Scatterplot {filterT} {N} />

    <label for="filterTreshold">
      Treshold
    </label>
    <input id="filterTreshold" type="range" min="0" max={inputMax} step="1" bind:value={filterT} />
  </div>  

</div>
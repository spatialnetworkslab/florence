<script>
  import BarChart from './examples/BarChart.svelte'
  import Scatterplot from './examples/Scatterplot.svelte'
  import PolarSections from './examples/PolarSections.svelte'
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

  <div class="graphic-holder">
    <h1>Bar chart</h1>
    <BarChart />
  </div>

  <div class="graphic-holder">
    <h1>Scatterplot</h1>
    <Scatterplot />
  </div>

  <div class="graphic-holder">
    <h1>Polar sections</h1>
    <PolarSections />
  </div>  

</div>

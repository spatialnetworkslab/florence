<script>
  import BarChart from './examples/BarChart.svelte'
  import Scatterplot from './examples/Scatterplot.svelte'
  import GridLayout from './examples/GridLayout.svelte'
  import ResizeLayout from './examples/ResizeLayout.svelte'
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
    <h1>Grid</h1>
    <GridLayout />
  </div>

  <div class="graphic-holder" style="padding-left: 50px">
    <h1>Responsive</h1>
    <ResizeLayout />
  </div>  

</div>

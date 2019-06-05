<script>
  import BarChart from './examples/BarChart.svelte'
  import Scatterplot from './examples/Scatterplot.svelte'
  // import transitionPoints from './sveg/components/Marks/utils/transitions/geometryTransitions/transitionPoints.js'

  // const s = JSON.stringify

  // let a = [[1, 1], [1, 3], [3, 1]]
  // let b = [[2, 2], [6, 2], [6,6], [2, 6]]

  // let interpolator = transitionPoints(a, b)

  // console.log(s(interpolator(0)))
  // console.log(s(interpolator(0.5)))
  // console.log(s(interpolator(1)))
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

</div>
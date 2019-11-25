<script>
  import { Router, Link, Route } from 'svelte-routing'

  // import all playground examples here
  import BarChart from './examples/BarChart.svelte'
  import Polygons from './examples/Polygons.svelte'
  import GridLayout from './examples/GridLayout.svelte'
  import ResizeLayout from './examples/ResizeLayout.svelte'
  import Scatterplot from './examples/Scatterplot.svelte'
  import ZoomPan from './examples/ZoomPan.svelte'
  import BaseMark from './examples/BaseMark.svelte'
  import Line from './examples/Line.svelte'
  import GeoPolygons from './examples/GeoPolygons.svelte'
  import FuncLines from './examples/FuncLines.svelte'
  import DragCategorical from './examples/DragCategorical.svelte'
  import FunctionAPI from './examples/FunctionAPI.svelte'
  import FlipTest from './examples/FlipTest.svelte'
  import NonNumericAxis from './examples/NonNumericAxis.svelte'
  import DragAllMarks from './examples/DragAllMarks.svelte'
  import StackedBarChart from './examples/StackedBarChart.svelte'
  import SelectRectangle from './examples/SelectRectangle.svelte'
  import SelectPolygon from './examples/SelectPolygon.svelte'
  import TouchTest from './examples/TouchTest.svelte'
  import AreaChart from './examples/AreaChart.svelte'
  import StackedAreaChart from './examples/StackedAreaChart.svelte'
  import ViolinPlot from './examples/ViolinPlot.svelte'
  import Title from './examples/Title.svelte'

  // and add them to this component array
  const components = [
    {
      name: 'Bar Chart',
      url: '/barchart',
      component: BarChart
    },
    {
      name: 'Polygons',
      url: '/polygons',
      component: Polygons
    },
    {
      name: 'Grid Layout',
      url: '/gridlayout',
      component: GridLayout
    },
    {
      name: 'Resize Layout',
      url: '/resizelayout',
      component: ResizeLayout
    },
    {
      name: 'Scatterplot',
      url: '/scatterplot',
      component: Scatterplot
    },
    {
      name: 'ZoomPan',
      url: '/zoompan',
      component: ZoomPan
    },
    {
      name: 'Base mark',
      url: '/basemark',
      component: BaseMark
    },
    {
      name: 'Line',
      url: '/line',
      component: Line
    },
    {
      name: 'Geo Polygons',
      url: '/geopolygons',
      component: GeoPolygons
    },
    {
      name: 'FuncLines',
      url: 'funclines',
      component: FuncLines
    },
    {
      name: 'DragCategorical',
      url: 'dragcategorical',
      component: DragCategorical
    },
    {
      name: 'Function API',
      url: 'functionapi',
      component: FunctionAPI
    },
    {
      name: 'Flip test',
      url: 'fliptest',
      component: FlipTest
    },
    {
      name: 'Non numeric axis',
      url: 'nonnumericaxis',
      component: NonNumericAxis
    },
    {
      name: 'Drag all marks',
      url: 'dragallmarks',
      component: DragAllMarks
    },
    {
      name: 'Stacked bar chart',
      url: 'stackedbarchart',
      component: StackedBarChart
    },
    {
      name: 'Select rectangle',
      url: 'selectrectangle',
      component: SelectRectangle
    },
    {
      name: 'Select polygon',
      url: 'selectpolygon',
      component: SelectPolygon
    },
    {
      name: 'Touch test',
      url: 'touchtest',
      component: TouchTest
    },
    {
      name: 'Area chart',
      url: 'areachart',
      component: AreaChart
    },
    {
      name: 'Stacked area chart',
      url: 'stackedareachart',
      component: StackedAreaChart
    },
    {
      name: 'Violin plot',
      url: 'violinplot',
      component: ViolinPlot
    },
    {
      name: 'Title',
      url: 'title',
      component: Title
    }
  ]
</script>
<Router url="">
  <div class="flex-grid">
    
    <div class="left-col">
    
      <ul class="toc">
      
        {#each components as component}
          <li><Link to={component.url}>{component.name}</Link></li>  
        {/each}

      </ul>

    </div>

    <div class="right-col">
        
      <Route path="/" component={components[0].component} />
        
      {#each components as component}
        <Route path={component.url} component={component.component} />
      {/each}
      
    </div>

  </div>
</Router>

<style>
.flex-grid {
  display: flex;
}

.left-col {
  margin-right: 20px;
}

.toc {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>


<script>
  import { 
    Graphic, Section, 
    RectangleLayer,
    XAxis, YAxis
  } from '../../../../src/'

  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleLinear, scaleBand } from 'd3-scale'

  const data = new DataContainer({
    a: [5, 2, 7, 3, 6],
    b: [6, 5, 2, 11, 3],
    c: [2, 6, 1, 5, 3]
  }).rowCumSum(['a', 'b', 'c'], { asInterval: true })

  // TODO
</script>
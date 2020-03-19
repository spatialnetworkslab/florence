<script>
  import { Graphic, PointLayer, XAxis, YAxis } from '@snlab/florence'
  import { scaleLinear, scalePoint } from 'd3-scale'

  const locations = ['square', 'park', 'mall']
  const getLocationMoney = {
    'square': () => 50 + Math.random() * 30,
    'park': () => 20 + Math.random() * 60,
    'mall': () => 5 + Math.random() * 90
  }

  const { location, money } = getData()

  function getData () {
    const location = new Array(100).fill(0).map(_ => locations[Math.floor(Math.random() * 3)])
    const money = location.map(location => getLocationMoney[location]())

    return {
      location,
      money
    }
  }
</script>

<Graphic
  width={400}
  height={400}
  scaleX={scalePoint().domain(locations).padding(0.2)}
  scaleY={scaleLinear().domain([0, 100])}
  padding={30}
  flipY
>

  <PointLayer x={location} y={money} opacity={0.5} />

  <XAxis />
  <YAxis />

</Graphic>
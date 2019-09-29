<script>
  import { Graphic, Section, PointLayer, PolygonLayer, XAxis, YAxis, createGeoScales } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleLinear } from 'd3-scale'

  import avocado from '../data/avocado-data.csv'
  import cities from '../data/city-centroids.csv'
  import states from '../data/us-states.json'

  // TODO do this with DC after new release
  const avocadoConverted = avocado.map(row => {
    return {
      city: row.city,
      averagePrice: parseFloat(row.AveragePrice),
      totalVolume: parseInt(row['Total Volume']),
      date: new Date(row.Date)
    }
  })

  // TODO fix this ugly bullshit too
  const avocadoPricePerCity = new DataContainer(avocadoConverted)
    .groupBy('city')
    .summarise({ 
      _avgPrice: { averagePrice: 'mean' },
      _avgVolume: { totalVolume: 'mean' }
    })
    .mutate({
      avgPrice: row => parseFloat(parseFloat(row._avgPrice).toFixed(2)),
      avgVolume: row => parseInt(row._avgVolume)
    })
    .select(['avgPrice', 'avgVolume'])

  const priceScale = scaleLinear().domain(avocadoPricePerCity.domain('avgPrice'))
  const volumeScale = scaleLinear().domain(avocadoPricePerCity.domain('avgVolume'))
</script>

<Graphic width={800} height={800}>

  <Section
    padding={30}
    scaleX={volumeScale}
    scaleY={priceScale}
    flipY
  >

    <PointLayer
      x={avocadoPricePerCity.column('avgVolume')}
      y={avocadoPricePerCity.column('avgPrice')}
    />

    <XAxis />
    <YAxis />
  
  </Section>

</Graphic>
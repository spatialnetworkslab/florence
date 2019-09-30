<script>
  import { Graphic, Section, PointLayer, PolygonLayer, XAxis, YAxis, createGeoScales } from '../../../../src/'
  import DataContainer from '@snlab/florence-datacontainer'
  import { scaleLinear } from 'd3-scale'

  import avocado from '../data/avocado-data.csv'
  import cities from '../data/city-centroids.csv'
  import states from '../data/us-states.json'

  const avocadoPricePerCity = new DataContainer(avocado)
    .rename({ 
      AveragePrice: 'averagePrice', 
      'Total Volume': 'totalVolume',
      Date: 'date'
    })
    .mutate({
      averagePrice: row => parseFloat(row.averagePrice),
      totalVolume: row => parseInt(row.totalVolume),
      date: row => new Date(row.date)
    })
    .groupBy('city')
    .summarise({ 
      avgPriceEntirePeriod: { averagePrice: 'mean' },
      avgVolumeEntirePeriod: { totalVolume: 'mean' }
    }) 

  console.log(new DataContainer(cities))

  // avocadoPricePerCity.join(, { by: ['city', 'city'] })

  console.log(avocadoPricePerCity)

  // const priceScale = scaleLinear().domain(avocadoPricePerCity.domain('avgPrice'))
  // const volumeScale = scaleLinear().domain(avocadoPricePerCity.domain('avgVolume'))
</script>

<Graphic width={800} height={800}>

  <!-- <Section
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
  
  </Section> -->

</Graphic>
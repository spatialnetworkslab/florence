<script>
  import { Graphic, Section, Area, XAxis, YAxis } from '@snlab/florence'
  import { scaleLinear, scaleTime } from 'd3-scale'
  import { timeFormat } from 'd3-time-format'
</script>

<Graphic width={500} height={300} >

    <Section
      scaleX={scaleTime().domain([new Date("2014-05-01"), new Date("2014-08-01")])}
      scaleY={scaleLinear().domain([80, 140])}
      padding={30}
      flipY
    >
      <Area
        x1={[new Date("2014-05-01"), new Date("2014-06-01"), new Date("2014-07-01"), new Date("2014-08-01")]}
        y1={[105, 130, 122, 96]}
        y2={[80, 80, 80, 80]}
        fill={'#f7b538'}
      />

      <XAxis
        baseLine={false}
        labelFormat={timeFormat("%B")}
        tickCount={4}
        tickExtra={true}
      />

      <YAxis
        baseLine={false}
        tickCount={5}
      />
    </Section>

</Graphic>

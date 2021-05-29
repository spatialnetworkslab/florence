<script>
  import { Graphic, Section, PointLayer } from '@snlab/florence'
  import DataContainer from '@snlab/florence-datacontainer'

  const dataContainer = new DataContainer({
    x: [1, 2, 3],
    y: [1, 2, 3]
  })

  let transformed = false

  $: data = transformed 
    ? dataContainer.filter(r => r.x > 1).mutate({ x: r => r.x + 0.5 })
    : dataContainer
</script>

<button 
  class="border border-indigo-500 text-indigo-500 rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:text-white hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
  on:click={() => { transformed = !transformed }}>
  Click me!
</button><br /><br />

<Graphic width={500} height={300}>
  
  <Section x1={0} x2={250} scaleX={[0, 4]} scaleY={[0, 4]} backgroundColor={'#a9f49c'}>
    
    <PointLayer 
      x={data.column('x')}
      y={data.column('y')}
      transition={3000}
    />

  </Section>
  
  <Section x1={250} x2={500} scaleX={[0, 4]} scaleY={[0, 4]} backgroundColor={'#9cc1f4'}>
    
    <PointLayer 
      x={data.column('x')}
      y={data.column('y')}
      keys={data.keys()}
      transition={3000}  
    />

  </Section>

</Graphic>
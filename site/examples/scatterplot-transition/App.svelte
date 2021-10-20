<script>
  import { Graphic, PointLayer, XAxis, YAxis } from '@snlab/florence'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  let N = 100
  let error = 0.25

  const data = tweened(generateData(N, error), {
    duration: 2000,
    easing: cubicOut
  })
  

	function generateData (N, error) {
		const getError = () => -error + (Math.random() * (2 * error)) * N
		let data = { a: [], b: [] }
		for (let i = 0; i < N; i++) {
			data.a.push(i + getError())
			data.b.push(i + getError())
		}
		return data
  }

  setInterval(() => {
    $data = generateData(N, error)
  }, 5000)
</script>

<Graphic
  width={400}
  height={400}
  scaleX={[0, 105]}
  scaleY={[0, 105]}
  flipY
  padding={20}
>

  <PointLayer 
    x={data.a}
    y={data.b}
    stroke={'steelblue'}
    strokeWidth={1}
    fill={'white'}
  />

  <XAxis />
  <YAxis />

</Graphic>
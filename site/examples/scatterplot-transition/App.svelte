<script>
	import { Graphic, PointLayer, XAxis, YAxis } from '@snlab/florence'

  let N = 100
  let error = 0.25
  let data = generateData(N, error)

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
    data = generateData(N, error)
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
    transition={2000}
  />

  <XAxis />
  <YAxis />

</Graphic>
// import { isInvalid } from '../../utils/equals.js'

export default function (coordinates, coordinateContext) {
  const { scaleX, scaleY } = coordinateContext.scales()

  const x = scaleX(coordinates.x)
  const y = scaleY(coordinates.y)

  return { x, y }
}

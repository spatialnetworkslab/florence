export default function parseRenderSettings (renderSettings, coordinateTransformationContext) {
  const defaultRenderSettings = {
    simplify: false,
    simplificationTreshold: 1,
    interpolate: true,
    interpolationTreshold: 5,
    decimals: 2
  }

  const parsedRenderSettings = Object.assign(defaultRenderSettings, renderSettings)

  if (coordinateTransformationContext) {
    parsedRenderSettings.interpolate = coordinateTransformationContext.type() === 'identity'
      ? false
      : parsedRenderSettings.interpolate
  }

  return parsedRenderSettings
}

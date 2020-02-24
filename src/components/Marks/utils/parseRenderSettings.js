export default function parseRenderSettings (renderSettings, coordinateTransformationContext) {
  const defaultRenderSettings = {
    simplify: false,
    simplificationTreshold: 1,
    interpolate: true,
    interpolationTreshold: 1,
    decimals: undefined
  }

  const parsedRenderSettings = Object.assign(defaultRenderSettings, renderSettings)

  if (coordinateTransformationContext) {
    parsedRenderSettings.interpolate = coordinateTransformationContext.type() === 'identity'
      ? false
      : parsedRenderSettings.interpolate
  }

  return parsedRenderSettings
}

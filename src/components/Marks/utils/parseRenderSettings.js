export default function parseRenderSettings (renderSettings) {
  const defaultRenderSettings = {
    simplify: false,
    simplificationThreshold: 1,
    interpolate: true,
    interpolationThreshold: 5,
    decimals: 2
  }

  const parsedRenderSettings = Object.assign(defaultRenderSettings, renderSettings)

  return parsedRenderSettings
}

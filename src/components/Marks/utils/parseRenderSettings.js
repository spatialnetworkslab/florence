export default function parseRenderSettings (renderSettings) {
  const defaultRenderSettings = {
    simplify: false,
    simplificationTreshold: 1,
    interpolate: true,
    interpolationTreshold: 5,
    decimals: 2
  }

  const parsedRenderSettings = Object.assign(defaultRenderSettings, renderSettings)

  return parsedRenderSettings
}

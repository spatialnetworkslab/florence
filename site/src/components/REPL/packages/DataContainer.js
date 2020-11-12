const SNLAB_URL = 'https://cdn.jsdelivr.net/gh/spatialnetworkslab'

export default {
  name: '@snlab/florence-datacontainer',
  url: `${SNLAB_URL}/florence-datacontainer@5d61c54ae81b4c82a4811427dae8bb12cf309401/dist/florence-datacontainer.mjs`,
  getCodeBody (code) { return code.substring(0, code.length - 30) },
  defaultExport: true,
  defaultName: 'DataContainer'
}

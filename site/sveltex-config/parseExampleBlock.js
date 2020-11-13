import { parse as tokenizeWords } from 'space-separated-tokens'

export default function parseExampleBlock (node, config) {
  const props = tokenizeWords(config)

  const [location, range = ''] = props
  node.data.example = {
    tag: 'div',
    location,
    range // not being used rn
  }
}

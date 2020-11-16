import { parse as tokenizeWords } from 'space-separated-tokens'

export default function parseExampleBlock (node, config) {
  const props = tokenizeWords(config)

  const [location, highlightRange = ''] = props
  node.data.example = {
    tag: 'div',
    location,
    highlightRange // not being used rn
  }
}

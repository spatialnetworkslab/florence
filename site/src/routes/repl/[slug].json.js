import send from '@polka/send'
import { getExample } from './_content.js'

const cache = new Map()

export function get (req, res) {
  const { slug } = req.params

  let example = cache.get(slug)

  if (!example || process.env.NODE_ENV !== 'production') {
    example = getExample(slug)
    if (example) cache.set(slug, example)
  }
  if (example) {
    send(res, 200, example)
  } else {
    send(res, 404, {
      error: 'not found'
    })
  }
}

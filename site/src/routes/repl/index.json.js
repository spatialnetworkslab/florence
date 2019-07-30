import send from '@polka/send'
import { getExamples } from './_content.js'

let cached

export function get (req, res) {
  try {
    if (!cached || process.env.NODE_ENV !== 'production') {
      cached = getExamples().filter(example => example.title)
    }
    send(res, 200, cached)
  } catch (e) {
    send(res, e.status || 500, {
      message: e.message
    })
  }
}

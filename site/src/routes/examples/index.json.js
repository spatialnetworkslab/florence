import fs from 'fs'
import path from 'path'

const files = fs
  .readdirSync('src/routes/examples/')
  .filter(file => {
    const match = /^(\d+)-(.+)\.svelte$/.exec(file)
    return match
  })
  .map(file => {
    const match = /^(\d+)-(.+)\.svelte$/.exec(file)
    const [, prefix, name] = match
    return {
      name: name,
      path: 'examples/' + prefix + '-' + name
    }
  })

const contents = JSON.stringify(files)

export function get (req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(contents)
}

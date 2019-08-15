import fs from 'fs'

const files = fs
  .readdirSync('src/routes/docs/')
  .filter(file => {
    const match = /^(\d+)-(.+)\.sveltex$/.exec(file)
    return match
  })
  .map(file => {
    const match = /^(\d+)-(.+)\.sveltex$/.exec(file)
    const [, prefix, name] = match
    return {
      name: name,
      path: 'docs/' + prefix + '-' + name
    }
  })

const contents = JSON.stringify(files)

export function get (req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(contents)
}

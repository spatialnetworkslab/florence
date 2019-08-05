import fs from 'fs'

let lookup
const titles = new Map()

export function getExamples () {
  lookup = new Map()
  return fs.readdirSync('src/routes/repl/_content/').map(exampleDir => {
    const slug = exampleDir.replace(/^\d+-/, '')
    if (lookup.has(slug)) throw new Error(`Duplicate example slug "${slug}"`)
    lookup.set(slug, exampleDir)
    const metadata = JSON.parse(fs.readFileSync(`src/routes/repl/_content/${exampleDir}/meta.json`, 'utf-8'))
    titles.set(slug, metadata.title)
    return {
      slug,
      title: metadata.title
    }
  })
}

export function getExample (slug) {
  if (!lookup || !lookup.has(slug)) getExamples()

  const dir = lookup.get(slug)
  const title = titles.get(slug)

  if (!dir || !title) return null

  const files = fs.readdirSync(`src/routes/repl/_content/${dir}`)
    .filter(name => name[0] !== '.' && name !== 'meta.json')
    .map(name => {
      return {
        name,
        source: fs.readFileSync(`src/routes/repl/_content/${dir}/${name}`, 'utf-8')
      }
    })
  return { title, files }
}

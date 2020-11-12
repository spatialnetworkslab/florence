import CDN_URL from './CDN_URL.js'
import fetchIfUncached from './fetchPackage.js'

// const SNLAB_URL = 'https://cdn.jsdelivr.net/gh/spatialnetworkslab'

export default function (fileLookup, dummyCodePackages) {
  return async function resolveId (importee, importer) {
    // import x from 'svelte'
    if (importee === 'svelte') return `${CDN_URL}/svelte/index.mjs`

    // import x from 'svelte/somewhere'
    if (importee.startsWith('svelte/')) {
      return `${CDN_URL}/svelte/${importee.slice(7)}/index.mjs`
    }

    // import x from './file.js' (inside 'svelte' or 'svelte/x' packages)
    if (importer && importer.startsWith(`${CDN_URL}/svelte`)) {
      const resolved = new URL(importee, importer).href
      if (resolved.endsWith('.mjs')) return resolved

      return `${resolved}/index.mjs`
    }

    // local repl files
    if (importee in fileLookup) return importee

    // preloaded packages
    if (importee in dummyCodePackages) return importee

    // relative imports from a remote package
    if (importee.startsWith('.')) return new URL(importee, importer).href

    // bare named module imports (importing an npm package)
    // get the package.json and load it into memory
    const url = `${CDN_URL}/${importee}`
    const pkgUrl = `${url}/package.json`
    const pkg = JSON.parse(await fetchIfUncached(pkgUrl))

    // get an entry point from the pkg.json - first try svelte, then modules, then main
    if (pkg.svelte || pkg.module || pkg.main) {
      // use the above url minus `/package.json` to resolve the URL
      return new URL(pkg.svelte || pkg.module || pkg.main, `${url}/`).href;
    }

    throw new Error(`Invalid import '${importee}' in ${importer}`)
  }
}

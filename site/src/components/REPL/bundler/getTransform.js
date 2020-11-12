import CDN_URL from './CDN_URL.js'

// eslint-disable-next-line
importScripts(`${CDN_URL}/svelte/compiler.js`)

export default function () {
  return function transform (code, id) {
    // our only transform is to compile svelte components
    // eslint-disable-next-line
    if (/.*\.svelte/.test(id)) return svelte.compile(code).js.code
  }
}

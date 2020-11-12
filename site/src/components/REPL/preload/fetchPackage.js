const fetchCache = new Map()

export default async function fetchPackage (url) {
  if (fetchCache.has(url)) {
    return fetchCache.get(url)
  }

  const promise = fetch(url)
    .then(async r => {
      if (r.ok) {
        return await r.text()
      }
      throw new Error(await r.text())
    })
    .catch(err => {
      fetchCache.delete(url)
      throw err
    })

  fetchCache.set(url, promise)
  return promise
}

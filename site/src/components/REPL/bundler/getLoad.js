import fetchIfUncached from './fetchPackage.js'

export default function (
  fileLookup,
  preloadedPackagesUsed,
  dummyCodePackages
) {
  return async function load (id) {
    if (id in fileLookup) {
      return fileLookup[id].source
    }

    if (id in dummyCodePackages) {
      preloadedPackagesUsed[id] = true
      return dummyCodePackages[id]
    }

    return await fetchIfUncached(id)
  }
}

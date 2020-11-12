export default function getDummyCodePackages (preloaded) {
  const dummyCodePackages = {}

  for (const packageName in preloaded) {
    dummyCodePackages[packageName] = preloaded[packageName].dummyCode
  }

  return dummyCodePackages
}
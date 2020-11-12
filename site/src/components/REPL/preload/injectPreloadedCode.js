export default function injectPreloadedCode (
  _bundled,
  usedPackages,
  preloadedPackages
) {
  let bundled = _bundled

  for (const packageName in usedPackages) {
    bundled = injectPreloadedCodePackage(bundled, preloadedPackages[packageName])
  }

  return bundled
}

export function injectPreloadedCodePackage (bundled, packageMetadata) {
  const codeObj = removeTransformedCode(bundled, packageMetadata)

  if (!codeObj) return bundled

  const {
    codeBefore,
    transformedDummyCode,
    codeAfter
  } = codeObj

  const compilerRenamesObject = getCompilerRenames(transformedDummyCode, packageMetadata)
  const destructureString = getDestructureString(compilerRenamesObject, packageMetadata)

  const fullIIFEExpression = `const ${destructureString} = ${packageMetadata.iife}`

  return [codeBefore, fullIIFEExpression, codeAfter].join('\n')
}

function removeTransformedCode (bundled, packageMetadata) {
  const { name } = packageMetadata

  const startTag = `/* @@START_DUMMY_CODE_${name}@@ */`
  const endTag = `/* @@END_DUMMY_CODE_${name}@@ */`

  const [codeBefore, restCode] = bundled.split(startTag)

  if (restCode === undefined) {
    // If the package is imported but not used, the whole code bit
    // will be missing. In this case we skip the injection
    return null
  }

  const [transformedDummyCode, codeAfter] = restCode.split(endTag)

  return {
    codeBefore: codeBefore.trim(),
    transformedDummyCode: transformedDummyCode.trim(),
    codeAfter: codeAfter.trim()
  }
}

function getCompilerRenames (transformedDummyCode, packageMetadata) {
  if (packageMetadata.defaultExport) {
    const renamedVariable = transformedDummyCode
      .split('const ')[1]
      .split(' = ')[0]

    return { [packageMetadata.defaultName]: renamedVariable }
  }

  if (!packageMetadata.defaultExport) {
    const newIsOld = transformedDummyCode
      .split('\n')
      .map(declaration => declaration.trim())
      .map(declaration => declaration.split(';')[0])
      .filter(declaration => declaration && declaration !== '')
      .map(declaration => declaration.split('const ')[1])

    const newVariableNames = newIsOld.map(pair => pair.split(' = ')[0])
    const oldVariableNames = newIsOld.map(pair => {
      let oldHalve = pair.split(' = ')[1]
      oldHalve = oldHalve.substring(0, oldHalve.length - 1)
      oldHalve = oldHalve.substring(1, oldHalve.length)

      return oldHalve
    })

    const compilerRenamesObject = {}

    for (let i = 0; i < oldVariableNames.length; i++) {
      compilerRenamesObject[oldVariableNames[i]] = newVariableNames[i]
    }

    return compilerRenamesObject
  }
}

function getDestructureString (compilerRenamesObject, packageMetadata) {
  let destructureString = '{'

  for (const originalName in compilerRenamesObject) {
    const newName = compilerRenamesObject[originalName]
    destructureString += ` ${originalName}: ${newName},`
  }

  destructureString = destructureString.substring(0, destructureString.length - 1)
  destructureString += ' }'

  return destructureString
}

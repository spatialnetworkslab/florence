import generateDummyCode from './generateDummyCode.js'

export default function parseCode (minifiedCode, packageMetadata) {
  const newPackageMetadata = {
    name: packageMetadata.name,
    defaultExport: packageMetadata.defaultExport
  }

  if (packageMetadata.defaultExport) {
    newPackageMetadata.defaultName = packageMetadata.defaultName
  }

  if (!packageMetadata.defaultExport) {
    newPackageMetadata.exportsObject = packageMetadata.exportsObject
  }

  const codeBody = packageMetadata.getCodeBody(minifiedCode).trim()

  newPackageMetadata.iife = wrapIIFE(codeBody, newPackageMetadata)
  newPackageMetadata.dummyCode = generateDummyCode(newPackageMetadata)

  if (packageMetadata.name === 'd3-scale') {
    console.log(newPackageMetadata.iife)
  }

  return newPackageMetadata
}

function wrapIIFE (code, newPackageMetadata) {
  const { defaultExport, exportsObject, defaultName } = newPackageMetadata

  const returnValue = defaultExport
    ? wrapObj(defaultName)
    : asString(exportsObject)

  return '(function() {\n' +
    `${code}\n` +
    `return ${returnValue}\n` +
    '})();'
}

function asString (exportsObject) {
  let str = '{'

  for (const key in exportsObject) {
    str += ` ${key}: ${exportsObject[key]},`
  }

  str = str.substring(0, str.length - 1)

  str += ' }'

  return str
}

function wrapObj (defaultName) {
  return `{ ${defaultName}: ${defaultName} }`
}

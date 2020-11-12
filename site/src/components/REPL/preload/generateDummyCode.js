export default function generateDummyCode (packageMetadata) {
  const { name, defaultExport, exportsObject, defaultName } = packageMetadata

  const startTag = `/* @@START_DUMMY_CODE_${name}@@ */`
  const endTag = `/* @@END_DUMMY_CODE_${name}@@ */`

  let dummyCode = startTag + '\n'

  if (defaultExport) {
    dummyCode += `const ${defaultName} = '${defaultName}'\n` +
     `export default ${defaultName}\n`
  } else {
    for (const exportName in exportsObject) {
      dummyCode += `export const ${exportName} = '${exportName}'\n`
    }
  }

  dummyCode += endTag

  return dummyCode
}

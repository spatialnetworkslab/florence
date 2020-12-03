import fs from 'fs'
import path from 'path'
import visit from 'unist-util-visit'
import glob from 'glob'

export default function loadExampleCode (options) {
  return function transformer (tree) {
    const exampleNodes = getExampleNodes(tree)
    exampleNodes.forEach(handleNode)

    return tree
  }
}

const IMAGE_DIRECTORY = 'static/images/examples/'
const DATA_DIRECTORY = 'static/data/'

function ensureTargetDirsExist (targetDirs) {
  for (const dir of targetDirs) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

ensureTargetDirsExist([IMAGE_DIRECTORY, DATA_DIRECTORY])

function getExampleNodes (tree) {
  const exampleNodes = []

  visit(tree, 'example', node => {
    if ('example' in node.data) {
      exampleNodes.push({
        node
      })
    }
  })

  return exampleNodes
}

function handleNode ({ node }) {
  const relativeDirectory = node.data.example.location
  const directory = path.join(process.cwd(), relativeDirectory)

  const filesNames = glob.sync(
    path.join(directory, '**'),
    { nodir: true }
  )

  ensureDirectoryIsValid(filesNames)
  handleThumbnail(directory)

  if (hasData(filesNames)) handleData(filesNames)

  insertREPL(node, filesNames)
}

const THUMBNAIL = 'thumbnail.png'

function ensureDirectoryIsValid (fileNames) {
  return (
    fileNames.some(fileName => fileName.endsWith('App.svelte')) &&
    fileNames.some(fileName => fileName.endsWith(THUMBNAIL))
  )
}

function handleThumbnail (directory) {
  const imagePath = path.join(directory, THUMBNAIL)
  const exampleName = path.basename(directory)

  copyThumbnail(imagePath, IMAGE_DIRECTORY, exampleName)
}

function copyThumbnail (source, targetDir, exampleName) {
  const target = path.join(targetDir, exampleName + '.png')
  fs.copyFileSync(source, target)
}

const isInDataFolder = fileName => path.dirname(fileName).endsWith('/data')

function hasData (fileNames) {
  return fileNames.some(isInDataFolder)
}

function handleData (fileNames) {
  fileNames.forEach(fileName => {
    if (isInDataFolder(fileName)) {
      const target = path.join(DATA_DIRECTORY, path.basename(fileName))
      fs.copyFileSync(fileName, target)
    }
  })
}

const scriptCode = [
  'import REPL from \'@snlab/florence-repl\'',
  '',
  'let containerWidth',
  'let windowHeight'
].join('\n')

function insertREPL (node, fileNames) {
  const scriptTags = {
    type: 'code',
    lang: 'js',
    meta: 'exec',
    value: scriptCode
  }

  const files = readFiles(fileNames)
  const replElement = createReplElement(files)
  const replWrapper = createReplWrapper(replElement)

  node.children = [scriptTags, css, replWrapper]
}

function readFiles (fileNames) {
  let idCounter = 0

  const files = fileNames.filter(withoutDataAndThumbnail).map(file => {
    const fileContents = fs.readFileSync(file).toString()

    if (file.endsWith('App.svelte')) return createAppFile(fileContents)

    idCounter++

    const { name, type } = getNameAndType(file)

    return {
      id: idCounter,
      name,
      type,
      source: fileContents
    }
  })

  files.sort((a, b) => a.id - b.id)

  return files
}

function withoutDataAndThumbnail (file) {
  return !(
    isInDataFolder(file) ||
    file.endsWith(THUMBNAIL)
  )
}

function createAppFile (fileContents) {
  return {
    id: 0,
    name: 'App',
    type: 'svelte',
    source: fileContents
  }
}

function getNameAndType (fileName) {
  const split = path.basename(fileName).split('.')

  const type = split.pop()

  return split.length === 1
    ? { name: split[0], type }
    : { name: split.join('.'), type }
}

function createReplElement (files) {
  return {
    type: 'renderedComponent',
    data: {
      tagName: 'REPL',
      hName: 'REPL',
      hProperties: {
        replFiles: `{${JSON.stringify(files)}}`,
        width: '{containerWidth}',
        height: '{containerWidth * 0.6}',
        debounce: '{400}'
      }
    }
  }
}

const css = {
  type: 'html',
  value: '<style>\n.repl {\n @apply border border-gray-100;\n }\n</style>'
}

function createReplWrapper (replElement) {
  return {
    type: 'element',
    data: {
      tagName: 'div',
      hName: 'div',
      hProperties: {
        class: 'repl',
        'bind:clientWidth': '{containerWidth}'
      }
    },
    children: [
      startIf,
      replElement,
      endIf
    ]
  }
}

const startIf = {
  type: 'html',
  value: '\n{#if containerWidth}\n'
}

const endIf = {
  type: 'html',
  value: '\n{/if}\n'
}

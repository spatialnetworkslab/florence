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
  const pathToFile = node.data.example.location
  const cwd = process.cwd()
  const directory = path.join(cwd, path.dirname(pathToFile))

  handleThumbnail(directory)
  handleData(directory)

  const file = fs.readFileSync(pathToFile).toString()
  insertREPL(node, file)
}

const IMAGE_DIRECTORY = 'static/images/examples/'

function handleThumbnail (directory) {
  const imagePath = path.join(directory, 'thumbnail.png')
  const exampleName = path.basename(directory)

  copyThumbnail(imagePath, IMAGE_DIRECTORY, exampleName)
}

function copyThumbnail (source, targetDir, exampleName) {
  const target = path.join(targetDir, exampleName + '.png')
  fs.copyFileSync(source, target)
}

const DATA_DIRECTORY = 'static/data/'

function handleData (directory) {
  const fileNames = glob.sync(path.join(directory, '**'), {
    nodir: true,
    ignore: ['**/node_modules/**', '**/.metadata', '**/thumbnail.png']
  })

  fileNames.forEach(f => {
    if (f.includes('public/data/')) {
      const target = path.join(DATA_DIRECTORY, path.basename(f))
      fs.copyFileSync(f, target)
    }
  })
}

function insertREPL (node, file) {
  const scriptTags = {
    type: 'code',
    lang: 'js',
    meta: 'exec',
    value: 'import REPL from \'@snlab/florence-repl\'' + '\n' +
      'import { getPreloadedPackages } from \'../../preloadPackages.js\'' + '\n' +
      'const preloaded = getPreloadedPackages()'
  }

  const app = createAppFile(file)

  const replElement = {
    type: 'renderedComponent',
    data: {
      tagName: 'REPL',
      hName: 'REPL',
      hProperties: {
        replFiles: `{${JSON.stringify([app])}}`,
        preloaded: '{preloaded}',
        width: '{1000}',
        height: '{600}'
      }
    }
  }

  node.children = [scriptTags, replElement]
}

function createAppFile (file) {
  return {
    id: 0,
    name: 'App',
    type: 'svelte',
    source: file
  }
}

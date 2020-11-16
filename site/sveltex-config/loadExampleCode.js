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

const scriptCode = [
  'import REPL from \'@snlab/florence-repl\'',
  'import { onMount, onDestroy } from \'svelte\'',
  'import { getPreloadedPackages } from \'../../preloadPackages.js\'',
  '',
  'const preloaded = getPreloadedPackages()',
  '',
  'let offsetTop',
  'let windowWidth',
  'let windowHeight',
  '',
  'function convertRemToPixels(rem) {',
  '  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)',
  '}',
  '',
  '$: replWidth = windowWidth - convertRemToPixels(2)',
  '$: replHeight = windowHeight && offsetTop ? (windowHeight - offsetTop - convertRemToPixels(1)) : null',
  '',
  'const handleResize = () => {',
  '  offsetTop = document.getElementById(\'repl-wrapper\').offsetTop',
  '  windowWidth = window.innerWidth',
  '  windowHeight = window.innerHeight',
  '}',
  '',
  'onMount(() => {',
  '  window.addEventListener(\'resize\', handleResize)',
  '  handleResize()',
  '})',
  '',
  'onDestroy(() => {',
  '  window.removeEventListener(\'resize\', handleResize)',
  '})'
].join('\n')

function insertREPL (node, file) {
  const scriptTags = {
    type: 'code',
    lang: 'js',
    meta: 'exec',
    value: scriptCode
  }

  const app = createAppFile(file)
  const replElement = createReplElement(app)
  const replWrapper = createReplWrapper(replElement)

  node.children = [scriptTags, replWrapper]
}

function createAppFile (file) {
  return {
    id: 0,
    name: 'App',
    type: 'svelte',
    source: file
  }
}

function createReplElement (app) {
  return {
    type: 'renderedComponent',
    data: {
      tagName: 'REPL',
      hName: 'REPL',
      hProperties: {
        replFiles: `{${JSON.stringify([app])}}`,
        preloaded: '{preloaded}',
        width: '{replWidth}',
        height: '{replHeight}'
      }
    }
  }
}

function createReplWrapper (replElement) {
  return {
    type: 'element',
    data: {
      tagName: 'div',
      hName: 'div',
      hProperties: {
        id: 'repl-wrapper'
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
  value: '\n{#if replHeight}\n'
}

const endIf = {
  type: 'html',
  value: '\n{/if}\n'
}

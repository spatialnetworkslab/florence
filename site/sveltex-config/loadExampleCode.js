import visit from 'unist-util-visit'
import hash from 'object-hash'
import fs from 'fs'
import path from 'path'
import glob from 'glob'
import yaml from 'js-yaml'
import fetch from 'node-fetch'
import MultiRange from 'multi-integer-range'

const imageDir = 'static/images/examples/'
const dataDir = 'static/data/'

export default function loadExampleCode (options) {
  return async function transformer (tree) {
    const nodesToChange = []
    visit(tree, 'example', node => {
      if ('example' in node.data) {
        nodesToChange.push({
          node
        })
      }
    })
    for (const { node } of nodesToChange) {
      const { location, range } = node.data.example
      let sandboxUrl
      let componentTagName = 'example'
      // placeholder for snippet
      const snippet = []
      let fileContents = ''
      try {
        const dir = location
        // cache sandboxId for use as tag name later
        const { url, sandboxId } = await getSandboxURL(dir)
        sandboxUrl = url
        // svelte component is valid only first letter in tag name is capitalied
        componentTagName += sandboxId.toUpperCase()
        // read the file
        const file = await fs.readFileSync(dir)
        // setting code block value to the file string
        fileContents = file.toString()
        // splitting to get all lines in array
        const lines = fileContents.split('\n')

        const parsedRange = new MultiRange(range)
        if (
          parsedRange.min() > lines.length ||
          parsedRange.max() > lines.length
        ) {
          // range extends beyond lines
          return
        }
        let prevLine = parsedRange.min()
        for (const line of parsedRange) {
          if (line - prevLine > 1) {
            snippet.push('\n/* SNIP */\n')
          }
          snippet.push(lines[line - 1])
          prevLine = line
        }
      } catch (e) {
        console.log('ERROR', e)
      }
      /*
        <div class="example-container">
            <div class="example-rendered">
                <!-- svelte component here -->
            </div>
            <div class="example-code-tabs">
              <div class="tab">
                <input type="radio" id="tab-1" name="tab-group-1" checked>
                <label for="tab-1">Full code</label>
                <div class="example-full-code">
                  <!-- full contents of App.svelte -->
                </div>
              </div>
              <div class="tab">
                <input type="radio" id="tab-2" name="tab-group-1">
                <label for="tab-2">Snippet</label>
                <div class="example-code-highlight">
                    <!-- highlighted contents of App.svelte -->
                </div>
              </div>
            </div>
            <div class="example-csb-link">
                <a href="link/to/csb">Edit</a>
            </div>
        </div>
      */
      // add wrapper class to root
      node.data.hProperties = {
        className: [componentTagName + '-container', 'example-container']
      }

      // by default code section appears first in node.children
      const codeSection = {
        type: 'element',
        data: {
          hName: 'div',
          hProperties: {
            className: [componentTagName + '-code', 'example-content', 'example-code']
          }
        },
        children: [
          {
            type: 'code',
            lang: 'svelte',
            meta: null,
            value: fileContents
          }
        ]
      }
      const codeSnippetSection = {
        type: 'element',
        data: {
          hName: 'div',
          hProperties: {
            className: [
              componentTagName + '-code-snippets',
              'example-content',
              'example-code-snippets'
            ]
          }
        },
        children: [
          {
            type: 'code',
            lang: 'svelte',
            meta: null,
            value: snippet.join('\n')
          }
        ]
      }

      // <div class="example-tab">
      //   <input type="radio" id="tab-1" name="tab-group-1" checked>
      //     <label for="tab-1">Full code</label>
      //     <div class="example-code-snippets">
      //       <!-- full contents of App.svelte -->
      //             </div>
      //           </div>
      const fullCodeTab = {
        type: 'element',
        data: {
          hName: 'div',
          hProperties: {
            className: [
              componentTagName + '-fullcode-tab',
              'example-tab',
              'example-fullcode-tab'
            ]
          }
        },
        children: [
          {
            type: 'element',
            data: {
              hName: 'input',
              hProperties: {
                type: 'radio',
                id: 'tab-1-' + componentTagName,
                name: 'tab-group-' + componentTagName,
                checked: true
              }
            }
          },
          {
            type: 'element',
            data: {
              hName: 'label',
              hProperties: {
                for: 'tab-1-' + componentTagName
              }
            },
            children: [
              {
                type: 'element',
                value: 'Code'
              }
            ]
          },
          codeSection
        ]
      }

      const snippetTab = {
        type: 'element',
        data: {
          hName: 'div',
          hProperties: {
            className: [
              componentTagName + '-snippet-tab',
              'example-tab',
              'example-snippet-tab'
            ]
          }
        },
        children: [
          {
            type: 'element',
            data: {
              hName: 'input',
              hProperties: {
                type: 'radio',
                id: 'tab-2-' + componentTagName,
                name: 'tab-group-' + componentTagName
              }
            }
          },
          {
            type: 'label',
            data: {
              hName: 'label',
              hProperties: {
                for: 'tab-2-' + componentTagName
              }
            },
            children: [
              {
                type: 'element',
                value: 'Key snippets'
              }
            ]
          },
          codeSnippetSection
        ]
      }
      const renderedSection = {
        type: 'element',
        data: {
          hName: 'div',
          hProperties: {
            className: [componentTagName + '-rendered', 'example-rendered']
          }
        },
        children: [
          // insert the imported component after sandbox
          {
            type: 'renderedComponent',
            data: {
              tagName: 'svelte:component',
              hName: 'svelte:component',
              hProperties: {
                this: `{${componentTagName}}`
              }
            }
          }
        ]
      }
      const sandboxUrlSection = {
        type: 'element',
        data: {
          hName: 'div',
          hProperties: {
            className: [
              componentTagName + '-csb-link',
              'example-tab',
              'example-csb-link'
            ]
          }
        },
        children: [
          {
            type: 'element',
            data: {
              tagName: 'a',
              hName: 'a',
              hProperties: {
                href: sandboxUrl,
                rel: 'noopener noreferrer',
                target: '_blank'
              }
            },
            children: [
              {
                type: 'span',
                value: 'Edit on CodeSandBox'
              }
            ]
          }
        ]
      }
      const exampleCodeTabs = {
        type: 'element',
        data: {
          hName: 'div',
          hProperties: {
            className: [componentTagName + '-code-tabs', 'example-code-tabs']
          }
        },
        children: [fullCodeTab, snippetTab, sandboxUrlSection]
      }
      // artificially create a code exec block
      const importRenderingExample = {
        type: 'code',
        lang: 'js',
        meta: 'exec',
        value: `import ${componentTagName} from '${path.resolve(location)}'`
      }
      const sectionsInOrder = [
        importRenderingExample,
        renderedSection,
        exampleCodeTabs
      ]
      node.children = sectionsInOrder
    }
    return tree
  }
}

async function getSandboxURL (directory) {
  const cwd = process.cwd()
  const directoryPath = path.join(cwd, path.dirname(directory))
  const absolutePath = path.join(directoryPath, '**')
  const fileNames = glob.sync(absolutePath, {
    nodir: true,
    ignore: ['**/node_modules/**', '**/.metadata', '**/thumbnail.png']
  }) // ignore node_modules
  const files = {}
  for (let index = 0; index < fileNames.length; index++) {
    const fileName = fileNames[index]
    files[path.relative(directoryPath, fileName)] = {
      content: fs.readFileSync(fileName, 'utf-8')
    }
  }
  const filesHash = hash(files)
  // dump yaml to the folder that the example resides
  const metadataPath = path.join(path.dirname(absolutePath), '.metadata')
  let metadata
  if (fs.existsSync(metadataPath)) {
    metadata = yaml.safeLoad(fs.readFileSync(metadataPath, 'utf8'))
  } else {
    metadata = {
      sandbox_id: '',
      hash: ''
    }
  }

  if (filesHash !== metadata.hash) {
    let res
    try {
      res = await fetch(
        'https://codesandbox.io/api/v1/sandboxes/define?json=1',
        {
          method: 'post',
          body: JSON.stringify({ files: files }),
          headers: { 'Content-Type': 'application/json' }
        }
      ).then(res => res.json())
    } catch (err) {
      console.log(err, 'error')
    }
    metadata.sandbox_id = res.sandbox_id
    metadata.hash = filesHash

    // copy thumbnail
    const imagePath = path.join(path.dirname(absolutePath), 'thumbnail.png')
    const exampleName = path.basename(path.dirname(absolutePath))
    copyThumbnail(imagePath, imageDir, exampleName)

    // copy data
    fileNames.forEach(f => {
      if (f.includes('public/data/')) {
        const target = path.join(dataDir, path.basename(f))
        fs.copyFileSync(f, target)
      }
    })

    // finish writing metadata
    fs.writeFileSync(metadataPath, yaml.safeDump(metadata), 'utf8')
  }
  const url = `https://codesandbox.io/s/${metadata.sandbox_id}`
  return { url, sandboxId: metadata.sandbox_id }
}

function copyThumbnail (source, targetDir, exampleName) {
  const target = path.join(targetDir, exampleName + '.png')
  fs.copyFileSync(source, target)
}

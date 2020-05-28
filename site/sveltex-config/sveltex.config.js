import unified from 'unified'
import {
  blocks, copyFrontmatter, csbBlock,
  solutionHide, csbUpload, svelteInline, svelteBlock,
  svelteElementBlock, svelteElementInline, execCodeBlocks,
  svelteSyntax, escapeCurlies, markdown, frontmatter, parseFrontmatter, containers,
  math, remark2rehype, katex, prism, html, makeSveltePreprocessor
} from '@snlab/sveltex-unified'

import exampleBlock from './example.js'
import exampleUpload from './exampleUpload.js'

const defaultProcessor = unified()
  .use(markdown, { blocks: blocks })
  .use(frontmatter)
  .use(parseFrontmatter)
  .use(copyFrontmatter)
  .use(containers, {
    default: true,
    custom: [
      {
        type: 'codesandbox',
        element: 'iframe',
        transform: csbBlock
      },
      {
        type: 'example',
        element: 'div',
        transform: exampleBlock
      }
    ]
  })
  .use(solutionHide)
  .use(csbUpload)
  .use(exampleUpload)
  .use(svelteInline)
  .use(svelteBlock)
  .use(svelteElementBlock)
  .use(svelteElementInline)
  .use(math)
  .use(execCodeBlocks)
  .use(remark2rehype, { allowDangerousHTML: true })
  .use(katex)
  .use(prism, { registerSyntax: [svelteSyntax] })
  .use(escapeCurlies)
  .use(html, { allowDangerousHTML: false })

export const sveltex = makeSveltePreprocessor(defaultProcessor) // convert processor to svelte preprocessor

import unified from 'unified'
import {
  blocks, copyFrontmatter,
  solutionHide, svelteInline, svelteBlock,
  svelteElementBlock, svelteElementInline, execCodeBlocks,
  svelteSyntax, escapeCurlies, markdown, frontmatter, parseFrontmatter, containers,
  math, remark2rehype, katex, prism, html, makeSveltePreprocessor
} from '@snlab/sveltex-unified'

import parseExampleBlock from './parseExampleBlock.js'
import loadExampleCode from './loadExampleCode.js'

const defaultProcessor = unified()
  .use(markdown, { blocks: blocks })
  .use(frontmatter)
  .use(parseFrontmatter)
  .use(copyFrontmatter)
  .use(containers, {
    default: true,
    custom: [
      {
        type: 'example',
        element: 'div',
        transform: parseExampleBlock
      }
    ]
  })
  .use(solutionHide)
  .use(loadExampleCode)
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

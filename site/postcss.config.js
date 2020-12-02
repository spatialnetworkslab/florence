const sveltex = require('@snlab/sveltex-unified')
const purgeHtml = require('purgecss-from-html')
const purgeSvelte = require('purgecss-from-svelte')
const tailwindcss = require('tailwindcss')

const purgeFromMd = async (content) => {
  const result = await sveltex.defaultProcessor.process(content)
  const html = result.toString()
  return purgeSvelte.extract(html)
}

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.sveltex', './src/**/*.svelte', './src/**/*.html'],
  extractors: [
    {
      extractor: purgeFromMd,
      extensions: ['sveltex']
    },
    {
      extractor: purgeHtml,
      extensions: ['html']
    },
    {
      extractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
      extensions: ['svelte']
    }]
})

module.exports = {
  plugins: [
    tailwindcss('./tailwind.js'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
  ]
}

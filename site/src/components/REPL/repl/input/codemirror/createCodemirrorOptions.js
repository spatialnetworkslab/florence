export function createCodemirrorOptions (lineNumbers, mode, readonly, tab) {
  const options = {
    lineNumbers,
    lineWrapping: true,
    indentWithTabs: true,
    indentUnit: 2,
    tabSize: 2,
    value: '',
    mode: MODES[mode] || {
      name: mode
    },
    readOnly: readonly,
    autoCloseBrackets: true,
    autoCloseTags: true,
    extraKeys: {
      Enter: 'newlineAndIndentContinueMarkdownList',
      'Ctrl-/': 'toggleComment',
      'Cmd-/': 'toggleComment'

    }
  }

  if (!tab) {
    options.extraKeys.Tab = tab
    options.extraKeys['Shift-Tab'] = tab
  }

  return options
}

const MODES = {
  js: {
    name: 'javascript',
    json: false
  },
  json: {
    name: 'javascript',
    json: true
  },
  svelte: {
    name: 'handlebars',
    base: 'text/html'
  },
  md: {
    name: 'markdown'
  }
}

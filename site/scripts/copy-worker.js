const sh = require('shelljs')

sh.mkdir('-p', 'static/workers/')
sh.rm('-rf', 'static/workers/bundler.js')
sh.rm('-rf', 'static/workers/bundler.js.map')
sh.cp('-r', 'node_modules/@snlab/florence-repl/public/workers/bundler.js', 'static/workers/bundler.js')
sh.cp('-r', 'node_modules/@snlab/florence-repl/public/workers/bundler.js.map', 'static/workers/bundler.js.map')

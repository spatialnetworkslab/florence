const sh = require('shelljs')

sh.rm('-rf', 'static/bundler.js')
sh.rm('-rf', 'static/bundler.js.map')
sh.cp('-r', 'node_modules/@snlab/florence-repl/public/bundler.js', 'static')
sh.cp('-r', 'node_modules/@snlab/florence-repl/public/bundler.js.map', 'static')

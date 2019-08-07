import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import globals from 'rollup-plugin-node-globals'
import json from 'rollup-plugin-json'

const production = !process.env.ROLLUP_WATCH

export default {
  input: __dirname + '/src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: __dirname + '/public/bundle.js'
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write(__dirname + '/public/bundle.css')
      }
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({ browser: true }),
    commonjs(),

    json({
      include: ['**/src/data/**'],
      compact: true
    }),

    // Allows you to use 'process'
    globals(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload(__dirname + '/public/'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
}

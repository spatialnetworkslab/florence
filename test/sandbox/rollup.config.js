import svelte from 'rollup-plugin-svelte'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import globals from 'rollup-plugin-node-globals'
import json from 'rollup-plugin-json'
import dsv from 'rollup-plugin-dsv'
import css from 'rollup-plugin-css-only'

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
      compilerOptions: {
        dev: !production
      }
    }),

    css({ output: 'bundle.css' }),
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    nodeResolve(),
    commonjs(),

    json({
      include: ['**/src/data/**'],
      compact: true
    }),

    dsv(),

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

import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import babel from 'rollup-plugin-babel'

import pkg from './package.json'

export default {
  input: 'src/browser.js',
  output: [
    {
      file: pkg.browser,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    url(),
    resolve(),
    babel({
      babelrc: true,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    commonjs(),
  ],
}

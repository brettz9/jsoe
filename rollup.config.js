import builtins from 'rollup-plugin-node-builtins';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import babel from 'rollup-plugin-babel';
// import {terser} from 'rollup-plugin-terser';
import istanbul from 'rollup-plugin-istanbul';
import noOp from 'rollup-plugin-no-op';

export default [{
  input: 'src/index.js',
  external: ['react'], // Todo: remove when removed from Zodex
  output: {
    file: 'dist/index.js',
    format: 'es'
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
}, {
  input: 'demo/index-instrumented.js',
  output: {
    file: 'instrumented/demo/index.js',
    format: 'es'
  },
  plugins: [
    noOp({ids: ['react']}), // todo: remove when Zodex may remove dep.
    istanbul(),
    nodeResolve(),
    commonjs()
  ]
}, {
  input: 'demo/index-schema.js',
  output: {
    file: 'instrumented/demo/index-schema.js',
    format: 'es'
  },
  plugins: [
    noOp({ids: ['react']}), // todo: remove when Zodex may remove dep.
    istanbul(),
    nodeResolve(),
    commonjs()
  ]
}, {
  input: 'demo/schema-preloaded.js',
  output: {
    file: 'instrumented/demo/schema-preloaded.js',
    format: 'es'
  },
  plugins: [
    noOp({ids: ['react']}), // todo: remove when Zodex may remove dep.
    istanbul(),
    nodeResolve(),
    commonjs()
  ]
}, {
  input: 'demo/schema-preloaded-array.js',
  output: {
    file: 'instrumented/demo/schema-preloaded-array.js',
    format: 'es'
  },
  plugins: [
    noOp({ids: ['react']}), // todo: remove when Zodex may remove dep.
    istanbul(),
    nodeResolve(),
    commonjs()
  ]
}, {
  input: 'node_modules/fast-deep-equal/es6/index.js',
  output: {
    file: 'src/deepEqual.js',
    format: 'es',
    name: 'deepEqual'
  },
  plugins: [
    /*
        babel(),
        terser({
            // Needed for Typeson's `Undefined` and other constructor detection
            keep_fnames: true,
            keep_classnames: true // Keep in case implementing above as classes
        }),
        */
    builtins(),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    })
  ]
}];

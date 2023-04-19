import builtins from 'rollup-plugin-node-builtins';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import babel from 'rollup-plugin-babel';
// import {terser} from 'rollup-plugin-terser';

export default {
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
};

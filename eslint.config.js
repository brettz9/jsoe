import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'coverage',
      'instrumented',
      'ignore',
      'src/deepEqual.js',
      'vendor',
      'typings/**',
      'dist'
    ]
  },
  ...ashNazg(['sauron', 'browser']),
  {
    // Until escompat ready for flat config, we have to set ourselves
    languageOptions: {
      ecmaVersion: 2020
    },
    settings: {
      polyfills: [],
      coverage: true
    }
  },
  {
    files: ['*.md/*.js'],
    rules: {
      'import/unambiguous': 'off'
    }
  },
  {
    files: ['cypress/**'],
    rules: {
      'unicorn/no-empty-file': 'off'
    }
  },
  {
    // We can afford to have a more cutting edge demo (using top-level await),
    //   as long as we support earlier browsers normally
    files: ['demo/**'],
    languageOptions: {
      ecmaVersion: 2022
    }
  },
  {
    rules: {
      'no-console': 0,
      'no-shadow': 0,
      // 'jsdoc/require-jsdoc': ['error', {
      //   require: {
      //     ArrowFunctionExpression: true,
      //     ClassDeclaration: true,
      //     ClassExpression: true,
      //     FunctionDeclaration: true,
      //     FunctionExpression: true,
      //     MethodDefinition: true
      //   }
      // }],
      quotes: ['error', 'single', {
        avoidEscape: true, allowTemplateLiterals: true
      }],

      'jsdoc/require-jsdoc': ['warn', {
        contexts: [
          'Program > VariableDeclaration > ' +
            'VariableDeclarator > ArrowFunctionExpression',
          'Program > VariableDeclaration > ' +
            'VariableDeclarator > FunctionExpression',
          'ExportNamedDeclaration > VariableDeclaration > ' +
            'VariableDeclarator > ArrowFunctionExpression',
          'ExportNamedDeclaration > VariableDeclaration > ' +
            'VariableDeclarator > FunctionExpression',
          'ExportDefaultDeclaration > ArrowFunctionExpression',
          'ExportDefaultDeclaration > FunctionExpression',

          'ClassDeclaration',
          'ClassExpression',
          'FunctionDeclaration', // Default is true
          'MethodDefinition'
        ]
      }],

      // Disable until find time
      'prefer-named-capture-group': 0,
      '@eslint-community/eslint-comments/require-description': 0,
      // Disable; waiting on https://github.com/mysticatea/eslint-plugin-node/issues/162
      'n/no-unpublished-import': 0,
      'unicorn/no-this-assignment': 0
    }
  }
];

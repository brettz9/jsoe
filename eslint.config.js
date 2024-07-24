import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    name: 'JSOE/Ignores',
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
    name: 'JSOE/Coverage',
    settings: {
      coverage: true
    }
  },
  {
    name: 'JSOE/Markdown',
    files: ['*.md/*.js'],
    rules: {
      'import/unambiguous': 'off'
    }
  },
  {
    name: 'JSOE/Cypress',
    files: ['cypress/**'],
    rules: {
      'unicorn/no-empty-file': 'off'
    }
  },
  {
    name: 'JSOE/main rules',
    rules: {
      'no-console': 0,
      'no-shadow': 0,

      '@stylistic/quotes': ['error', 'single', {
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
      // Disable; waiting on https://github.com/mysticatea/eslint-plugin-node/issues/162
      'n/no-unpublished-import': 0,
      'unicorn/no-this-assignment': 0
    }
  }
];

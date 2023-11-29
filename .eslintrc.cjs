'use strict';

module.exports = {
  extends: ['ash-nazg/sauron-node-overrides', 'plugin:cypress/recommended'],
  parserOptions: {
    ecmaVersion: 2022
  },
  settings: {
    jsdoc: {
      mode: 'typescript'
    },
    polyfills: [
      'AggregateError',
      'Array.isArray',
      'Array.filter',
      'Array.flatMap',
      'Array.forEach',
      'Array.from',
      'Array.includes',
      'Array.map',
      'Array.reduce',
      'ArrayBuffer',
      'BigInt',
      'Blob',
      'btoa',
      'console',
      'crypto',
      'Date.toISOString',
      'document.body',
      'document.createDocumentFragment',
      'document.querySelector',
      'document.querySelectorAll',
      'DOMException',
      'DOMMatrix',
      'DOMPoint',
      'DOMRect',
      'Error',
      'fetch',
      'File',
      'FileList',
      'FileList.item',
      'FileReader',
      'history',
      'IDBKeyRange',
      'indexedDB',
      'JSON',
      'location.hash',
      'location.href',
      'location.pathname',
      'Map',
      'MediaRecorder',
      'MutationObserver',
      'navigator.mediaDevices',
      'Number.isNaN',
      'Number.parseFloat',
      'Number.parseInt',
      'Object.assign',
      'Object.hasOwn',
      'Object.is',
      'Object.keys',
      'Object.entries',
      'Object.values',
      'Promise',
      'requestAnimationFrame',
      'Set',
      'String.replaceAll',
      'Symbol.toStringTag',
      'Uint8Array',
      'URL',
      'URLSearchParams',
      'WeakMap'
    ],
    coverage: true
  },
  env: {
    node: false,
    browser: true
  },
  overrides: [
    {
      files: '*.md/*.js',
      rules: {
        'import/unambiguous': 'off'
      }
    },
    {
      files: 'cypress/**',
      rules: {
        'import/unambiguous': 'off'
      }
    }
  ],
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
    'eslint-comments/require-description': 0,
    // Disable until rule improved?
    'require-atomic-updates': 0,
    // Disable; waiting on https://github.com/mysticatea/eslint-plugin-node/issues/162
    'n/no-unpublished-import': 0,
    'unicorn/no-this-assignment': 0
  }
};

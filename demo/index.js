import {jml, body} from '../node_modules/jamilih/dist/jml-es-noinnerh.js';

import {
  typeChoices, getFormatAndSchemaChoices
  // Types, Formats
} from '../src/index.js';

jml('section', {role: 'main'}, [
  ['h2', [
    'Key path expected (object required at root)'
  ]],
  ...typeChoices({
    hasKeyPath: true,
    typeNamespace: 'demo-keypath-expected'
  }),
  ['h2', [
    'No key path expected (type can vary at root)'
  ]],
  ...typeChoices({
    hasKeyPath: false,
    typeNamespace: 'demo-keypath-not-expected'
  }),
  ['h2', [
    'Format choices without type selection ' +
      '(might use as retrieval return format)'
  ]],
  ['select', [
    getFormatAndSchemaChoices()
  ]]
], body);

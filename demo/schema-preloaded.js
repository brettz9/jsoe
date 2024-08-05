import {jml, body} from '../src/vendor-imports.js';
import {
  typeChoices
} from '../src/index.js';

import {
  schemaInstanceJSON, schemaInstanceJSON2
  // schemaInstanceJSON3,
  // schemaInstanceJSON4, schemaInstanceJSON5, schemaInstanceJSON6,
  // schemaInstanceJSON7, schemaInstanceJSON8, schemaInstanceJSON9,
  // schemaInstanceJSON10, schemaInstanceJSON11
} from './schema-data.js';

/**
 * @param {any[]} values
 * @param {import('zodex').SzType} schema
 * @returns {import('jamilih').JamilihChildren}
 */
function getTypeChoices (values, schema) {
  return values.flatMap((value, idx) => {
    return typeChoices({
      format: 'schema',
      setValue: true,
      value,
      schema,
      schemaContent: schema.options[idx],
      typeNamespace: 'demo-type-choices-only-initial-value'
    }).domArray;
  });
}

setTimeout(function () {
  jml('section', {role: 'main'}, [
    ['h1', [
      'Jsoe schema testing'
    ]],
    ['form', [
      ...getTypeChoices([
        false, 123, Number.NaN, 456n, 'a string'
      ], schemaInstanceJSON),
      ...getTypeChoices([
        undefined, 'ghi', false, 135, 'abcde', {}
        // Todo: Finish
      ], schemaInstanceJSON2)
    ]]
  ], body);
});

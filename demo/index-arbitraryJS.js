import {jml, body, $} from '../src/vendor-imports.js';

import {
  formatAndTypeChoices,
  typeChoices,
  Types
} from '../src/index.js';

/**
 * @param {any[]} values
 * @param {import('zodex').SzType} schema
 * @returns {import('jamilih').JamilihChildren}
 */
function getTypeChoices (values, schema) {
  return [['section', values.map((value, idx) => {
    return ['div', {class: 'innerItem'}, [
      ...typeChoices({
        format: 'schema',
        setValue: true,
        typeNamespace: 'demo-type-choices-only-initial-value',
        // schema: '',

        value,
        schemaContent: schema.options[idx],
        schemaOriginal: schema.options[idx]
      }).domArray
    ]];
  })]];
}

const schemaInstanceJSONArbitraryJS = {
  type: 'union',
  options: [
    {
      description: 'A symbol',
      type: 'symbol'
    },
    {
      description: 'A symbol (global)',
      type: 'symbol'
    }
    // {
    //   description: 'A promise',
    //   type: 'promise'
    // },
    // {
    //   description: 'A function',
    //   type: 'function'
    // }
  ]
};

/**
 * @param {string} schema
 * @throws {Error}
 * @returns {import('zodex').SzType}
 */
function getSchemaContent (schema) {
  switch (schema) {
  case 'Zodex arbitrary JS schema':
    return schemaInstanceJSONArbitraryJS;
  default:
    throw new Error('Unexpected schema ' + schema);
  }
}

const keyPathNotExpectedTypeChoices = await formatAndTypeChoices({
  hasKeyPath: false,
  arbitraryJS: true,
  preselectSchema: false,
  typeNamespace: 'demo-keypath-not-expected',
  schemas: ['Zodex arbitrary JS schema'],
  getSchemaContent
});

jml('section', {role: 'main'}, [
  ['h1', [
    'Jsoe testing'
  ]],
  ['h2', [
    'Format and type choices: No key path expected (type can vary at root)'
  ]],

  // Put inside form so can validate
  ['form', {id: 'formatAndTypeChoices'}, [
    ...keyPathNotExpectedTypeChoices.domArray
  ]],

  ['button', {
    id: 'getType',
    $on: {
      click () {
        // eslint-disable-next-line no-alert -- Simple demo
        alert(keyPathNotExpectedTypeChoices.getType());
      }
    }
  }, ['Get type']],

  ['button', {
    id: 'isValid',
    $on: {
      click () {
        // eslint-disable-next-line no-alert -- Simple demo
        alert(keyPathNotExpectedTypeChoices.validValuesSet());
      }
    }
  }, ['Is valid']],

  ['button', {
    id: 'logValue',
    $on: {
      click () {
        console.log(keyPathNotExpectedTypeChoices.getValue());
      }
    }
  }, ['Log value']],

  ['button', {
    id: 'viewUI',
    $on: {
      async click () {
        const controls =
          // eslint-disable-next-line @stylistic/max-len -- Long
          (await keyPathNotExpectedTypeChoices.formats.getControlsForFormatAndValue(
            keyPathNotExpectedTypeChoices.types,
            $('#formatAndTypeChoices .formatChoices').value,
            keyPathNotExpectedTypeChoices.getValue(),
            {
              readonly: true,
              schemaContent: keyPathNotExpectedTypeChoices.formatChoices.
                selectedOptions[0].dataset.schema
                ? await getSchemaContent(
                  keyPathNotExpectedTypeChoices.formatChoices.
                    selectedOptions[0].dataset.schema
                )
                : undefined
            }
          )).rootUI;
        $('#viewUIResults').firstChild?.remove();
        $('#viewUIResults').append(controls);
      }
    }
  }, ['view UI']],

  ['div', {id: 'viewUIResults'}],

  ['button', {
    id: 'initializeWithValue',
    $on: {
      async click () {
        await keyPathNotExpectedTypeChoices.setValue(42);
      }
    }
  }, ['Initialize with a value']],

  ['h2', [
    'Convert structured cloning string representation to value and log'
  ]],
  ['input', {
    id: 'getValueForString',
    placeholder: 'e.g., ["abc", 17]',
    $on: {
      change () {
        const types = new Types();
        const value = types.getValueForString(this.value, {
          format: 'arbitraryJS'
        })[0];
        console.log(value);
      }
    }
  }],

  ['h2', [
    'Type choices with initial value set'
  ]],
  (() => {
    const typeSelection = typeChoices({
      format: 'arbitraryJS',
      setValue: true,
      value: [
        Symbol('abcdefg'),
        Symbol.for('abcdefg')
      ],
      typeNamespace: 'demo-type-choices-only-initial-value'
    });

    const typeSelectionSymbol = typeChoices({
      format: 'arbitraryJS',
      setValue: true,
      value: Symbol('tuv'),
      typeNamespace: 'demo-type-choices-only-initial-value'
    });

    const typeSelectionSymbolFor = typeChoices({
      format: 'arbitraryJS',
      setValue: true,
      value: Symbol.for('xyz'),
      typeNamespace: 'demo-type-choices-only-initial-value'
    });

    return ['form', [
      ...typeSelection.domArray,
      ...typeSelectionSymbol.domArray,
      ...typeSelectionSymbolFor.domArray
    ]];
  })(),

  jml('section', {role: 'main'}, [
    ['h1', [
      'Jsoe schema testing'
    ]],
    ['form', [
      ...getTypeChoices([
        Symbol('abcd'),
        Symbol.for('abcde')
        // Promise.resolve(),
        // function () {}
      ], schemaInstanceJSONArbitraryJS)
    ]]
  ])
], body);

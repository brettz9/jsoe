import {jml, body, $} from '../src/vendor-imports.js';

import {
  formatAndTypeChoices
} from '../src/formatAndTypeChoices.js';

const zodexSchemaJSON = await (await fetch('./schema.zodex.json')).json();

const anySchemaJSON = {
  type: 'any'
};

const unknownSchemaJSON = {
  type: 'unknown'
};

const schemaInstanceJSON = {
  type: 'union',
  options: [
    {
      type: 'boolean'
    },
    {
      type: 'number'
    },
    {
      type: 'nan'
    },
    {
      type: 'bigInt'
    },
    {
      type: 'string'
    },
    {
      description: 'Email',
      type: 'string',
      kind: 'email'
    },
    {
      description: 'URL',
      type: 'string',
      kind: 'url'
    },
    {
      description: 'Date',
      type: 'string',
      kind: 'date'
    },
    {
      type: 'date'
    },
    {
      type: 'undefined'
    },
    {
      type: 'void'
    },
    {
      type: 'null'
    },
    {
      type: 'enum',
      values: ['abc', 'def', 'ghi'],
      defaultValue: 'def'
    },
    {
      description: 'Boolean',
      type: 'literal',
      value: false
    },
    {
      description: 'Number',
      type: 'literal',
      value: 135
    },
    {
      description: 'String',
      type: 'literal',
      value: 'abc'
    },
    {
      type: 'object',
      properties: {}
    },
    {
      description: 'With properties',
      type: 'object',
      properties: {
        abc: {
          type: 'object',
          properties: {
            def: {
              type: 'number'
            }
          }
        }
      }
    },
    {
      type: 'symbol'
    },
    {
      type: 'array',
      element: {
        description: 'Cat',
        type: 'string'
      }
    },
    {
      type: 'set',
      value: {
        type: 'string'
      }
    },
    {
      type: 'tuple',
      items: [
        {
          type: 'number'
        },
        {
          type: 'string'
        }
      ],
      rest: {
        type: 'null'
      }
    },
    {
      type: 'map',
      key: {
        type: 'number'
      },
      value: {
        type: 'string'
      }
    },
    {
      type: 'record',
      key: {
        type: 'symbol'
      },
      value: {
        type: 'number'
      }
    },
    // `never` could technically be in the following, too, but probably
    //    not meaningful:
    //    catchall, record value, map key/value, promise value
    //    effect inner, catch innerType
    {
      type: 'never'
    },
    {
      description: 'With never',
      type: 'array',
      element: {
        type: 'never'
      }
    },
    {
      description: 'With never',
      type: 'set',
      value: {
        type: 'never'
      }
    },
    {
      description: 'With never rest',
      type: 'tuple',
      items: [
        {
          type: 'string'
        }
      ],
      rest: {
        type: 'never'
      }
    },
    {
      description: 'With never items and rest',
      type: 'tuple',
      items: [
        {
          type: 'never'
        }
      ],
      rest: {
        type: 'never'
      }
    },
    {
      description: 'With never property',
      type: 'object',
      properties: {
        badProperty: {
          type: 'never'
        }
      }
    },
    {
      description: 'With unknown keys strict',
      type: 'object',
      unknownKeys: 'strict',
      properties: {
        okProperty: {
          type: 'string',
          isOptional: true
        }
      }
    },
    {
      description: 'With catchall schema',
      type: 'object',
      catchall: {
        type: 'number'
      },
      properties: {
        requiredProperty: {
          type: 'boolean'
        },
        okProperty: {
          type: 'string',
          isOptional: true
        }
      }
    },
    {
      type: 'promise',
      value: {
        type: 'number'
      }
    },
    {
      type: 'function',
      args: {
        type: 'tuple',
        items: [
          {
            type: 'number'
          }
        ],
        rest: {
          type: 'string'
        }
      },
      returns: {
        type: 'boolean'
      }
    },
    {
      type: 'function',
      description: 'With never',
      args: {
        type: 'tuple',
        items: [
          {
            type: 'never'
          }
        ],
        rest: {
          type: 'never'
        }
      },
      returns: {
        type: 'never'
      }
    },

    {
      type: 'catch',
      name: 'abc',
      innerType: {
        type: 'string'
      }
    },
    {
      type: 'nativeEnum',
      values: {
        type: 'record',
        key: {
          type: 'number'
        },
        value: {
          type: 'string'
        }
      }
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'regexp',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'blob',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'BooleanObject',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'NumberObject',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'StringObject',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'SpecialRealNumber',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'domexception',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'error',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'filelist',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'file',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'resurrectable', // noneditable
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'blobHTML',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'buffersource',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'dommatrix',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'dompoint',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'domrect',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'errors',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    {
      type: 'effect',
      effects: [
        {
          name: 'bigintObject',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    }

    // Test: editing, including fixing aggregate errors and aggregate error
    //         as cause
    // Todo: Test/Fix functionality for `toValue`, `getInput`, `setValue`,
    //         `getValue`, `viewUI`

    // Todo: If Zod starts to do circular data, support with reference types
    // Todo: If Zod starts to allow specific types for our effects, use those
    //         instead, not just for more standard semanticness, but for any
    //         additional validations
    // Todo: allow function/promise/symbol to be cloneable albeit not through
    //        structured cloneable; note that typeson has an issue for
    //        symbol-iterating keys; then add to regular demo and test
  ]
};

/**
 * @param {string} schema
 * @returns {import('zodex').SzType}
 */
function getSchemaContent (schema) {
  switch (schema) {
  case 'Zodex schema':
    return zodexSchemaJSON;
  case 'Zodex schema instance':
    return schemaInstanceJSON;
  case 'any schema':
    return anySchemaJSON;
  case 'unknown schema':
    return unknownSchemaJSON;
  default:
    break;
  }
  return {};
}

const keyPathNotExpectedTypeChoices = await formatAndTypeChoices({
  hasKeyPath: false,
  typeNamespace: 'demo-keypath-not-expected',
  schemas: [
    'Zodex schema', 'Zodex schema instance', 'any schema', 'unknown schema'
  ],
  selectedSchema: 'Zodex schema',
  getSchemaContent
});

setTimeout(function () {
  jml('section', {role: 'main'}, [
    ['h1', [
      'Jsoe schema testing'
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
          console.log('getting', await getSchemaContent(
            keyPathNotExpectedTypeChoices.formatChoices.
              selectedOptions[0].dataset.schema
          ));
          const controls =
            // eslint-disable-next-line @stylistic/max-len -- Long
            await keyPathNotExpectedTypeChoices.formats.getControlsForFormatAndValue(
              keyPathNotExpectedTypeChoices.types,
              keyPathNotExpectedTypeChoices.formatChoices.
                selectedOptions[0].value,
              keyPathNotExpectedTypeChoices.getValue(),
              {
                readonly: true,
                // schemaContent: anySchemaJSON
                schemaContent: await getSchemaContent(
                  keyPathNotExpectedTypeChoices.formatChoices.
                    selectedOptions[0].dataset.schema
                )
              }
            );
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
    }, ['Initialize with a value']]
  ], body);
}, 500);

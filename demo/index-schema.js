import {jml, body, $} from '../src/vendor-imports.js';

import {
  formatAndTypeChoices
} from '../src/formatAndTypeChoices.js';

const zodexSchemaJSON = await (await fetch('./schema.zodex')).json();

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
      type: 'object'
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
    }

    // Todo: add these above and in schema.js, uncomment nativeEnum there
    // {
    //   type: 'nativeEnum'
    // }

    // Todo:
    //        Zod can't do circular data, but can do other types:
    //        effect (and preset examples like -0, Infinity, -Infinity,
    //          These can't be subdivided, but can be detected
    //          classes: Blob, Boolean, DOMException, Error, FileList,
    //          File, noneditable?, Number, RegExp, String; subtypes:
    //          BlobHTML; supertypes (including inner items): BufferSource,
    //          DOMMatrix, DOMPoint, DOMRect, Errors, SpecialNumber),
    //          Sparse arrays
    // 'effect'

    // Todo: Test/Fix functionality for `toValue`, `getInput`, `setValue`,
    //         `getValue`, `viewUI`

    // Todo: allow function/promise/symbol to be cloneable albeit not through
    //        structured cloneable; note that typeson has an issue for
    //        symbol-iterating keys; then add to regular demo and test
  ]
};

const keyPathNotExpectedTypeChoices = await formatAndTypeChoices({
  hasKeyPath: false,
  typeNamespace: 'demo-keypath-not-expected',
  schemas: [
    'Zodex schema', 'Zodex schema instance', 'any schema', 'unknown schema'
  ],
  selectedSchema: 'Zodex schema instance',
  getSchemaContent (schema) {
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
          const controls =
            // eslint-disable-next-line @stylistic/max-len -- Long
            await keyPathNotExpectedTypeChoices.formats.getControlsForFormatAndValue(
              keyPathNotExpectedTypeChoices.types,
              'structuredCloning',
              keyPathNotExpectedTypeChoices.getValue(),
              {
                readonly: true
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

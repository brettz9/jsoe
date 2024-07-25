import {jml, body, $} from '../src/vendor-imports.js';

import {
  formatAndTypeChoices
} from '../src/formatAndTypeChoices.js';

import {
  Types
} from '../src/index.js';

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
      description: 'A boolean',
      type: 'boolean'
    },
    {
      description: 'A number',
      type: 'number'
    },
    {
      description: 'A NaN',
      type: 'nan'
    },
    {
      description: 'A BigInt',
      type: 'bigInt'
    },
    {
      description: 'A string',
      type: 'string'
    }
  ]
};

const schemaInstanceJSON2 = {
  type: 'union',
  options: [
    {
      description: 'A void',
      type: 'void'
    },
    {
      description: 'An enum',
      type: 'enum',
      values: ['abc', 'def', 'ghi'],
      defaultValue: 'def'
    },
    {
      description: 'Literal boolean',
      type: 'literal',
      value: false
    },
    {
      description: 'Literal number',
      type: 'literal',
      value: 135
    },
    {
      description: 'Literal string',
      type: 'literal',
      value: 'abcde'
    },
    {
      description: 'An object',
      type: 'object',
      properties: {}
    },
    {
      description: 'With properties',
      type: 'object',
      properties: {
        abc: {
          type: 'object',
          description: 'Abc',
          properties: {
            def: {
              description: 'A count',
              type: 'number'
            }
          }
        }
      }
    },
    {
      description: 'A symbol',
      type: 'symbol'
    },
    {
      description: 'An array',
      type: 'array',
      element: {
        description: 'Cat',
        type: 'string'
      }
    },
    {
      description: 'A set',
      type: 'set',
      value: {
        type: 'string'
      }
    },
    {
      description: 'A tuple',
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
      description: 'A record',
      type: 'record',
      key: {
        type: 'symbol'
        // type: 'number'
      },
      value: {
        type: 'string'
      }
    },
    {
      description: 'A FileList',
      type: 'effect',
      effects: [
        {
          name: 'filelist',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    },
    // `never` could technically be in the following, too, but probably
    //    not meaningful:
    //    catchall, record value, map key/value, promise value
    //    effect inner, catch innerType
    {
      description: 'A never',
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
      description: 'A Promise',
      type: 'promise',
      value: {
        type: 'number'
      }
    },
    {
      description: 'A function',
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
      description: 'A catch',
      type: 'catch',
      value: 'abc',
      innerType: {
        type: 'string'
      }
    },
    {
      description: 'A native enum',
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
      description: 'A RegExp',
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
      description: 'A Blob',
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
      description: 'A Boolean object',
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
      description: 'A Number object',
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
      description: 'A String object',
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
      description: 'A special real number',
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
      description: 'A DOMException',
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
      description: 'An Error',
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
      description: 'A File',
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
      description: 'A BufferSource',
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
      description: 'A DOMMatrix',
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
      description: 'A DOMPoint',
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
      description: 'A DOMRect',
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
      description: 'An Errors',
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
      description: 'A BigInt object',
      type: 'effect',
      effects: [
        {
          name: 'bigintObject',
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    }
  ]
};

const schemaInstanceJSON3 = {
  type: 'union',
  options: [
    {
      description: 'A date',
      type: 'date'
    },
    {
      type: 'string',
      kind: 'date'
    },
    {
      description: 'An HTML Blob',
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
      description: 'A Non-editable',
      type: 'effect',
      effects: [
        {
          name: 'resurrectable', // noneditable
          type: 'refinement'
        }
      ],
      inner: {type: 'any'}
    }
  ]
};

const schemaInstanceJSON4 = {
  type: 'union',
  options: [
    {
      type: 'string',
      kind: 'email'
    },
    {
      description: 'An undefined',
      type: 'undefined'
    }
  ]
};

const schemaInstanceJSON5 = {
  type: 'union',
  options: [
    {
      description: 'A null',
      type: 'null'
    },
    {
      type: 'string',
      kind: 'url'
    }
  ]
};

const schemaInstanceJSON6 = {
  type: 'union',
  options: [
    {
      type: 'boolean',
      defaultValue: false
    },
    {
      type: 'number',
      defaultValue: 15
    },
    {
      type: 'bigInt',
      defaultValue: '1234567890'
    },
    {
      type: 'string',
      defaultValue: 'something to default'
    },
    {
      type: 'date',
      defaultValue: '1999-01-01'
    }
  ]
};

const schemaInstanceJSONMinsMaxes = {
  type: 'union',
  options: [
    {
      type: 'number',
      min: 400,
      max: 700,
      int: true
    },
    {
      type: 'bigInt',
      min: '400',
      max: '700'
    },
    {
      type: 'date',
      min: new Date('1999-01-01').getTime(),
      max: new Date('2001-01-01').getTime()
    },
    {
      type: 'string',
      min: 5,
      max: 10
    }
  ]
};

const schemaInstanceJSONMinsMaxes2 = {
  type: 'union',
  options: [
    {
      type: 'number',
      min: 400,
      minInclusive: true,
      max: 700,
      maxInclusive: true,
      multipleOf: 5
    },
    {
      type: 'bigInt',
      min: '400',
      minInclusive: true,
      max: '700',
      maxInclusive: true,
      multipleOf: '5'
    },
    {
      type: 'date',
      min: new Date('1999-01-01').getTime(),
      max: new Date('2001-01-01').getTime()
    },
    {
      type: 'string',
      length: 10
    }
  ]
};

const schemaInstanceJSONMinsMaxes3 = {
  type: 'union',
  options: [
    {
      type: 'number',
      min: 400,
      max: 700
    },
    {
      type: 'bigInt'
    },
    {
      type: 'date',
      min: new Date('1999-01-01').getTime(),
      max: new Date('2001-01-01').getTime()
    },
    {
      type: 'string',
      startsWith: 'abc',
      endsWith: 'xyz',
      toLowerCase: true,
      trim: true
    }
  ]
};

const schemaInstanceJSONStrings1 = {
  type: 'union',
  options: [
    {
      type: 'string',
      includes: 'GHI',
      position: 5,
      toUpperCase: true
    }
  ]
};

const schemaInstanceJSONStrings2 = {
  type: 'union',
  options: [
    {
      type: 'string',
      includes: 'GHI',
      regex: 'a[a-z]c'
    }
  ]
};

const schemaInstanceJSONStrings3 = {
  type: 'union',
  options: [
    {
      type: 'string',
      regex: 'a[a-z]c',
      flags: 'i'
    }
  ]
};

const schemaInstanceJSONStrings4 = {
  type: 'union',
  options: [
    {
      type: 'string',
      kind: 'time',
      precision: 3
    }
  ]
};

const schemaInstanceJSONStrings5 = {
  type: 'union',
  options: [
    {
      type: 'string',
      kind: 'time'
    }
  ]
};

const schemaInstanceJSONStrings6 = {
  type: 'union',
  options: [
    {
      type: 'string',
      kind: 'datetime',
      offset: true,
      local: true,
      precision: 3
    }
  ]
};

const schemaInstanceJSONStrings7 = {
  type: 'union',
  options: [
    {
      type: 'string',
      kind: 'ip',
      version: 'v4'
    }
  ]
};

const schemaInstanceJSONStrings8 = {
  type: 'union',
  options: [
    {
      type: 'string',
      kind: 'ip',
      version: 'v6'
    }
  ]
};

const schemaInstanceJSONStrings9 = {
  type: 'union',
  options: [
    {
      description: 'Emoji',
      type: 'string',
      kind: 'emoji'
    },
    {
      description: 'UUID',
      type: 'string',
      kind: 'uuid'
    },
    {
      description: 'Nanoid',
      type: 'string',
      kind: 'nanoid'
    },
    {
      description: 'CUID',
      type: 'string',
      kind: 'cuid'
    },
    {
      description: 'CUID2',
      type: 'string',
      kind: 'cuid2'
    },
    {
      description: 'ULID',
      type: 'string',
      kind: 'ulid'
    },
    {
      description: 'Duration',
      type: 'string',
      kind: 'duration'
    },
    {
      description: 'Base64',
      type: 'string',
      kind: 'base64'
    }
  ]
};

// Todo: test editing, including fixing aggregate errors and aggregate error
//         as cause
// Todo: Test/Fix functionality for `toValue`, `getInput`, `setValue`,
//         `getValue`, `viewUI` (and check coverage of `valueMatch`)

// Todo: If Zod starts to do circular data, support with reference types
// Todo: If Zod starts to allow specific types for our effects, use those
//         instead, not just for more standard semanticness, but for any
//         additional validations
// Todo: allow function/promise/symbol to be cloneable albeit not through
//        structured cloneable; note that typeson has an issue for
//        symbol-iterating keys; then add to regular demo and test

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
  case 'Zodex schema instance 2':
    return schemaInstanceJSON2;
  case 'Zodex schema instance 3':
    return schemaInstanceJSON3;
  case 'Zodex schema instance 4':
    return schemaInstanceJSON4;
  case 'Zodex schema instance 5':
    return schemaInstanceJSON5;
  case 'Zodex schema instance 6':
    return schemaInstanceJSON6;
  case 'Zodex schema instance mins and maxes':
    return schemaInstanceJSONMinsMaxes;
  case 'Zodex schema instance mins and maxes 2':
    return schemaInstanceJSONMinsMaxes2;
  case 'Zodex schema instance mins and maxes 3':
    return schemaInstanceJSONMinsMaxes3;
  case 'Zodex schema instance strings 1':
    return schemaInstanceJSONStrings1;
  case 'Zodex schema instance strings 2':
    return schemaInstanceJSONStrings2;
  case 'Zodex schema instance strings 3':
    return schemaInstanceJSONStrings3;
  case 'Zodex schema instance strings 4':
    return schemaInstanceJSONStrings4;
  case 'Zodex schema instance strings 5':
    return schemaInstanceJSONStrings5;
  case 'Zodex schema instance strings 6':
    return schemaInstanceJSONStrings6;
  case 'Zodex schema instance strings 7':
    return schemaInstanceJSONStrings7;
  case 'Zodex schema instance strings 8':
    return schemaInstanceJSONStrings8;
  case 'Zodex schema instance strings 9':
    return schemaInstanceJSONStrings9;
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
    'Zodex schema', 'Zodex schema instance', 'Zodex schema instance 2',
    'Zodex schema instance 3', 'Zodex schema instance 4',
    'Zodex schema instance 5', 'Zodex schema instance 6',
    'Zodex schema instance mins and maxes',
    'Zodex schema instance mins and maxes 2',
    'Zodex schema instance mins and maxes 3',
    'Zodex schema instance strings 1',
    'Zodex schema instance strings 2',
    'Zodex schema instance strings 3',
    'Zodex schema instance strings 4',
    'Zodex schema instance strings 5',
    'Zodex schema instance strings 6',
    'Zodex schema instance strings 7',
    'Zodex schema instance strings 8',
    'Zodex schema instance strings 9',
    'any schema', 'unknown schema'
  ],
  selectedSchema: 'Zodex schema instance 2',
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
    }, ['Initialize with a value']],

    ['h2', [
      'Convert structured cloning string representation to value and log'
    ]],
    ['input', {
      id: 'getValueForString',
      placeholder: 'e.g., ["abc", 17]',
      $on: {
        change () {
          const union = {
            type: 'union',
            options: [
              ...schemaInstanceJSON.options,
              ...schemaInstanceJSON2.options,
              ...schemaInstanceJSON3.options,
              ...schemaInstanceJSON4.options,
              ...schemaInstanceJSON5.options
            ]
          };
          const types = new Types();
          const value = types.getValueForString(this.value, {
            format: 'schema',
            schemaObject: union,
            schemaOriginal: union
          })[0];
          console.log(value);
        }
      }
    }]
  ], body);
}, 500);

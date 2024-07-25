import {toStringTag} from '../vendor-imports.js';
import {$e} from '../utils/templateUtils.js';
import {copyObject} from '../utils/objects.js';
import recordType from './recordType.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const nativeEnumType = {
  option: ['Native enum'],
  stringRegex: /^nativeEnum\((.*)\)$/u,
  valueMatch (x) { // Like `object` type, can also match
    return x && typeof x === 'object' &&
      // Exclude other special object types
      toStringTag(x) === 'Object' &&
      // Check it is specifically like a native enum
      Object.entries(x).every(([key, val]) => {
        return ((/^\d+$/u).test(key) && typeof val === 'string') ||
          ['number', 'string'].includes(typeof val);
      });
  },
  // Todo: Fix all the following methods up to `editUI` to work with children
  toValue (s) {
    return {value: s.slice(8, -1)};
  },
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ ($e(root, 'input'));
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  getValue ({root, stateObj, currentPath}) {
    const value = recordType.getValue({root, stateObj, currentPath});
    // Todo: Add any numeric keys
    return value;
  },
  viewUI ({value, specificSchemaObject}) {
    return ['span', {
      dataset: {type: 'nativeEnum'},
      title: specificSchemaObject?.description ?? '(a native enum)'
    }, [value]];
  },
  editUI ({
    format, type, buildTypeChoices, specificSchemaObject,
    topRoot, schemaContent, typeNamespace
  }) {
    // We want to allow overriding its descriptions
    const specificSchemaObj = copyObject(specificSchemaObject);
    const nativeEnumValues = specificSchemaObj?.values ?? {
      type: 'union',
      options: [
        {
          description: 'Numeric',
          type: 'record',
          key: {
            type: 'number'
          },
          value: {
            type: 'string'
          }
        },
        {
          description: 'String',
          type: 'record',
          key: {
            type: 'string'
          },
          value: {
            type: 'union',
            options: [
              {
                type: 'string'
              },
              {
                type: 'number'
              }
            ]
          }
        }
      ]
    };
    nativeEnumValues.description = 'Native Enum';

    return ['div', {dataset: {type: 'nativeEnum'}}, [
      ...(/** @type {import('../typeChoices.js').BuildTypeChoices} */ (
        buildTypeChoices
      )({
        // resultType,
        // eslint-disable-next-line object-shorthand -- TS
        topRoot: /** @type {HTMLDivElement} */ (topRoot),
        // eslint-disable-next-line object-shorthand -- TS
        format: /** @type {import('../formats.js').AvailableFormat} */ (format),
        schemaOriginal: schemaContent,
        schemaContent: nativeEnumValues,
        state: type,
        // itemIndex,
        typeNamespace
      }).domArray)
    ]];
  }
};

export default nativeEnumType;

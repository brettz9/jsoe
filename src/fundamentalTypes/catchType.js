import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const catchType = {
  option: ['Catch'],
  stringRegex: /^catch\((.*)\)$/u,
  // Todo: Fix all the following methods up to `editUI` to work with children
  toValue (s) {
    return {value: s.slice(6, -1)};
  },
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ ($e(root, 'input'));
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  getValue ({root}) {
    return this.getInput({root}).value;
  },
  viewUI ({value}) {
    return ['span', {dataset: {type: 'catch'}}, [value]];
  },
  editUI ({
    format, type, buildTypeChoices, specificSchemaObject,
    topRoot, schemaContent, typeNamespace
  }) {
    const schemaName =
      /** @type {import('zodex').SzCatch} */ (
        specificSchemaObject
      )?.name;
    return ['div', {dataset: {type: 'catch'}}, [
      ['label', [
        ['b', ['Name']],
        ' ',
        ['input', {
          disabled: Boolean(schemaName),
          value: schemaName ?? ''
        }]
      ]],
      ['br'],
      ['label', [
        ['b', ['Value']],
        ' ',
        ...(/** @type {import('../typeChoices.js').BuildTypeChoices} */ (
          buildTypeChoices
        )({
          // resultType,
          // eslint-disable-next-line object-shorthand -- TS
          topRoot: /** @type {HTMLDivElement} */ (topRoot),
          // eslint-disable-next-line object-shorthand -- TS
          format: /** @type {import('../formats.js').AvailableFormat} */ (
            format
          ),
          schemaOriginal: schemaContent,
          schemaContent: /** @type {import('zodex').SzCatch} */ (
            specificSchemaObject
          )?.innerType ?? {type: 'any'},
          state: type,
          // itemIndex,
          typeNamespace
        }).domArray)
      ]]
    ]];
  }
};

export default catchType;

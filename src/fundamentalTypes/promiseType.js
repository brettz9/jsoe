import {toStringTag} from '../vendor-imports.js';
import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const promiseType = {
  option: ['Promise'],
  stringRegex: /^Promise\((.*)\)$/u,
  // Todo: Fix all the following methods up to `editUI` to work with children
  valueMatch (x) {
    return toStringTag(x) === 'Promise';
  },
  toValue (s) {
    return {value: s.slice(8, -1)};
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
    return ['span', {dataset: {type: 'promise'}}, [value]];
  },
  editUI ({
    format, type, buildTypeChoices, specificSchemaObject,
    topRoot, schemaContent, typeNamespace
  }) {
    return ['div', {dataset: {type: 'promise'}}, [
      ...(/** @type {import('../typeChoices.js').BuildTypeChoices} */ (
        buildTypeChoices
      )({
        // resultType,
        // eslint-disable-next-line object-shorthand -- TS
        topRoot: /** @type {HTMLDivElement} */ (topRoot),
        // eslint-disable-next-line object-shorthand -- TS
        format: /** @type {import('../formats.js').AvailableFormat} */ (format),
        schemaOriginal: schemaContent,
        schemaContent: /** @type {import('zodex').SzPromise} */ (
          specificSchemaObject
        )?.value ?? {type: 'any'},
        state: type,
        // itemIndex,
        typeNamespace
      }).domArray)
    ]];
  }
};

export default promiseType;

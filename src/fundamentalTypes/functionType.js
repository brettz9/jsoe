import {$e} from '../utils/templateUtils.js';
import {copyObject} from '../utils/objects.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const functionType = {
  option: ['function'],
  stringRegex: /^function\((.*)\): (.*)$/u,
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
  getValue ({root}) {
    return this.getInput({root}).value;
  },
  viewUI ({value}) {
    return ['span', {dataset: {type: 'function'}}, [value]];
  },
  editUI ({
    format, type, buildTypeChoices, specificSchemaObject,
    topRoot, schemaContent, typeNamespace
  }) {
    // We want to allow overriding its descriptions
    const specificSchemaObj = copyObject(specificSchemaObject);
    const argsTuple = /** @type {import('zodex').SzFunction<any, any>} */ (
      specificSchemaObj
    )?.args ?? {type: 'tuple', items: [], rest: {type: 'any'}};
    argsTuple.description = '';
    // This `description` not in use, but could support
    argsTuple.rest.description = 'Argument';

    return ['div', {dataset: {type: 'function'}}, [
      ['b', ['Arguments']],
      ['br'],
      ...(/** @type {import('../typeChoices.js').BuildTypeChoices} */ (
        buildTypeChoices
      )({
        // resultType,
        // eslint-disable-next-line object-shorthand -- TS
        topRoot: /** @type {HTMLDivElement} */ (topRoot),
        // eslint-disable-next-line object-shorthand -- TS
        format: /** @type {import('../formats.js').AvailableFormat} */ (format),
        schemaOriginal: schemaContent,
        schemaContent: argsTuple,
        // schemaState,
        state: type,
        // itemIndex,
        typeNamespace
      }).domArray),
      ['b', ['Returns']],
      ['br'],
      ...(/** @type {import('../typeChoices.js').BuildTypeChoices} */ (
        buildTypeChoices
      )({
        // resultType,
        // eslint-disable-next-line object-shorthand -- TS
        topRoot: /** @type {HTMLDivElement} */ (topRoot),
        // eslint-disable-next-line object-shorthand -- TS
        format: /** @type {import('../formats.js').AvailableFormat} */ (format),
        schemaOriginal: schemaContent,
        schemaContent: /** @type {import('zodex').SzFunction<any, any>} */ (
          specificSchemaObj
        )?.returns ?? {type: 'any'},
        // schemaState,
        state: type,
        // itemIndex,
        typeNamespace
      }).domArray)
    ]];
  }
};

export default functionType;

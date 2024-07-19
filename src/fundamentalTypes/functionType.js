import {$e} from '../utils/templateUtils.js';
import {copyObject} from '../utils/objects.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const functionType = {
  option: ['function'],
  stringRegex: /^function\((.*)\): (.*)$/u,
  // Todo: Fix all the following methods up to `editUI` to work with children
  valueMatch (x) {
    return typeof x === 'function';
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
    return ['span', {dataset: {type: 'function'}}, [value]];
  },
  editUI ({
    format, type, buildTypeChoices, specificSchemaObject,
    topRoot, schemaContent, typeNamespace
  }) {
    // Todo: Could make a function instance result type which builds a Function
    //        like `new Function('arg1', 'return !arg1');` this just builds a
    //        specific function schema instance, and can't have a meaningful
    //        `getValue`, etc.; add to demo with tests; could also add to
    //        use with `Promise` so that could also build a meaningful
    //        implementation

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
        state: type,
        // itemIndex,
        typeNamespace
      }).domArray)
    ]];
  }
};

export default functionType;

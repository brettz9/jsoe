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
  viewUI ({value, specificSchemaObject}) {
    return ['span', {
      dataset: {type: 'function'},
      title: specificSchemaObject?.description ?? '(a function)'
    }, [value]];
  },
  editUI ({
    format, type, buildTypeChoices, specificSchemaObject,
    topRoot, // schemaContent,
    typeNamespace
  }) {
    // Todo: Support `getValue`; add to demo with tests; could also add to
    //        use with `Promise` so that could also build a meaningful
    //        implementation; use schema to inform user of types of args,
    //        but remember we are not reimplementing the function schema to
    //        ask for argument types, etc.

    // We want to allow overriding its descriptions
    const specificSchemaObj = copyObject(specificSchemaObject);
    const argsTuple = /** @type {import('zodex').SzFunction<any, any>} */ (
      specificSchemaObj
    )?.args ?? {type: 'tuple', items: [], rest: {type: 'any'}};
    argsTuple.description = '';
    // This `description` not in use, but could support
    if (argsTuple.rest) {
      argsTuple.rest.description = 'Argument';
    }

    const size = argsTuple.items.length + (argsTuple.rest ? 1 : 0);
    const args = /** @type {import('zodex').SzType} */ (
      {
        type: 'set',
        minSize: size,
        maxSize: size,
        value: {
          type: 'string',
          // See https://github.com/tc39/proposal-regexp-unicode-property-escapes#other-examples
          // eslint-disable-next-line @stylistic/max-len -- Long
          regex: String.raw`^(?:[$_\p{ID_Start}])(?:[$_\u200C\u200D\p{ID_Continue}])*$`,
          flags: 'v'
        }
      }
    );

    return ['div', {dataset: {type: 'function'}}, [
      ['b', ['Arguments']],
      ['br'],

      // This was working to allow choice of specific function argument types,
      //   but we want function argument names to build a real function; the
      //   specific attached schema should already specify function argument
      //   types.
      // ...(/** @type {import('../typeChoices.js').BuildTypeChoices} */ (
      //   buildTypeChoices
      // )({
      //   // resultType,
      //   // eslint-disable-next-line object-shorthand -- TS
      //   topRoot: /** @type {HTMLDivElement} */ (topRoot),
      //   // eslint-disable-next-line object-shorthand -- TS
      //   format:
      //     /** @type {import('../formats.js').AvailableFormat} */ (format),
      //   schemaOriginal: schemaContent,
      //   schemaContent: argsTuple,
      //   state: type,
      //   // itemIndex,
      //   typeNamespace
      // }).domArray),

      ...(/** @type {import('../typeChoices.js').BuildTypeChoices} */ (
        buildTypeChoices
      )({
        // resultType,
        // eslint-disable-next-line object-shorthand -- TS
        topRoot: /** @type {HTMLDivElement} */ (topRoot),
        // eslint-disable-next-line object-shorthand -- TS
        format: /** @type {import('../formats.js').AvailableFormat} */ (format),
        // schemaOriginal: schemaContent,
        schemaContent: args,
        state: type,
        // itemIndex,
        typeNamespace
      }).domArray),

      ['b', ['Function body']],
      ['br'],
      ...(/** @type {import('../typeChoices.js').BuildTypeChoices} */ (
        buildTypeChoices
      )({
        // resultType,
        // eslint-disable-next-line object-shorthand -- TS
        topRoot: /** @type {HTMLDivElement} */ (topRoot),
        // eslint-disable-next-line object-shorthand -- TS
        format: /** @type {import('../formats.js').AvailableFormat} */ (format),
        // schemaOriginal: schemaContent,
        schemaContent: {type: 'string'},
        state: type,
        // itemIndex,
        typeNamespace
      }).domArray)

      // This was previously working (see commented out block above)
      // ['b', ['Returns']],
      // ['br'],
      // ...(/** @type {import('../typeChoices.js').BuildTypeChoices} */ (
      //   buildTypeChoices
      // )({
      //   // resultType,
      //   // eslint-disable-next-line object-shorthand -- TS
      //   topRoot: /** @type {HTMLDivElement} */ (topRoot),
      //   // eslint-disable-next-line object-shorthand -- TS
      //   format:
      //     /** @type {import('../formats.js').AvailableFormat} */ (format),
      //   schemaOriginal: schemaContent,
      //   schemaContent: /** @type {import('zodex').SzFunction<any, any>} */ (
      //     specificSchemaObj
      //   )?.returns ?? {type: 'any'},
      //   state: type,
      //   // itemIndex,
      //   typeNamespace
      // }).domArray)
    ]];
  }
};

export default functionType;

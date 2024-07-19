import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const catchType = {
  option: ['Catch'],
  stringRegex: /^catch\((.*)\)$/u,
  valueMatch () {
    return false;
  },
  // Todo: Fix all the following methods up to `editUI` to work with children
  toValue (s) {
    return {value: s.slice(6, -1)};
  },
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ ($e(root, 'input,textarea'));
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  getValue ({root}) {
    return this.getInput({root}).value;
  },
  viewUI ({
    specificSchemaObject, types,
    resultType, typeNamespace, type, topRoot, format,
    bringIntoFocus, buildTypeChoices, schemaContent, replaced
  }) {
    return ['span', {
      dataset: {type: 'catch'},
      title: specificSchemaObject?.description ?? '(a catch)'
    }, [
      'A Catch',
      ['br'],
      types.getUIForModeAndType({
        readonly: true,
        specificSchemaObject: /** @type {import('zodex').SzCatch} */ (
          specificSchemaObject
        )?.innerType,
        hasValue: true,
        value: /** @type {import('zodex').SzCatch} */ (
          specificSchemaObject
        // @ts-expect-error Wait until change Zodex fork
        ).value,
        resultType, typeNamespace,
        // eslint-disable-next-line object-shorthand -- TS
        type: /** @type {import('../types.js').AvailableType} */ (type),
        topRoot, bringIntoFocus,
        buildTypeChoices, format, schemaContent,
        replaced
      })
    ]];
  },
  editUI ({
    format, type, buildTypeChoices, specificSchemaObject,
    topRoot, schemaContent, typeNamespace
  }) {
    const schemaValue =
      /** @type {import('zodex').SzCatch} */ (
        specificSchemaObject
      // @ts-expect-error Undo when Zodex may update to support
      )?.value;
    return ['div', {
      dataset: {type: 'catch'},
      title: specificSchemaObject?.description ?? '(a `catch`)'
    }, [
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
          value: schemaValue,
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

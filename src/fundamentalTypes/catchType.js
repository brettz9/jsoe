import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const catchType = {
  option: ['Catch'],
  stringRegex: /^catch\((.*)\)$/u,
  valueMatch (x) {
    // Todo: Should expand types here and in `toValue`
    return ['number', 'string'].includes(typeof x);
  },
  toValue (s) {
    const value = s.charAt(0) === '"' ? s.slice(1, -1) : Number(s);
    return {value};
  },
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ ($e(root, 'input,textarea'));
  },
  // Todo: Fix/Test the following method
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  getValue ({root}) {
    return this.getInput({root}).value;
  },
  viewUI ({
    specificSchemaObject, types,
    resultType, typeNamespace, topRoot, format,
    bringIntoFocus, buildTypeChoices, // schemaContent,
    replaced, value
  }) {
    return ['span', {
      dataset: {type: 'catch'},
      title: specificSchemaObject?.description ?? '(a catch)'
    }, [
      ['b', ['Catch']],
      ['br'],
      'Default value',
      ['br'],
      ['div', {
        class: 'defaultValue'
      }, [
        types.getUIForModeAndType({
          readonly: true,
          specificSchemaObject: /** @type {import('zodex').SzCatch} */ (
            specificSchemaObject
          )?.innerType,
          hasValue: true,
          value,
          resultType, typeNamespace,
          type: /** @type {import('../types.js').AvailableType} */ (
            /** @type {import('zodex').SzCatch} */ (
              specificSchemaObject
            )?.innerType?.type
          ),
          topRoot, bringIntoFocus,
          buildTypeChoices, format,
          // schemaContent,
          replaced
        })
      ]],
      'Catch value',
      ['br'],
      ['div', {
        class: 'catchValue'
      }, [
        types.getUIForModeAndType({
          readonly: true,
          specificSchemaObject: {
            ...(/** @type {import('zodex').SzCatch} */ (
              specificSchemaObject
            )?.innerType),
            description: '(catch value)'
          },
          hasValue: true,
          value: /** @type {import('zodex').SzCatch} */ (
            specificSchemaObject
          // @ts-expect-error Wait until change Zodex fork
          ).value,
          resultType, typeNamespace,
          type: /** @type {import('../types.js').AvailableType} */ (
            /** @type {import('zodex').SzCatch} */ (
              specificSchemaObject
            )?.innerType?.type
          ),
          topRoot, bringIntoFocus,
          buildTypeChoices, format,
          // schemaContent,
          replaced
        })
      ]]
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
        ['b', {
          title: String(schemaValue)
        }, ['Value']],
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
          )?.innerType,
          state: type,
          // itemIndex,
          typeNamespace
        }).domArray)
      ]]
    ]];
  }
};

export default catchType;

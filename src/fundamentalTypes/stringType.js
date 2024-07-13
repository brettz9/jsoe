import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const stringType = {
  option: ['String'],
  stringRegex: /^"(?:[^\\"]|\\\\|\\")*"$/u,
  toValue (s) {
    return {value: s.slice(1, -1)};
  },
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ (
      $e(root, '[data-type="string"] > textarea,input')
    );
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  getValue ({root}) {
    return this.getInput({root}).value;
  },
  viewUI ({value}) {
    return ['span', {dataset: {type: 'string'}}, [value]];
  },
  editUI ({typeNamespace, specificSchemaObject, value = ''}) {
    const kind = /** @type {import('zodex').SzString} */ (
      specificSchemaObject
    // @ts-expect-error Does exist
    )?.kind;
    const isLiteral = specificSchemaObject?.type === 'literal';
    return ['div', {dataset: {type: 'string'}}, [
      kind
        ? ['input', {
          name: `${typeNamespace}-string`,
          type: kind, // email, url, date
          value
        }]
        : ['textarea', {name: `${typeNamespace}-string`, disabled: isLiteral}, [
          isLiteral ? specificSchemaObject?.value : value
        ]]
    ]];
  }
};

export default stringType;

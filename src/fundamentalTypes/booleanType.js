import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject & {ct: number}}
 */
const booleanType = {
  option: ['Boolean', {value: 'boolean'}],
  stringRegex: /^(?:true|false)$/u,
  valueMatch (x) {
    return typeof x === 'boolean';
  },
  toValue: (s) => ({value: s === 'true'}),
  getValue ({root}) {
    return /** @type {HTMLInputElement} */ (this.getInput({root})).checked;
  },
  viewUI ({value, specificSchemaObject}) {
    return ['i', {
      dataset: {type: 'boolean'},
      title: specificSchemaObject?.description ?? '(a boolean)'
    }, [value ? 'true' : 'false']];
  },
  ct: 0,
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input[value=true]'));
  },
  editUI ({typeNamespace, specificSchemaObject, value}) {
    this.ct++;
    const isLiteral = specificSchemaObject?.type === 'literal';
    const val = isLiteral
      ? specificSchemaObject?.value
      : (value ?? specificSchemaObject?.defaultValue);
    return ['div', {
      dataset: {type: 'boolean'},
      title: specificSchemaObject?.description ?? 'Boolean'
    }, [
      ['label', [
        'True',
        ['input', {
          disabled: isLiteral,
          type: 'radio', name: `${typeNamespace}-boolean${this.ct}`,
          value: 'true', checked: typeof val === 'boolean' ? val : true
        }]
      ]],
      ['label', [
        'False',
        ['input', {
          disabled: isLiteral,
          type: 'radio', name: `${typeNamespace}-boolean${this.ct}`,
          value: 'false', checked: typeof val === 'boolean' ? !val : false
        }]
      ]]
    ]];
  }
};

export default booleanType;

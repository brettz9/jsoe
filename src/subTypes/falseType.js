import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject & {ct: number}}
 */
const falseType = {
  option: ['Boolean (false)', {value: 'false'}],
  stringRegex: /^false$/u,
  toValue: () => ({value: false}),
  valueMatch: (v) => v === false,
  superType: 'boolean',
  getValue: () => false,
  viewUI () {
    return ['i', {dataset: {type: 'false'}}, ['false']];
  },
  ct: 0,
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  editUI ({typeNamespace}) {
    this.ct++;
    return ['div', {dataset: {type: 'false'}}, [
      ['label', [
        'True',
        ['input', {
          type: 'radio', name: `${typeNamespace}-false${this.ct}`,
          value: 'true', disabled: true
        }]
      ]],
      ['label', [
        'False',
        ['input', {
          type: 'radio', name: `${typeNamespace}-false${this.ct}`,
          value: 'false', checked: true, disabled: true
        }]
      ]]
    ]];
  }
};

export default falseType;

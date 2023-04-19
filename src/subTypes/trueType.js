import {$e} from '../utils/templateUtils.js';

/**
 * @type {TypeObject}
 */
const trueType = {
  option: ['Boolean (true)', {value: 'true'}],
  stringRegex: /^true$/u,
  toValue: (_s) => ({value: true}),
  valueMatch: (v) => v === true,
  superType: 'boolean',
  getValue: () => true,
  viewUI () {
    return ['i', {dataset: {type: 'true'}}, ['true']];
  },
  ct: 0,
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return $e(root, 'input');
  },
  editUI ({typeNamespace}) {
    this.ct++;
    return ['div', {dataset: {type: 'true'}}, [
      ['label', [
        'True',
        ['input', {
          type: 'radio', name: `${typeNamespace}-true${this.ct}`,
          value: 'true', checked: true, disabled: true
        }]
      ]],
      ['label', [
        'False',
        ['input', {
          type: 'radio', name: `${typeNamespace}-true${this.ct}`,
          value: 'false', disabled: true
        }]
      ]]
    ]];
  }
};

export default trueType;

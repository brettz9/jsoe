import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const voidType = {
  stringRegex: /^void$/u,
  option: ['Void'],
  valueMatch (x) {
    return x === undefined;
  },
  toValue (/* _s */) {
    return {value: undefined};
  },
  getValue () {
    return /** @type {import('../types.js').ToValue} */ (
      this.toValue
    )('').value;
  },
  viewUI (/* {value} */) {
    return ['i', {dataset: {type: 'void'}}, ['void']];
  },
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  editUI ({typeNamespace}) {
    return ['div', {dataset: {type: 'void'}}, [
      ['label', [
        'Void',
        ['input', {
          type: 'checkbox',
          name: `${typeNamespace}-void`,
          checked: true,
          disabled: true
        }]
      ]]
    ]];
  }
};

export default voidType;

import {$e, $$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject & {ct: number}}
 */
const BooleanObjectType = {
  option: ['BooleanObject'],
  stringRegex: /^Boolean\((.*)\)$/u,
  toValue (s) {
    return {
      // eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
      value: new Boolean(s === 'true')
    };
  },
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  getValue ({root}) {
    return /** @type {import('../types.js').ToValue} */ (
      this.toValue
    )(String(/** @type {HTMLInputElement} */ (
      this.getInput({root})
    ).checked)).value;
  },
  setValue ({root, value}) {
    const inputs = /** @type {HTMLInputElement[]} */ ($$e(root, 'input'));
    const input = inputs[value.valueOf() ? 0 : 1];
    input.checked = true;
  },
  viewUI ({value}) {
    return ['i', {dataset: {type: 'BooleanObject'}}, [`Boolean(${value})`]];
  },
  ct: 0,
  editUI ({
    // eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
    typeNamespace, value = new Boolean(true)
  }) {
    this.ct++;
    return ['div', {dataset: {type: 'BooleanObject'}}, [
      ['label', [
        'True',
        ['input', {
          type: 'radio', name: `${typeNamespace}-BooleanObject${this.ct}`,
          value: 'true', checked: value.valueOf()
        }]
      ]],
      ['label', [
        'False',
        ['input', {
          type: 'radio',
          name: `${typeNamespace}-BooleanObject${this.ct}`,
          value: 'false', checked: !value.valueOf()
        }]
      ]]
    ]];
  }
};

export default BooleanObjectType;

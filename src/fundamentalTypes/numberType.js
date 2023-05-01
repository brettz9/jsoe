import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const numberType = {
  option: ['Number'],
  stringRegex: new RegExp(
    '^' + // No leading content.
      '[-+]?' + // Optional sign.
      // Optionally 0-30 decimal digits of mantissa.
      '(?:[0-9]{0,30}\\.)?' +
      // 1-30 decimal digits of integer or fraction.
      '[0-9]{1,30}' +
      // Optional exponent 0-29 for scientific notation.
      '(?:[Ee][-+]?[1-2]?[0-9])?' +
      '$', // No trailing content.
    'u'
  ),
  toValue (s) {
    return {value: Number(s)};
  },
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  setValue ({root, value}) {
    this.getInput({root}).value = String(value);
  },
  validate ({root}) {
    const val = this.getInput({root}).value;
    return {
      message: 'Not a valid (finite) number',
      valid: Boolean(val && (/^-?(\d+|\d*\.\d+)$/u).test(val))
    };
  },
  getValue ({root}) {
    return Number.parseFloat(this.getInput({root}).value);
  },
  /* schema
  viewSchemaUI () {
    // Todo?
  },
  */
  viewUI ({value}) {
    return ['i', {dataset: {type: 'number'}}, [String(value)]];
  },
  editUI ({typeNamespace, value = ''}) {
    return ['div', {dataset: {type: 'number'}}, [
      ['input', {
        name: `${typeNamespace}-number`, type: 'number', step: 'any', value
      }]
    ]];
  }
};

export default numberType;

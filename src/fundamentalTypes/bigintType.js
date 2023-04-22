import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const bigintType = {
  option: ['BigInt'],
  stringRegex: new RegExp(
    '^' + // No leading content.
      '-?' + // Optional negative sign.
      // How many digits?
      '[0-9]{1,}' +
      'n' +
      '$', // No trailing content.
    'u'
  ),
  toValue (s) {
    return {value: BigInt(s.slice(0, -1))};
  },
  getInput ({root}) {
    return $e(root, 'input');
  },
  setValue ({root, value}) {
    this.getInput({root}).value = String(value);
  },
  validate ({root}) {
    const val = this.getInput({root}).value;
    return {
      message: 'Not a valid BigInt',
      valid: val && val.match(/^-?(\d+)$/u)
    };
  },
  getValue ({root}) {
    return BigInt(this.getInput({root}).value);
  },
  /* schema:
  viewSchemaUI () {
    // Todo?
  },
  */
  viewUI ({value}) {
    return ['i', {dataset: {type: 'bigint'}}, [`${String(value)}n`]];
  },
  editUI ({typeNamespace, value = ''}) {
    return ['div', {dataset: {type: 'bigint'}}, [
      ['input', {
        name: `${typeNamespace}-bigint`, type: 'number', step: 'any', value
      }]
    ]];
  }
};

export default bigintType;

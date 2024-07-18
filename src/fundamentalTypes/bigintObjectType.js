import {hasConstructorOf} from '../vendor-imports.js';
import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const bigintObjectType = {
  option: ['BigInt Object'],
  stringRegex: new RegExp(
    '^BigIntObject' +
      '-?' + // Optional negative sign.
      // How many digits?
      '[0-9]{1,}' +
      'n' +
      '$', // No trailing content.
    'u'
  ),
  valueMatch (x) {
    return typeof x === 'object' && hasConstructorOf(x, BigInt);
  },
  toValue (s) {
    // eslint-disable-next-line no-new-object -- Required
    return {value: new Object(BigInt(s.slice(12, -1)))};
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
      message: 'Not a valid BigInt',
      valid: Boolean(val && (/^-?(\d+)$/u).test(val))
    };
  },
  getValue ({root}) {
    // eslint-disable-next-line no-new-object -- Required
    return new Object(BigInt(this.getInput({root}).value));
  },
  /* schema:
  viewSchemaUI () {
    // Todo?
  },
  */
  viewUI ({value}) {
    return ['i', {dataset: {type: 'bigintObject'}}, [`${String(value)}n`]];
  },
  editUI ({typeNamespace, value = ''}) {
    return ['div', {dataset: {type: 'bigintObject'}}, [
      ['input', {
        name: `${typeNamespace}-bigintObject`, type: 'number', step: 'any',
        value
      }]
    ]];
  }
};

export default bigintObjectType;

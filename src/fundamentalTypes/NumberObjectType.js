import {$e} from '../utils/templateUtils.js';
import Types from '../types.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const NumberObjectType = {
  option: ['NumberObject'],
  stringRegex: /^Number\((.*)\)$/u,
  toValue (s) {
    // eslint-disable-next-line no-new-wrappers, unicorn/new-for-builtins
    return {value: new Number(s)};
  },
  validate ({root}) {
    return Types.availableTypes.number.validate({root});
  },
  getInput ({root}) {
    return $e(root, 'input');
  },
  getValue ({root}) {
    return this.toValue(this.getInput({root}).value).value;
  },
  setValue ({root, value}) {
    this.getInput({root}).value = String(value);
  },
  viewUI ({value}) {
    return ['i', {dataset: {type: 'NumberObject'}}, [`Number(${value})`]];
  },
  editUI ({typeNamespace, value}) {
    return ['div', {dataset: {type: 'NumberObject'}}, [
      ['input', {
        name: `${typeNamespace}-NumberObject`,
        type: 'number',
        value,
        step: 'any'
      }]
    ]];
  }
};

export default NumberObjectType;

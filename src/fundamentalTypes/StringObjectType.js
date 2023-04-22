import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const StringObjectType = {
  stringRegex: /^String\(([^)]*)\)$/u,
  toValue (s) {
    /* eslint-disable no-new-wrappers, unicorn/new-for-builtins */
    return {value: new String(s)};
    /* eslint-enable no-new-wrappers, unicorn/new-for-builtins */
  },
  option: ['StringObject'],
  getInput ({root}) {
    return $e(root, 'textarea');
  },
  getValue ({root}) {
    return this.toValue(this.getInput({root}).value).value;
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  viewUI ({value}) {
    return ['span', {dataset: {type: 'StringObject'}}, [
      ['i', ['String(']],
      ['span', [value.valueOf()]],
      ['i', [')']]
    ]];
  },
  editUI ({typeNamespace, value = ''}) {
    return ['div', {dataset: {type: 'StringObject'}}, [
      ['textarea', {name: `${typeNamespace}-StringObject`}, [value]]
    ]];
  }
};

export default StringObjectType;

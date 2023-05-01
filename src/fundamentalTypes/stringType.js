import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const stringType = {
  option: ['String'],
  stringRegex: /^"(?:[^\\"]|\\\\|\\")*"$/u,
  toValue (s) {
    return {value: s.slice(1, -1)};
  },
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ ($e(root, 'textarea'));
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  getValue ({root}) {
    return this.getInput({root}).value;
  },
  viewUI ({value}) {
    return ['span', {dataset: {type: 'string'}}, [value]];
  },
  editUI ({typeNamespace, value = ''}) {
    return ['div', {dataset: {type: 'string'}}, [
      ['textarea', {name: `${typeNamespace}-string`}, [value]]
    ]];
  }
};

export default stringType;

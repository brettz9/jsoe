import {toStringTag} from '../vendor-imports.js';
import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const StringObjectType = {
  stringRegex: /^String\(([^)]*)\)$/u,
  valueMatch (x) {
    return toStringTag(x) === 'String' && typeof x === 'object';
  },
  toValue (s) {
    /* eslint-disable no-new-wrappers, unicorn/new-for-builtins */
    return {value: new String(s)};
    /* eslint-enable no-new-wrappers, unicorn/new-for-builtins */
  },
  option: ['StringObject'],
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ ($e(root, 'textarea'));
  },
  getValue ({root}) {
    return /** @type {import('../types.js').ToValue} */ (
      this.toValue
    )(this.getInput({root}).value).value;
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  viewUI ({value, specificSchemaObject}) {
    return ['span', {
      dataset: {type: 'StringObject'},
      title: specificSchemaObject?.description ?? '(a String Object)'
    }, [
      specificSchemaObject ? '' : ['i', ['String(']],
      ['span', [value.valueOf()]],
      specificSchemaObject ? '' : ['i', [')']]
    ]];
  },
  editUI ({typeNamespace, value = ''}) {
    return ['div', {dataset: {type: 'StringObject'}}, [
      ['textarea', {name: `${typeNamespace}-StringObject`}, [value]]
    ]];
  }
};

export default StringObjectType;

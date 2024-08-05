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
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  viewUI ({specificSchemaObject}) {
    return ['i', {
      dataset: {type: 'void'},
      title: specificSchemaObject?.description ?? '(a `void`)'
    }, ['void']];
  },
  editUI ({typeNamespace, specificSchemaObject}) {
    return ['div', {
      dataset: {type: 'void'},
      title: specificSchemaObject?.description ?? 'Void'
    }, [
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

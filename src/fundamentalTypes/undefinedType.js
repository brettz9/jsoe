import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const undefinedType = {
  stringRegex: /^undefined$/u,
  option: ['Explicit undefined'], // Explicit undefined only
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
  viewUI ({specificSchemaObject}) {
    return ['i', {
      dataset: {type: 'undef'},
      title: specificSchemaObject?.description ?? '(an `undefined`)'
    }, ['undefined']];
  },
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  editUI ({typeNamespace}) {
    return ['div', {dataset: {type: 'undef'}}, [
      ['label', [
        'Undefined',
        ['input', {
          type: 'checkbox',
          name: `${typeNamespace}-undef`,
          disabled: true,
          checked: true
        }]
      ]]
    ]];
  }
};

export default undefinedType;

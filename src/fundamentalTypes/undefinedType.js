import {$e} from '../utils/templateUtils.js';

/**
 * @type {TypeObject}
 */
const undefinedType = {
  stringRegex: /^undefined$/u,
  option: ['Explicit undefined'], // Explicit undefined only
  toValue (_s) {
    return {value: undefined};
  },
  getValue () {
    return this.toValue().value;
  },
  viewUI (/* {value} */) {
    return ['i', {dataset: {type: 'undef'}}, ['undefined']];
  },
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return $e(root, 'input');
  },
  editUI ({typeNamespace}) {
    return ['div', {dataset: {type: 'undef'}}, [
      ['label', [
        'Undefined',
        ['input', {
          type: 'checkbox',
          name: `${typeNamespace}-undef`,
          checked: true,
          disabled: true
        }]
      ]]
    ]];
  }
};

export default undefinedType;

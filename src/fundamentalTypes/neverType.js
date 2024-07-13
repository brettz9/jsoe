import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const neverType = {
  stringRegex: /^never$/u,
  option: ['Never'],
  toValue (/* _s */) {
    throw new Error('Cannot convert to value');
  },
  getValue () {
    return /** @type {import('../types.js').ToValue} */ (
      this.toValue
    )('');
  },
  viewUI (/* {value} */) {
    return ['i', {dataset: {type: 'never'}}, ['never']];
  },
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  editUI ({typeNamespace}) {
    return ['div', {dataset: {type: 'never'}}, [
      ['label', [
        'Never (no value present here)',
        ['input', {
          type: 'checkbox',
          name: `${typeNamespace}-never`,
          hidden: true
        }]
      ]]
    ]];
  }
};

export default neverType;

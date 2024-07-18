import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const sparseUndefinedType = {
  option: ['Sparse undefined'],
  stateDependent: {
    structuredCloning: {
      after: 'undef',
      contexts: [
        'arrayNonindexKeys'
        // 'sparseArrays'
      ]
    }
  },
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
  /* istanbul ignore next -- Catching instead of this placeholder */
  viewUI (/* {value} */) {
    return ['i', {
      dataset: {type: 'sparseUndefined'}
    }, [`undefined (sparse)`]];
  },
  /* istanbul ignore next -- Catching instead of this placeholder */
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  /* istanbul ignore next -- Catching instead of this placeholder */
  editUI ({typeNamespace}) {
    return ['div', [
      ['label', {dataset: {type: 'sparseUndefined'}}, [
        'Sparse undefined',
        ['input', {
          type: 'checkbox',
          name: `${typeNamespace}-sparseUndefined`,
          checked: true
        }]
      ]]
    ]];
  }
};

export default sparseUndefinedType;

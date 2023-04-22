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
  /* istanbul ignore next -- Catching instead of this placeholder */
  viewUI (/* {value} */) {
    return ['i', {
      dataset: {type: 'sparseUndefined'}
    }, [`undefined (sparse)`]];
  },
  /* istanbul ignore next -- Catching instead of this placeholder */
  getInput ({root}) {
    return $e(root, 'input');
  },
  /* istanbul ignore next -- Catching instead of this placeholder */
  editUI ({typeNamespace}) {
    return ['div', [
      ['label', {dataset: {type: 'sparseUndefined'}}, [
        'Sparse undefined',
        ['input', {
          type: 'checkbox',
          name: `${typeNamespace}-sparseUndefined`,
          checked: true,
          disabled: true
        }]
      ]]
    ]];
  }
};

export default sparseUndefinedType;

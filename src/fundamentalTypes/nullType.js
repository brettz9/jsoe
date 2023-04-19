import {$e} from '../utils/templateUtils.js';

/**
 * @type {TypeObject}
 */
const nullType = {
  option: ['Null'],
  stringRegex: /^null$/u,
  toValue: () => ({value: null}),
  getValue: () => null,
  viewUI () {
    return ['i', {dataset: {type: 'null'}}, ['null']];
  },
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return $e(root, 'input');
  },
  editUI ({typeNamespace}) {
    return ['div', {dataset: {type: 'null'}}, [
      ['label', [
        'Null',
        ['input', {
          type: 'checkbox',
          name: `${typeNamespace}-null`,
          checked: true,
          disabled: true
        }]
      ]]
    ]];
  }
};

export default nullType;

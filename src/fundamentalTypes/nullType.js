import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const nullType = {
  option: ['Null'],
  stringRegex: /^null$/u,
  valueMatch (x) {
    return x === null;
  },
  toValue: () => ({value: null}),
  getValue: () => null,
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  viewUI ({specificSchemaObject}) {
    return ['i', {
      dataset: {type: 'null'},
      title: specificSchemaObject?.description ?? '(a `null`)'
    }, ['null']];
  },
  editUI ({typeNamespace, specificSchemaObject}) {
    return ['div', {
      dataset: {type: 'null'},
      title: specificSchemaObject?.description ?? 'Null'
    }, [
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

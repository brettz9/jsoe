import {$e} from '../utils/templateUtils.js';

/**
 * @type {SuperTypeObject}
 */
const InfinitiesSuperType = {
  option: ['Infinities', {title: '`Infinity`, `-Infinity`'}],
  childTypes: ['infinity', 'negativeInfinity'],
  stringRegex: /^-?Infinity$/u,
  toValue (s) {
    return {
      value: s === 'Infinity'
        ? Number.POSITIVE_INFINITY
        : Number.NEGATIVE_INFINITY
    };
  },
  getSelect ({root}) {
    return $e(root, 'select');
  },
  getValue ({root}) {
    return this.toValue(this.getSelect({root}).value).value;
  },
  setValue ({root, value}) {
    this.getSelect({root}).value = String(value);
  },
  viewUI ({value}) {
    return ['i', {dataset: {type: 'Infinities'}}, [String(value)]];
  },
  getInput ({root}) {
    return $e(root, 'select');
  },
  editUI ({typeNamespace, value = Number.POSITIVE_INFINITY}) {
    return ['div', {dataset: {type: 'Infinities'}}, [
      ['label', [
        'Infinities: ',
        ['select', {name: `${typeNamespace}-Infinities`}, [
          ['option', {
            value: 'Infinity', selected: value === Number.POSITIVE_INFINITY
          }, ['Infinity']],
          ['option', {
            value: '-Infinity', selected: value === Number.NEGATIVE_INFINITY
          }, ['-Infinity']]
        ]]
      ]]
    ]];
  }
};

export default InfinitiesSuperType;

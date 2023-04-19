import {$e} from '../utils/templateUtils.js';

/**
 * @typedef {TypeObject} SuperTypeObject
 * @property {string[]} childTypes
 */

/**
 * @type {SuperTypeObject}
 */
const SpecialNumberSuperType = {
  option: ['SpecialNumber', {title: '`NaN`, `Infinity`, `-Infinity`'}],
  childTypes: ['infinity', 'negativeInfinity', 'nan'],
  stringRegex: /^(?:NaN|-?Infinity)$/u,
  toValue (s) {
    return {
      value: s === 'NaN'
        ? Number.NaN
        : s === 'Infinity'
          ? Number.POSITIVE_INFINITY
          : Number.NEGATIVE_INFINITY
    };
  },
  getSelect ({root}) {
    return $e(root, 'select');
  },
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return $e(root, 'select');
  },
  getValue ({root}) {
    return this.toValue(this.getSelect({root}).value).value;
  },
  setValue ({root, value}) {
    this.getSelect({root}).value = String(value);
  },
  viewUI ({value}) {
    return ['i', {dataset: {type: 'SpecialNumber'}}, [String(value)]];
  },
  editUI ({typeNamespace, value = Number.NaN}) {
    return ['div', {dataset: {type: 'SpecialNumber'}}, [
      ['label', [
        'Special number: ',
        ['select', {
          name: `${typeNamespace}-SpecialNumber`
        }, [
          ['option', {
            value: 'NaN', selected: Number.isNaN(value)
          }, ['NaN']],
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

export default SpecialNumberSuperType;

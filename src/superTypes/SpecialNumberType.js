import {$e} from '../utils/templateUtils.js';

/**
 * @typedef {import('../types.js').TypeObject & {
 *   childTypes: string[]
 * }} SuperTypeObject
 */

/**
 * @type {SuperTypeObject}
 */
const SpecialNumberSuperType = {
  option: ['Special Number', {title: '`NaN`, `Infinity`, `-Infinity`, `-0`'}],
  childTypes: ['infinity', 'negativeInfinity', 'nan', 'negativeZero'],
  stringRegex: /^(?:NaN|-?Infinity|-0)$/u,
  toValue (s) {
    return {
      value: s === '-0'
        ? -0
        : s === 'NaN'
          ? Number.NaN
          : s === 'Infinity'
            ? Number.POSITIVE_INFINITY
            : Number.NEGATIVE_INFINITY
    };
  },
  getSelect ({root}) {
    return /** @type {HTMLSelectElement} */ ($e(root, 'select'));
  },
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return /** @type {HTMLSelectElement} */ ($e(root, 'select'));
  },
  getValue ({root}) {
    return this.toValue(
      /** @type {Required<import('../types.js').TypeObject>} */ (
        this
      ).getSelect({root}).value
    ).value;
  },
  setValue ({root, value}) {
    /** @type {Required<import('../types.js').TypeObject>} */ (
      this
    ).getSelect({root}).value = Object.is(value, -0) ? '-0' : String(value);
  },
  viewUI ({value}) {
    return ['i', {dataset: {type: 'SpecialNumber'}}, [
      Object.is(value, -0) ? '-0' : String(value)
    ]];
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
          }, ['-Infinity']],
          ['option', {
            value: '-0', selected: Object.is(value, -0)
          }, ['-0']]
        ]]
      ]]
    ]];
  }
};

export default SpecialNumberSuperType;

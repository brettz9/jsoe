import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('./SpecialNumberType.js').SuperTypeObject}
 */
const SpecialRealNumberSuperType = {
  option: ['Special Real Number', {title: '`Infinity`, `-Infinity`, `-0`'}],
  childTypes: ['infinity', 'negativeInfinity', 'negativeZero'],
  stringRegex: /^(?:-?Infinity|-0)$/u,
  toValue (s) {
    return {
      value: s === '-0'
        ? -0
        : s === 'Infinity'
          ? Number.POSITIVE_INFINITY
          : Number.NEGATIVE_INFINITY
    };
  },
  getSelect ({root}) {
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
    return ['i', {dataset: {type: 'SpecialRealNumber'}}, [
      Object.is(value, -0) ? '-0' : String(value)
    ]];
  },
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return /** @type {HTMLSelectElement} */ ($e(root, 'select'));
  },
  editUI ({typeNamespace, value = Number.POSITIVE_INFINITY}) {
    return ['div', {dataset: {type: 'SpecialRealNumber'}}, [
      ['label', [
        'Special Real Number: ',
        ['select', {name: `${typeNamespace}-SpecialRealNumber`}, [
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

export default SpecialRealNumberSuperType;

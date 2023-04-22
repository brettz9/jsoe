import {$e} from '../utils/templateUtils.js';
import {jml} from '../../vendor/jamilih/dist/jml-es.js';
import Types from '../types.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const dateType = {
  option: ['Date'],
  // ISO Date string
  dateRegex: /^(?:\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}\.\d{3}Z)?|(?:\+|-)\d{6}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/u, // eslint-disable-line unicorn/no-unsafe-regex
  stringRegex () {
    const regex = this.dateRegex;
    if (!this.valid) {
      const {source} = regex;
      return new RegExp('^' + '(?:InvalidDate)|' + source.slice(1), 'u');
    }
    return new RegExp(regex, 'u');
  },
  toValue (s) {
    return {value: new Date(s)};
  },
  getInput ({root}) {
    return $e(root, 'input[type="date"]');
  },
  setValue ({root, value}) {
    const notANum = value && Number.isNaN(value.getTime());
    if (notANum) {
      $e(root, '.invalidDate').$setValidity(true);
      return;
    }
    const dateStr = new Date(Date.parse(value)).toISOString();
    this.getInput({root}).value = dateStr.length === 24
      ? dateStr.slice(0, 10)
      // eslint-disable-next-line max-len -- Long
      /* istanbul ignore next -- 6 digits year not reliable through `Date.parse` */
      : dateStr.slice(3, 13); // Will cut off ten/hundred thousand years
  },
  validate ({root}) {
    if (this.isInvalid({root})) {
      return {
        valid: true
      };
    }
    const val = this.getInput({root}).value;
    if (!val) {
      return {
        valid: false,
        message: 'Must not be empty`'
      };
    }
    return {
      valid: val.match(new RegExp(this.dateRegex, 'u')),
      message: 'Must match a valid date'
    }; // Input shouldn't allow anyways
  },
  isInvalid ({root}) {
    return !this.valid && $e(root, '.invalidDate').checked;
  },
  getValue ({root}) {
    if (this.isInvalid({root})) {
      return this.toValue('NaN').value;
    }
    return this.toValue(this.getInput({root}).value).value;
  },
  isValueInvalid (value) {
    return value && Number.isNaN(value.getTime());
  },
  viewUI ({value}) {
    return !this.valid && this.isValueInvalid(value)
      ? ['i', {
        dataset: {type: 'date'}, class: 'InvalidDate'
      }, ['InvalidDate']]
      : ['i', {dataset: {type: 'date'}, class: 'ValidDate'}, [
        value.toISOString().slice(0, 10)
      ]];
  },
  // Change to default to `new Date()` when can't be `NaN`
  //   value (keys)?
  editUI ({topRoot, typeNamespace, value = ''}) {
    const notANum = this.isValueInvalid(value);
    const invalid = this.valid
      ? ''
      : jml('div', [
        ['label', [
          'Invalid date',
          ['input', {
            type: 'checkbox',
            class: 'invalidDate',
            checked: notANum,
            name: `${typeNamespace}-invalidDate`,
            $custom: {
              $setValidity (legitimateInvalid) {
                console.log('legitimateInvalid', legitimateInvalid);
                if (legitimateInvalid === true) {
                  this.checked = true;
                }
                const label = invalid.previousElementSibling;
                label.hidden = Boolean(legitimateInvalid);
                const root = label.parentElement;
                Types.validate({type: 'date', root, topRoot});
              }
            },
            $on: {
              click (e) {
                this.$setValidity();
              }
            }
          }]
        ]]
      ]);
    return ['div', {dataset: {type: this.valid ? 'ValidDate' : 'date'}}, [
      ['label', {
        hidden: notANum
      }, [
        'Date: ',
        ['input', {
          name: `${typeNamespace}-date`,
          type: 'date',
          // Required yyyy-MM-dd format
          value: !value || notANum ? '' : value.toISOString().slice(0, 10)
        }]
      ]],
      invalid
    ]];
  }
};

export default dateType;

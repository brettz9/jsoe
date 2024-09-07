import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const numberType = {
  option: ['Number'],
  stringRegex: new RegExp(
    '^' + // No leading content.
      '[-+]?' + // Optional sign.
      // Optionally 0-30 decimal digits of mantissa.
      String.raw`(?:\d{0,30}\.)?` +
      // 1-30 decimal digits of integer or fraction.
      String.raw`\d{1,30}` +
      // Optional exponent 0-29 for scientific notation.
      String.raw`(?:[Ee][-+]?[1-2]?\d)?` +
      '$', // No trailing content.
    'u'
  ),
  valueMatch (x) {
    return typeof x === 'number' &&
      // Avoid special numbers:
      !Number.isNaN(x) &&
      x !== Number.POSITIVE_INFINITY && x !== Number.NEGATIVE_INFINITY &&
      !Object.is(x, -0);
  },
  toValue (s) {
    return {value: Number(s)};
  },
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  setValue ({root, value}) {
    this.getInput({root}).value = String(value);
  },
  validate ({root}) {
    const val = this.getInput({root}).value;
    return {
      message: 'Not a valid (finite) number',
      valid: Boolean(val && (/^-?(\d+|\d*\.\d+)$/u).test(val))
    };
  },
  getValue ({root}) {
    return Number.parseFloat(this.getInput({root}).value);
  },
  /* schema
  viewSchemaUI () {
    // Todo?
  },
  */
  viewUI ({value, specificSchemaObject}) {
    return ['i', {
      dataset: {type: 'number'},
      title: specificSchemaObject?.description ?? '(a number)'
    }, [
      String(value)
    ]];
  },
  editUI ({typeNamespace, specificSchemaObject, value}) {
    const isLiteral = specificSchemaObject?.type === 'literal';
    const numberSchemaObject = /** @type {import('zodex').SzNumber} */ (
      specificSchemaObject
    );
    // Seems to need a multiplier of around these sizes to have a noticeable
    //   effect on the inputs; shouldn't need any though
    const epsilon = 150 * Number.EPSILON;
    const maxEpsilon = 300 * Number.EPSILON;

    return ['div', {
      dataset: {type: 'number'},
      title: specificSchemaObject?.description ?? 'Number'
    }, [
      ['input', {
        disabled: isLiteral,
        name: `${typeNamespace}-number`,
        type: 'number',
        min: numberSchemaObject?.min
          ? numberSchemaObject?.minInclusive
            ? numberSchemaObject?.min
            : numberSchemaObject?.min +
              (numberSchemaObject?.int ? 1 : epsilon)
          : undefined,
        max: numberSchemaObject?.max
          ? numberSchemaObject?.maxInclusive
            ? numberSchemaObject?.max
            : numberSchemaObject?.max -
              (numberSchemaObject?.int ? 1 : maxEpsilon)
          : undefined,
        step: numberSchemaObject?.multipleOf ??
          (numberSchemaObject?.int ? '1' : 'any'),
        value: isLiteral
          ? specificSchemaObject?.value
          : (value ?? specificSchemaObject?.defaultValue ?? '')
      }]
    ]];
  }
};

export default numberType;

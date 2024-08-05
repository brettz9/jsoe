import {$e} from '../utils/templateUtils.js';

import booleanType from './booleanType.js';
import numberType from './numberType.js';
import stringType from './stringType.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const literalType = {
  option: ['Literal'],
  stringRegex: /^Literal\((.*)\)$/u,
  valueMatch (x) {
    // const schema =
    //   /** @type {import('zodex').SzLiteral<any>} */ (cfg?.schema);
    return (typeof x === 'boolean' || typeof x === 'number' ||
      typeof x === 'string'); // && (!schema || schema.value === x);
  },
  toValue (s) {
    const value = s === 'true'
      ? true
      : s === 'false'
        ? false
        : s.charAt(0) === '"'
          ? s.slice(1, -1)
          : Number(s);
    return {value};
  },
  // Todo: Fix all the following methods up to `setValue` to work with children
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ ($e(root, 'input,textarea'));
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  getValue ({root, stateObj}) {
    const innerTypeHolder = $e(root, '[data-type]');
    const typeObject = stateObj?.types?.getTypeObject?.(
      /** @type {import('../types.js').AvailableType} */ (
        innerTypeHolder?.dataset.type
      )
    );
    return /** @type {import('../types.js').TypeObject} */ (
      typeObject
    )?.getValue({root, stateObj});
  },
  viewUI ({value, specificSchemaObject}) {
    return ['span', {
      dataset: {type: 'literal'},
      title: specificSchemaObject?.description ?? `(a literal ${typeof value})`
    }, [`${value}`]];
  },
  editUI (arg) {
    const {specificSchemaObject} = arg;
    const {
      value: val
    } = /** @type {import('zodex').SzLiteral<any>} */ (specificSchemaObject);

    let specificLiteralEditUI;
    switch (typeof val) {
    case 'boolean':
      // arg.specificSchemaObject = {type: 'boolean'};
      specificLiteralEditUI = booleanType.editUI(arg);
      break;
    case 'number':
      // arg.specificSchemaObject = {type: 'number'};
      specificLiteralEditUI = numberType.editUI(arg);
      break;
    case 'string': default:
      // arg.specificSchemaObject = {type: 'string'};
      specificLiteralEditUI = stringType.editUI(arg);
      break;
    }

    return ['div', {dataset: {type: 'literal'}}, [
      specificLiteralEditUI
    ]];
  }
};

export default literalType;

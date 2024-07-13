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
  // Todo: Fix all the following methods up to `editUI` to work with children
  toValue (s) {
    return {value: s.slice(8, -1)};
  },
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ ($e(root, 'textarea'));
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  getValue ({root}) {
    return this.getInput({root}).value;
  },
  viewUI ({value}) {
    return ['span', {dataset: {type: 'literal'}}, [value]];
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

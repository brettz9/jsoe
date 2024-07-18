import {toStringTag} from '../vendor-imports.js';
import arrayType from './arrayType.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const setType = {
  option: ['Set'],
  array: true,
  set: true,
  regexEndings: [',', ')'],
  stringRegexBegin: /^Set\(/u,
  stringRegexEnd: /^\)/u,
  valueMatch (x) {
    return toStringTag(x) === 'Set';
  },
  toValue (...args) {
    return /** @type {import('../types.js').ToValue} */ (
      arrayType.toValue
    ).apply(this, args);
  },
  getValue (...args) {
    return arrayType.getValue.apply(this, args);
  },
  getInput (...args) {
    return arrayType.getInput.apply(this, args);
  },
  viewUI ({...args}) {
    return arrayType.viewUI.call(this, {
      ...args, type: 'set'
    });
  },
  editUI ({...args}) {
    return arrayType.editUI.call(this, {
      ...args, type: 'set'
    });
  }
};

export default setType;

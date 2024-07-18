import {toStringTag} from '../vendor-imports.js';
import arrayType from './arrayType.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const recordType = {
  option: ['Record'],
  regexEndings: [',', '}'],
  stringRegexBegin: /^Record\{/u,
  stringRegexEnd: /^\}/u,
  array: true,
  record: true,
  valueMatch (x) { // Like `object` type, can also match
    return x && typeof x === 'object' &&
      // Exclude other special object types
      toStringTag(x) === 'Object';
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
  viewUI (...args) {
    return arrayType.viewUI.apply(this, args);
  },
  editUI ({...args}) {
    return arrayType.editUI.call(this, {
      ...args, type: 'record'
    });
  }
};

export default recordType;

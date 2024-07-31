import {toStringTag} from '../vendor-imports.js';
import arrayType from './arrayType.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const objectType = {
  option: ['Object'],
  regexEndings: [',', '}'],
  stringRegexBegin: /^\{/u,
  stringRegexEnd: /^\}/u,
  valueMatch (x) {
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
  viewUI ({...args}) {
    return arrayType.viewUI.call(this, {
      ...args, type: 'object'
    });
  },
  editUI ({...args}) {
    return arrayType.editUI.call(this, {
      ...args, type: 'object'
    });
  }
};

export default objectType;

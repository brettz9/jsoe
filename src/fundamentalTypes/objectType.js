import Types from '../types.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const objectType = {
  option: ['Object'],
  regexEndings: [',', '}'],
  stringRegexBegin: /^\{/u,
  stringRegexEnd: /^\}/u,
  toValue (...args) {
    return Types.availableTypes.array.toValue.apply(this, args);
  },
  getValue (...args) {
    return Types.availableTypes.array.getValue.apply(this, args);
  },
  getInput (...args) {
    return Types.availableTypes.array.getInput.apply(this, args);
  },
  viewUI (...args) {
    return Types.availableTypes.array.viewUI.apply(this, args);
  },
  editUI ({...args}) {
    return Types.availableTypes.array.editUI.call(this, {
      ...args, type: 'object'
    });
  }
};

export default objectType;

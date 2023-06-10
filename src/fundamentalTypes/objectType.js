import arrayType from './arrayType.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const objectType = {
  option: ['Object'],
  regexEndings: [',', '}'],
  stringRegexBegin: /^\{/u,
  stringRegexEnd: /^\}/u,
  toValue (...args) {
    return arrayType.toValue.apply(this, args);
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
      ...args, type: 'object'
    });
  }
};

export default objectType;

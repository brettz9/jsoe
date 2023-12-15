import arrayType from './arrayType.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const filelistType = {
  option: ['FileList'],
  array: true,
  filelist: true,
  regexEndings: [',', ')'],
  stringRegexBegin: /^FileList\(/u,
  stringRegexEnd: /^\)/u,

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
      ...args, type: 'filelist'
    });
  },
  editUI ({...args}) {
    return arrayType.editUI.call(this, {
      ...args, type: 'filelist'
    });
  }
};

export default filelistType;

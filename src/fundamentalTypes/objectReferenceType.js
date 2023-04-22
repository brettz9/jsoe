import Types from '../types.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const objectReferenceType = {
  option: ['Object reference'],
  type: 'object',
  stringRegex: /^objectRef\((?:|\/[^)]*)\)$/u,
  toValue (...args) {
    return Types.availableTypes.arrayReference.toValue.apply(this, args);
  },
  resolveReference (...args) {
    return Types.availableTypes.arrayReference.resolveReference.apply(
      this, args
    );
  },
  stateDependent: {
    structuredCloning: {
      after: 'object',
      contexts: [
        'arrayNonindexKeys',
        // 'sparseArrays',
        'object'
      ]
    }
  },
  getInput (...args) {
    return Types.availableTypes.arrayReference.getInput.apply(this, args);
  },
  setValue (...args) {
    return Types.availableTypes.arrayReference.setValue.apply(this, args);
  },
  getValue (...args) {
    return Types.availableTypes.arrayReference.getValue.apply(this, args);
  },
  validate (...args) {
    return Types.availableTypes.arrayReference.validate.apply(this, args);
  },
  validateAll (...args) {
    return Types.availableTypes.arrayReference.validateAll.apply(this, args);
  },
  viewUI (...args) {
    return Types.availableTypes.arrayReference.viewUI.apply(this, args);
  },
  editUI (...args) {
    return Types.availableTypes.arrayReference.editUI.apply(this, args);
  }
};

export default objectReferenceType;

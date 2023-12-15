import arrayReferenceType from './arrayReferenceType.js';

/**
 * @type {import('../types.js').TypeObject & {type: string}}
 */
const objectReferenceType = {
  option: ['Object reference'],
  type: 'object',
  stringRegex: /^objectRef\((?:|\/[^)]*)\)$/u,
  toValue (...args) {
    return /** @type {import('../types.js').ToValue} */ (
      arrayReferenceType.toValue
    ).apply(this, args);
  },
  resolveReference (...args) {
    return arrayReferenceType.resolveReference?.apply(
      this, args
    );
  },
  stateDependent: {
    structuredCloning: {
      after: 'object',
      contexts: [
        'arrayNonindexKeys',
        // 'sparseArrays',
        'object',
        'set'
      ]
    }
  },
  getInput (...args) {
    return arrayReferenceType.getInput.apply(this, args);
  },
  setValue (...args) {
    return arrayReferenceType.setValue?.apply(this, args);
  },
  getValue (...args) {
    return arrayReferenceType.getValue.apply(this, args);
  },
  validate (...args) {
    return /** @type {{message?: string | undefined; valid: boolean;}} */ (
      arrayReferenceType.validate?.apply(this, args)
    );
  },
  validateAll (...args) {
    return arrayReferenceType.validateAll?.apply(this, args);
  },
  viewUI (...args) {
    return arrayReferenceType.viewUI.apply(this, args);
  },
  editUI (...args) {
    return arrayReferenceType.editUI.apply(this, args);
  }
};

export default objectReferenceType;

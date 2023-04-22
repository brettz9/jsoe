import * as structuredCloning from './structuredCloning.js';

// Todo (low): Support ArrayBuffer
/**
 * @returns {string[]}
 */
export const types = () => [
  'number', 'Infinities', 'string', 'ValidDate', 'array'
];

// A hack until we simply pass in our own types or do own parsing

/**
 * @param {string} newType
 * @param {Date|GenericArray} value
 * @returns {boolean}
 */
export const testInvalid = (newType, value) => {
  switch (newType) {
  /* istanbul ignore next -- Shouldn't occur as it is a preset */
  case 'Infinities':
    /* istanbul ignore next -- Shouldn't occur as it is a preset */
    return Number.isNaN(value);
  case 'ValidDate':
    return Number.isNaN(value.getTime());
  case 'array':
    return Object.keys(value).length !== value.length;
  /* istanbul ignore next -- Shouldn't occur */
  default:
    /* istanbul ignore next -- Shouldn't occur */
    return undefined; // Todo: Should this throw?
  }
};

/**
 * @param {string} typesonType
 * @returns {string}
 */
export const convertFromTypeson = (typesonType) => {
  return {
    SpecialNumber: 'Infinities', // This shouldn't occur as it is a preset
    date: 'ValidDate',
    // sparseArrays: 'array',
    arrayNonindexKeys: 'array'
  }[typesonType];
};

/**
 * @type {import('./structuredCloning.js').FormatIterator}
 */
export const iterate = (records, stateObj) => {
  stateObj.format = 'indexedDBKey';
  return structuredCloning.iterate(records, stateObj);
};

/**
 * @param {"array"|undefined} state
 * @returns {undefined|string[]}
 */
export const getTypesForState = function (state) {
  if (!state || ['array'].includes(state)) {
    return this.types();
  }
  /* istanbul ignore next -- Can't be object, so shouldn't reach here */
  return undefined; // Todo: Should this throw?
};

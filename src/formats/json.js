import * as structuredCloning from './structuredCloning.js';

/**
 * @returns {string[]}
 */
export const types = () => [
  'null', 'true', 'false', 'number', 'string', 'array', 'object'
];

/**
 * @type {FormatIterator}
 */
export const iterate = (records, stateObj) => {
  // Todo (low): Add a more optimal (`JSON.stringify`-based iterator)
  const recs = records;
  // I believe this escaping should be by Typeson itself
  // if (records && typeof records === 'object' && records.$types) {
  //   recs = {$: records, $types: true};
  // }
  stateObj.format = 'json';
  return structuredCloning.iterate(recs, stateObj);
};

// A hack until we simply pass in our own types or do own parsing
/**
 * @param {string} typesonType
 * @returns {string}
 */
export const convertFromTypeson = (typesonType) => {
  return {
    // sparseArrays: 'array',
    arrayNonindexKeys: 'array'
  }[typesonType];
};

/**
 * @param {string} newType
 * @param {GenericArray} value
 * @returns {boolean|undefined}
 */
export const testInvalid = (newType, value) => {
  switch (newType) {
  case 'array':
    return Object.keys(value).length !== value.length;
  /* istanbul ignore next -- Shouldn't occur */
  default:
    /* istanbul ignore next -- Shouldn't occur */
    return undefined; // Todo: Fix?
  }
};

/**
 * @param {string} state
 * @returns {string[]|undefined}
 */
export const getTypesForState = function (state) {
  /* istanbul ignore else -- No other states apparently */
  if (!state || ['array', 'object'].includes(state)) {
    return this.types();
  }
  // Todo: Should this throw?
  /* istanbul ignore next -- No other states apparently */
  return undefined;
};

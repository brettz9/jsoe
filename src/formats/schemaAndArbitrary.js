import * as structuredCloning from './structuredCloning.js';

/**
 * @type {FormatIterator}
 */
export const iterate = (records, stateObj) => {
  console.log('records', records, stateObj);
  stateObj.format = 'schemaAndArbitrary';
  return structuredCloning.iterate(records, stateObj);
};

/**
 * @param {string} state
 * @returns {string[]}
 */
export const getTypesForState = (state) => {
  return structuredCloning.getTypesForState.call(
    this, state
  );
};

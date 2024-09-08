import structuredCloning from './structuredCloning.js';

/** @type {import('../formats.js').Format} */
const arbitraryJS = {
  types () {
    return [
      ...structuredCloning.types(),
      'symbol',
      'promise',
      'function'
    ];
  },
  iterate (records, stateObj) {
    const recs = records;
    stateObj.format = 'arbitraryJS';
    return structuredCloning.iterate(recs, stateObj);
  },
  getTypesAndSchemasForState (types, state) {
    return structuredCloning.getTypesAndSchemasForState.call(
      this,
      types,
      state
    );
  }
};

export default arbitraryJS;

import indexedDBKey from './formats/indexedDBKey.js';
import json from './formats/json.js';
import structuredCloning from './formats/structuredCloning.js';

/**
 * An arbitrary Structured Clone, JSON, etc. value.
 * @typedef {any} StructuredCloneValue
 */

/* schema:
export const getTypeForFormatStateAndValue = ({format, state, value}) => {
  const valType = new Typeson().register(
    structuredCloningThrowing
  ).rootTypeName(value);
  return canonicalToAvailableType(format, state, valType, value);
};
*/

/**
 * @typedef {"indexedDBKey"|"json"|"structuredCloning"} AvailableFormat
 */

/**
 * @typedef {{
 *   types: () => (import('./types.js').AvailableType)[],
 *   testInvalid?: (
 *     newType: string, value: Date|Array<StructuredCloneValue>
 *   ) => boolean|undefined,
 *   convertFromTypeson?: (
 *     typesonType: import('./types.js').AvailableType
 *   ) => import('./types.js').AvailableType|undefined,
 *   iterate: import('./formats/structuredCloning.js').FormatIterator,
 *   getTypesForState: (state?: string) => undefined|
 *     (import('./types.js').AvailableType)[]
 * }} Format
 */

// Using methods ensure we have fresh copies
const Formats = {
  availableFormats: /** @type {{[key: string]: Format}} */ ({
    indexedDBKey,
    json,
    // Todo (readme): these too? getTypesForState(state)
    /* schema:
    schemaAndArbitrary,
    schemaOnly,
    */
    structuredCloning
  })
};

/**
 * @param {AvailableFormat} format
 * @param {StructuredCloneValue} record
 * @param {import('./types.js').StateObject} stateObj
 * @returns {Promise<Element>}
 */
export async function getControlsForFormatAndValue (format, record, stateObj) {
  return await Formats.availableFormats[format].
    iterate(record, {
      ...stateObj,
      // This had been before `stateObj` but should apparently have precedence
      //   or just avoid passing `format` to this function
      format
    });
}

export default Formats;

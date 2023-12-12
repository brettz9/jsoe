import indexedDBKey from './formats/indexedDBKey.js';
import json from './formats/json.js';
import structuredCloning from './formats/structuredCloning.js';

/**
 * An arbitrary Structured Clone, JSON, etc. value.
 * @typedef {any} StructuredCloneValue
 */

/**
 * @callback GetTypesForFormatAndState
 * @param {AvailableFormat} format
 * @param {string} [state]
 * @returns {import('./types.js').AvailableType[]|undefined}
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

/**
 * Class for processing multiple formats.
 */
class Formats {
  /**
   *
   */
  constructor () {
    // Can enable later (and add tests)
    // if (formats) {
    //   this.availableFormats = {};
    //   formats.forEach((format) => {
    //     let formatValue;
    //     switch (format) {
    //     case 'indexedDBKey':
    //       formatValue = indexedDBKey;
    //       break;
    //     case 'json':
    //       formatValue = json;
    //       break;
    //     case 'structuredCloning':
    //       formatValue = structuredCloning;
    //       break;
    //     default:
    //       throw new Error('Unknown format');
    //     }
    //     this.availableFormats[format] = formatValue;
    //   });
    //   return;
    // }
    // Using methods ensure we have fresh copies
    this.availableFormats = /** @type {{[key: string]: Format}} */ ({
      indexedDBKey,
      json,
      // Todo (readme): these too? getTypesForState(state)
      /* schema:
      schemaAndArbitrary,
      schemaOnly,
      */
      structuredCloning
    });
  }

  /**
   * @param {AvailableFormat} format
   * @param {StructuredCloneValue} record
   * @param {import('./types.js').StateObject} stateObj
   * @returns {Promise<Element>}
   */
  async getControlsForFormatAndValue (format, record, stateObj) {
    return await this.availableFormats[format].
      iterate(record, {
        ...stateObj,
        // This had been before `stateObj` but should apparently have precedence
        //   or just avoid passing `format` to this function
        format
      });
  }

  /**
   * @type {GetTypesForFormatAndState}
   */
  getTypesForFormatAndState (
    format, state
  ) {
    return this.availableFormats[format].getTypesForState(state);
  }

  /**
   * @param {AvailableFormat} format
   * @returns {Format}
   */
  getAvailableFormat (format) {
    return this.availableFormats[format];
  }
}

export default Formats;

import * as indexedDBKey from './formats/indexedDBKey.js';
import * as json from './formats/json.js';
import * as structuredCloning from './formats/structuredCloning.js';

/* schema:
const getTypeForFormatStateAndValue = ({format, state, value}) => {
  const valType = new Typeson().register(
    structuredCloningThrowing
  ).rootTypeName(value);
  return canonicalToAvailableType(format, state, valType, value);
};
Formats.getTypeForFormatStateAndValue = getTypeForFormatStateAndValue;
*/

// Using methods ensure we have fresh copies
const Formats = {
  availableFormats: {
    indexedDBKey,
    json,
    // Todo (readme): these too? getTypesForState(state)
    /* schema:
    schemaAndArbitrary,
    schemaOnly,
    */
    structuredCloning
  }
};

/**
 * @type {import('./formats/structuredCloning.js').FormatIterator}
 */
export async function iterateFormat (format, record, stateObj) {
  return await Formats.availableFormats[format]
    .iterate(record, {
      format,
      ...stateObj
    });
}

export default Formats;

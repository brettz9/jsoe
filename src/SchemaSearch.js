/* eslint-disable class-methods-use-this -- Testing */
import {jml} from '../src/vendor-imports.js';

/**
 *
 */
class SchemaSearch {
  /**
   * @param {import('./types.js').default} types
   * @param {import('zodex').SzType} schema
   * @returns {Element}
   */
  getControls (types, schema) {
    // Todo: Schema iteration and calls to relevant `types.schemaSearchUI`
    return jml('a');
  }
}
export default SchemaSearch;


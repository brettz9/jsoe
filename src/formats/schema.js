import {pointer} from '../vendor-imports.js';
import structuredCloning from './structuredCloning.js';

/**
 * @typedef {any} ZodexSchema
 */

/**
 * @param {ZodexSchema} schemaObject
 * @param {ZodexSchema} originalJSON
 * @returns {Set<string>}
 */
function getTypesForSchema (schemaObject, originalJSON) {
  switch (schemaObject.type) {
  case 'object': {
    const set = new Set();
    // const {properties} = schemaObject;
    // if (
    //   'type' in properties && properties.type.type === 'enum' &&
    //   properties.type.values.length === 1
    // ) {
    //   set.add(schemaObject);
    //   set.add(properties.type.defaultValue);
    // } else {
    //   set.add(schemaObject);
    // }
    set.add(schemaObject);
    return set;
  }
  case 'union': {
    let set = new Set();
    for (const option of schemaObject.options) {
      set = new Set([...set, ...getTypesForSchema(option, originalJSON)]);
    }
    return set;
  } case 'intersection': {
    // Todo: Add parts of intersection to each of children (including union
    //   children)
    const left = getTypesForSchema(schemaObject.left, originalJSON);
    const right = getTypesForSchema(schemaObject.right, originalJSON);
    return new Set([
      ...left,
      ...right
    ]);
  } default: {
    if ('$ref' in schemaObject) {
      const refObj = pointer(originalJSON, schemaObject.$ref.slice(1));
      return getTypesForSchema(refObj, originalJSON);
    }
    return new Set();
  }
  }
}

/** @type {import('../formats.js').Format} */
const schema = {
  iterate (records, stateObj) {
    console.log('records', records, stateObj);
    stateObj.format = 'schema';
    return structuredCloning.iterate(records, stateObj);
  },

  types () {
    return structuredCloning.types();
  },

  getTypesForState (types, state, schemaObject) {
    // alert(JSON.stringify(schemaObject));
    console.log(
      [...getTypesForSchema(schemaObject, schemaObject)]
    );

    // Todo: Substitutions below like bigInt -> bigint
    // Todo: Make void, any, unknown, never,
    //        NaN, literal, record, tuple, enum subgroups
    //        effect (and preset examples like -0, Infinity, -Infinity,
    //          classes)
    // Allow non-cloning version to return these too
    // return [
    //   'symbol',
    //   'function',
    //   'promise',
    //   'catch'
    // ];
    // Allow returning these
    // return [
    //   'union',
    //   'discriminatedUnion',
    //   'intersection'
    // ];

    return [
      // 'boolean', // Convert to `true` and `false`
      'number',
      // 'bigInt', // Convert to `bigint`
      'string',
      // 'nan', // Make as subgroup
      'date',
      // 'undefined', // Convert to `undef`
      'null',
      // 'any',
      // 'unknown',
      // 'never',
      // 'void',
      // 'literal',
      'array',
      'object',
      // 'union',
      // 'discriminatedUnion',
      // 'intersection',
      // 'tuple',
      // 'record',
      'map',
      'set'
      // 'enum',
      // 'effect'
    ];
  }
};

export default schema;

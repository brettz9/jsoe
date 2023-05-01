/* eslint-disable
  no-constant-condition,
  sonarjs/no-empty-collection,
  sonarjs/no-identical-conditions,
  no-constant-binary-expression -- Just debugging */
import {getTypeForFormatStateAndValue} from '../formats.js';
import * as structuredCloning from './structuredCloning.js';
import deepEqual from '../deepEqual.js';

/**
 * @typedef {import('./formats.js').StructuredCloneValue} StructuredCloneValue
 */
/**
 * @type {import('./structuredCloning.js').FormatIterator}
 */
export const iterate = (records, stateObj) => {
  console.log('records', records, stateObj);
  const {schemaContent: schema} = stateObj;
  if (!schema || typeof schema !== 'object') {
    throw new TypeError(`Malformed schema provided`);
  }
  stateObj.format = 'schemaOnly';
  /*
          Before labeling ANY (unless only one match), we need to
          confirm the whole is a match
          */
  stateObj[''] = schema;

  const possibleSchemaObjects = [];
  possibleSchemaObjects.map((possibleSchemaObject) => {
    return flattenSchemas({possibleSchemaObject});
  });

  const resolveRef = (/* {schema, possibleSchemaObject} */) => {
    // Todo?
  };

  /**
   * @param {object} cfg
   * @param {StructuredCloneValue[]} cfg.list
   * @param {StructuredCloneValue} cfg.value
   * @returns {boolean}
   */
  const valueInEnumList = ({list, value}) => {
    return list.some((en) => deepEqual(en, value));
  };
  const getTypesForValues = ({enumList}) => enumList.map(
    (value) => getTypeForFormatStateAndValue({
      value,
      format: 'structuredCloning',
      state: 'arrayNonindexKeys'
      // state: 'sparseArrays'
    })
  );
  /**
   * @typedef {PlainObject} SchemaObject
   * @property {string} type
   */
  /**
   * Avoids duplicates for same type but additive for `enum`
   * @param {Array<any>} anyOf
   * @returns {SchemaObject[]}
   */
  const reduceAnyOf = (anyOf) => {
    return anyOf.reduce((arr, schemaObj, _i) => {
      const earlierSchemaObject = arr.find((schemaObject) => {
        return schemaObject.type === schemaObj.type;
      });
      if (!earlierSchemaObject) {
        arr.push(schemaObj);
      } else if (earlierSchemaObject.enum) {
        schemaObj.enum.forEach((value) => {
          if (!valueInEnumList({
            value,
            list: earlierSchemaObject.enum
          })) {
            earlierSchemaObject.enum.push(value);
          }
        });
      } else if ('enum' in schemaObj) {
        earlierSchemaObject.enum = schemaObj.enum;
      }
      return arr;
    }, []);
  };
  const reduceEnumList = ({enumList}) => {
    const newEnumTypes = getTypesForValues({enumList});
    return reduceAnyOf(newEnumTypes.map((type, i) => {
      return {
        type,
        enum: enumList[i]
      };
    }));
  };
  const addEnumConstraint = ({schema, enumList}) => {
    if (!enumList.length) {
      throw new TypeError(`Not possible to match empty enum`);
    }

    enumList = reduceEnumList({enumList});

    // eslint-disable-next-line unicorn/prefer-ternary -- Refactoring
    if (!schema.enum) { // Enforce new constraint allowances
      schema.enum = enumList;
    } else { // Remove any old allowances not part of new ones
      schema.enum = schema.enum.filter((value) => {
        return valueInEnumList({
          value, list: enumList
        });
      });
    }
  };
  /**
   * Assumes confining further--not expanding allowances.
   * @param {PlainObject} args
   * @param {SchemaObject} args.schema
   * @param {Array<any>} args.enumList
   * @returns {undefined}
   */
  const addEnumAnyOfConstraint = ({schema, enumList}) => {
    if (!schema.anyOf.length) {
      // Reduction is necessary for duplicates within new items
      schema.anyOf = reduceEnumList({enumList});
      return;
    }
    const newEnumTypes = getTypesForValues({enumList});
    schema.anyOf = schema.anyOf.filter((subschema) => {
      const matchingNewEnumListItems = newEnumTypes.reduce(
        (arr, enumType, i) => {
          // Filter out different types
          if (enumType === subschema.type &&
            // Filter out enum values duplicated within new list
            !valueInEnumList({
              value: enumList[i],
              list: arr
            })
          ) {
            arr.push(enumList[i]);
          }
          return arr;
        },
        []
      );
      const hasMatchingType = matchingNewEnumListItems.length;
      if (hasMatchingType) {
        addEnumConstraint({
          schema: subschema, enumList: matchingNewEnumListItems
        });
      }
      return hasMatchingType;
    });
  };
  /**
   * Assumes confining further--not expanding allowances.
   * @param {PlainObject} args
   * @param {SchemaObject} args.schema
   * @param {Array<any>} args.newAnyOf
   * -- param {boolean} args.oneOf
   * @returns {undefined}
   */
  const addTypeConstraints = ({
    schema, newAnyOf // , oneOf = false
  }) => {
    newAnyOf = reduceAnyOf(newAnyOf);
    if (!schema.anyOf.length) {
      // Reduction is necessary for duplicates within new items
      schema.anyOf = newAnyOf;
      return;
    }
    schema.anyOf = schema.anyOf
      ? schema.anyOf.filter((preexistingSchema) => {
        const {type} = preexistingSchema;
        return newAnyOf.some((schemaObj) => {
          const addOrFilterEnumList = ({enumList}) => {
            // eslint-disable-next-line unicorn/prefer-ternary
            if (!preexistingSchema.enum) {
              preexistingSchema.enum = reduceEnumList({enumList});
            } else {
              preexistingSchema.enum = preexistingSchema.enum.filter(
                (value) => {
                  return valueInEnumList({
                    value, list: enumList
                  });
                }
              );
            }
          };
          const {
            type: newSchemaObjectType,
            enum: enumList,
            const: cnst
          } = schemaObj;
          const hasEnumList = Boolean(enumList);
          const hasConst = 'const' in schemaObj;
          const hasMatchingEnumType = hasEnumList &&
            getTypesForValues({enumList}).includes(type);
          const hasMatchingConstType = hasConst &&
            getTypesForValues({enumList: [cnst]}).includes(type);
          if (hasMatchingEnumType) {
            addOrFilterEnumList({enumList});
          }
          if (hasMatchingConstType) {
            addOrFilterEnumList({enumList: [cnst]});
          }
          return (!newSchemaObjectType || newSchemaObjectType === type) &&
                              (!hasEnumList || hasMatchingEnumType) &&
                              (!hasConst || hasMatchingConstType);
          // Todo (readme): Handle type-specific conditions
          // Todo (readme): Recurse on `anyOf`, etc. children
          // Todo (readme): Use `oneOf` argument (to add `not`?)
        });
      })
      : newAnyOf;
  };
  const confineSchemaType = ({targetSchema, newSchema}) => {
    if (newSchema.type) {
      if (targetSchema.type) {
        if (Array.isArray(targetSchema.type)) {
          if (Array.isArray(newSchema.type)) {
            targetSchema.type = targetSchema.type.filter((type) => {
              return newSchema.type.includes(type);
            });
          } else if (targetSchema.type.includes(newSchema.type)) {
            targetSchema.type = newSchema.type;
          } else {
            throw new TypeError(
              `The constraints for ${newSchema.type} and ` +
                `${targetSchema.type} cannot be met.`
            );
          }
        // Todo: This does nothing; why was this ocndition here?
        // eslint-disable-next-line no-dupe-else-if
        } else if (0 && Array.isArray(targetSchema.type)) {
          if (targetSchema.type.includes(newSchema.type)) {
            targetSchema.type = newSchema.type;
          } else {
            throw new TypeError(
              `The constraints for ${newSchema.type} and ` +
                `${targetSchema.type} cannot be met.`
            );
          }
        } else if (targetSchema.type !== newSchema.type) {
          throw new TypeError(
            `The constraints for ${newSchema.type} and ` +
              `${targetSchema.type} cannot be met.`
          );
        }
      } else {
        targetSchema.type = newSchema.type;
      }
    }
  };
  const consolidateSchemas = (schemas) => {
    const retSchema = {};
    schemas.forEach((schema) => {
      confineSchemaType({targetSchema: retSchema, newSchema: schema});
      if (schema.enum) {
        addEnumConstraint({schema: retSchema, enumList: schema.enum});
      }
      if ('const' in schema) {
        addEnumConstraint({schema: retSchema, enumList: [schema.const]});
      }
      if ('multipleOf' in schema) {
        if ('multipleOf' in retSchema) {
          if (retSchema.multipleOf % schema.multipleOf &&
            schema.multipleOf % retSchema.multipleOf
          ) {
            retSchema.multipleOf *= schema.multipleOf;
          }
        } else {
          retSchema.multipleOf = schema.multipleOf;
        }
      }
      if ('maximum' in schema) {
        if ('maximum' in retSchema) {
          if (schema.maximum < retSchema.maximum) {
            retSchema.maximum = schema.maximum;
          }
        } else {
          retSchema.maximum = schema.maximum;
        }
      }
      if ('minimum' in schema) {
        if ('minimum' in retSchema) {
          if (schema.minimum > retSchema.minimum) {
            retSchema.minimum = schema.minimum;
          }
        } else {
          retSchema.minimum = schema.minimum;
        }
      }
      if ('maxLength' in schema) {
        if ('maxLength' in retSchema) {
          if (schema.maxLength < retSchema.maxLength) {
            retSchema.maxLength = schema.maxLength;
          }
        } else {
          retSchema.maxLength = schema.maxLength;
        }
      }
      if ('minLength' in schema) {
        if ('minLength' in retSchema) {
          if (schema.minLength > retSchema.minLength) {
            retSchema.minLength = schema.minLength;
          }
        } else {
          retSchema.minLength = schema.minLength;
        }
      }
      if ('pattern' in schema) {
        if ('allOf' in retSchema) {
          if (!retSchema.allOf.some(
            (item) => item.pattern === schema.pattern
          )) {
            retSchema.allOf.push({pattern: schema.pattern});
          }
        } else { /* if ('pattern' in retSchema) {
              retSchema.allOf = [
                {pattern: retSchema.pattern},
                {pattern: schema.pattern}
              ];
              delete retSchema.pattern;
          } else { */
          // retSchema.pattern = schema.pattern;
          retSchema.allOf = [{pattern: schema.pattern}];
        }
      }
      if ('maxItems' in schema) {
        if ('maxItems' in retSchema) {
          if (schema.maxItems < retSchema.maxItems) {
            retSchema.maxItems = schema.maxItems;
          }
        } else {
          retSchema.maxItems = schema.maxItems;
        }
      }
      if ('minItems' in schema) {
        if ('minItems' in retSchema) {
          if (schema.minItems > retSchema.minItems) {
            retSchema.minItems = schema.minItems;
          }
        } else {
          retSchema.minItems = schema.minItems;
        }
      }
      // Todo (low): Add `format` to `allOf`?
      /*
        Todo (readme): Merge other properties
        6.4. Validation Keywords for Arrays
        6.4.1. items
        6.4.2. additionalItems
        6.4.5. uniqueItems
        6.4.6. contains
        6.5. Validation Keywords for Objects
        6.5.3. required
        6.5.4. properties
        6.5.5. patternProperties
        6.5.6. additionalProperties
        6.5.7. dependencies
        6.5.8. propertyNames
        6.6. Keywords for Applying Subschemas Conditionally
        6.6.1. if
        6.6.2. then
        6.6.3. else
        6.7. Keywords for Applying Subschemas With Boolean Logic
        6.7.1. allOf
        6.7.2. anyOf
        6.7.3. oneOf
        6.7.4. not
        */
      if ('maxProperties' in schema) {
        if ('maxProperties' in retSchema) {
          if (schema.maxProperties < retSchema.maxProperties) {
            retSchema.maxProperties = schema.maxProperties;
          }
        } else {
          retSchema.maxProperties = schema.maxProperties;
        }
      }
      if ('minProperties' in schema) {
        if ('minProperties' in retSchema) {
          if (schema.minProperties > retSchema.minProperties) {
            retSchema.minProperties = schema.minProperties;
          }
        } else {
          retSchema.minProperties = schema.minProperties;
        }
      }
    });
    // Todo (low): We could remove properties if type doesn't support
    if ('maximum' in retSchema && `exclusiveMaximum` in retSchema) {
      if (retSchema.maximum >= retSchema.exclusiveMaximum) {
        delete retSchema.maximum;
      } else {
        delete retSchema.exclusiveMaximum;
      }
    }
    if ('minimum' in retSchema && `exclusiveMinimum` in retSchema) {
      if (retSchema.minimum <= retSchema.exclusiveMinimum) {
        delete retSchema.minimum;
      } else {
        delete retSchema.exclusiveMinimum;
      }
    }
    if ('maximum' in retSchema && `minimum` in retSchema &&
      retSchema.maximum < retSchema.minimum
    ) {
      throw new TypeError(`Max under minimum`);
    }
    if ('maximum' in retSchema && `exclusiveMinimum` in retSchema &&
      retSchema.maximum <= retSchema.exclusiveMinimum
    ) {
      throw new TypeError(`Max under or equal to exclusive minimum`);
    }
    if ('exclusiveMaximum' in retSchema &&
      `exclusiveMinimum` in retSchema &&
      retSchema.exclusiveMaximum < retSchema.minimum
    ) {
      throw new TypeError(`Exclusive max under exclusive minimum`);
    }
    if ('exclusiveMaximum' in retSchema && `minimum` in retSchema &&
      retSchema.exclusiveMaximum <= retSchema.minimum
    ) {
      throw new TypeError(`Exclusive max under or equal to minimum`);
    }
    if ('maxLength' in retSchema && `minLength` in retSchema &&
      retSchema.maxLength < retSchema.minLength
    ) {
      throw new TypeError('Max length under min length');
    }
    // Todo (low): We might parse `pattern` to see if it necessitates
    //   a `minLength` (or a `maxLength` if `^` and `$` are used?)
    return retSchema;
  };
  const flattenSchemas = ({schema, possibleSchemaObject: pso}) => {
    if (!schema) {
      schema = {};
    }
    // Todo (readme): resolve refs
    resolveRef({schema, pso});

    // type -> [type] -> anyOf
    const newAnyOf = 'type' in pso
      ? (Array.isArray(pso.type) ? pso.type : [pso.type]).map(
        (type) => ({type})
      )
      : [];
    addTypeConstraints({schema, newAnyOf});

    // enum -> enum
    // const -> enum
    if ('const' in pso) {
      addEnumAnyOfConstraint({schema, enumList: [pso.const]});
    }
    if ('enum' in pso) {
      addEnumAnyOfConstraint({schema, enumList: pso.enum});
    }

    if (pso.anyOf) {
      addTypeConstraints({schema, newAnyOf: pso.anyOf});
    }
    if (pso.oneOf) {
      addTypeConstraints({schema, newAnyOf: pso.oneOf, oneOf: true});
    }
    if (pso.allOf) {
      addTypeConstraints({schema, newAnyOf: [
        consolidateSchemas(pso.allOf)
      ]});
    }
    if (pso.not) {
      // Todo
    }
    if (pso.if) {
      // pso.then
      // pso.else
    }
    // flattenSchemas(pso.anyOf))
    if (!schema.anyOf.length) {
      // Todo: Should allow anything
    }

    // Todo: Handle `$ref` and aggregate oneOf/allOf/anyOf
    //          (including `type: []`)/not; if/then/else
    // to `anyOf` with each constrained with any `allOf` for
    //    required (and any `not` (including `oneOf`) for prohibited if
    //    they can't be expressed as allOf),
    //    and any `if` conditions applied?
    // Todo: Keep going until find all `type` (object/array/etc.)
    //         and extract out
    return []; // Todo: Add possible schema objects
  };
  // Todo: Descend into arrays/objects (changing path)
  const resolvePropertyInSchemas = (/* {
    possibleSchemaObjects, arrayOrObjectPropertyName
  } */) => {
    // Todo?
  };
  stateObj.getPossibleSchemasForPathAndType = function ({
    keypath, parentPath, valueType, arrayOrObjectPropertyName
  }) {
    const possibleSchemaObjects = flattenSchemas({
      possibleSchemaObject: stateObj[parentPath]
    });

    // Todo: We'll probably need a separate encapsulateObserver
    //        run-through to ensure we exclude all non-viable
    //        schemas along the way
    // Todo: Check type/enum
    if (parentPath) {
      resolvePropertyInSchemas({
        possibleSchemaObjects, arrayOrObjectPropertyName
      });
    }

    if (!stateObj[keypath]) {
      stateObj[keypath] = [];
    }
    stateObj[keypath].push(
      ...possibleSchemaObjects.filter((possibleSchemaObject) => {
        return 'type' in possibleSchemaObject &&
                          possibleSchemaObject.type === valueType;
      })
    );

    // apparently need this or else no return type to assign
    return stateObj;
  };
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

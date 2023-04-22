import Formats from '../formats.js';
import Types from '../types.js';
import {buildTypeChoices} from '../typeChoices.js';
import {
  Typeson, unescapeKeyPathComponent, structuredCloningThrowing
} from '../../vendor/typeson-registry/dist/index.js';
import {
  typesonPathToJSONPointer
} from '../utils/jsonPointer.js';

import * as json from './json.js';

/**
 * @callback EncapsulateObserver
 * @param {TypesonObserver} observerObj
 * @returns {void}
 */

/**
 * @param {import('../types.js').StateObject} stateObj
 * @returns {EncapsulateObserver}
 */
const encapsulateObserver = (stateObj) => {
  const {
    typeNamespace, readonly, format, schemaContent,
    getPossibleSchemasForPathAndType
  } = stateObj;
  const parents = {};
  return (observerObj) => {
    const {
      type,
      cyclic,
      keypath,
      value,
      replaced,
      cyclicKeypath,
      endIterateIn,
      endIterateOwn,
      endIterateUnsetNumeric,
      clone
    } = observerObj;
    // console.log('observerObj', observerObj);
    if ('replaced' in observerObj) {
      return;
    }
    if (cyclic === 'readonly' && !Array.isArray(observerObj.value)) {
      return;
    }
    if (endIterateIn || endIterateOwn) {
      return;
    }
    if (endIterateUnsetNumeric || (
      clone === undefined && cyclicKeypath === undefined && Array.isArray(value)
    )) {
      return;
    }

    /* istanbul ignore if -- Not part of format */
    if (type === 'sparseUndefined') { // We'll handle otherwise
      return;
    }

    // console.log('observerObj', observerObj);

    let newType;
    let newValue = value;

    /* schema: || format.startsWith('schema-') */
    const state = format === 'structuredCloning'
      ? 'arrayNonindexKeys'
    // ? 'sparseArrays'
      : 'array';
    if (typeof cyclicKeypath === 'string') {
      newValue = typesonPathToJSONPointer(cyclicKeypath);
      newType = type === 'array' ? 'arrayReference' : 'objectReference';
      newType = canonicalToAvailableType(
        format, state, newType, value
      ); // Todo (low): Add accurate state for second argument
    } else {
      try {
        newType = canonicalToAvailableType(
          format, state, type, value
        ); // Todo (low): Add state for second argument
      } catch (err) {
        console.log('err', type, err);
        stateObj.error = err;
        return;
      }
    }

    const li = keypath.lastIndexOf('.');
    const arrayOrObjectPropertyName =
      unescapeKeyPathComponent(keypath.slice(li + 1));
    const parentPath = li === -1 ? '' : keypath.slice(0, li);

    const hasChildren = [
      'array', 'object',
      // 'sparseArrays',
      'arrayNonindexKeys'
    ].includes(newType);

    if (!stateObj.rootUI) {
      stateObj.rootUI = Types.getUIForModeAndType({
        readonly,
        typeNamespace,
        type: newType,
        bringIntoFocus: false,
        buildTypeChoices,
        format,
        schemaContent,
        schemaState: getPossibleSchemasForPathAndType,
        /* schema:
        &&
        getPossibleSchemasForPathAndType({
          keypath,
          parentPath: '',
          valueType: newType
        }),
        */
        value: newValue,
        hasValue: true,
        // Not currently in use but may be convenient for a
        //     type wanting the serialized data
        replaced
      });
      parents[''] = stateObj.rootUI;
      return;
    }

    // Todo (low): If could be async, use async encapsulate method
    // Todo (low): Handle `awaitingTypesonPromise` with place-holder
    // Todo (low): Handle `resolvingTypesonPromise` to replace place-holder
    setTimeout(() => {
      const ui = parents[parentPath];
      // These errors occur, e.g., if `replacing` not first added and then
      //   a converted object gets treated as the root UI (e.g., for `regexp`
      //   or `blobHTML` at root)
      // If there isn't a problem in Typeson with transmitting the `readonly`
      //   status recursively down the object (should be no need to check
      //   for circulars there?), could change Typeson to report `readonly`
      //   for the nested items, in which case, we could block out `readonly`
      //   instead of doing this here
      if (!ui || !ui.$addAndSetArrayElement) {
        return;
      }
      const root = ui.$addAndSetArrayElement({
        propName: arrayOrObjectPropertyName,
        type: newType,
        value: newValue,
        bringIntoFocus: false,
        schemaContent,
        schemaState: getPossibleSchemasForPathAndType
        /* schema:
          && getPossibleSchemasForPathAndType({
            keypath,
            parentPath,
            arrayOrObjectPropertyName,
            valueType: newType
          })
        */
      });
      if (!readonly) {
        Types.setValue({type: newType, root, value: newValue});
        Types.validate({type: newType, root, topRoot: stateObj.rootUI});
      }

      if (hasChildren) {
        parents[keypath] = root;
      }
    });
  };
};

/**
 * @param {string[]} originTypes
 * @param {[originType: string, replacementType: string][]} replacements
 * @returns {void}
 */
const replaceTypes = (originTypes, replacements) => {
  replacements.forEach(([originType, replacementType]) => {
    originTypes.splice(originTypes.indexOf(originType), 1, replacementType);
  });
};

/**
 * @param {string} format
 * @param {string} state
 * @param {string} valType
 * @param {ArbitraryValue} v
 * @throws {Error}
 * @returns {string}
 */
const canonicalToAvailableType = (format, state, valType, v) => {
  const frmt = Formats.availableFormats[format];
  const {getTypesForState, convertFromTypeson, testInvalid} = frmt;
  const allowableTypes = getTypesForState.call(frmt, state);
  let ret;
  console.log('format, state, valType, v', format, state, valType, v);
  const isInvalid = (newValType) => {
    console.log('newValType', newValType);
    const err = new Error('Invalid');
    err.newValType = newValType;
    throw err;
  };
  if (convertFromTypeson) {
    const newValType = convertFromTypeson(valType);
    if (typeof newValType === 'string') {
      if (testInvalid && testInvalid(newValType, v)) {
        return isInvalid(newValType);
      }
      valType = newValType;
    }
  }
  if (allowableTypes.some((allowableType) => {
    if (allowableType === valType) {
      ret = allowableType;
      return true;
    }
    return false;
  })) {
    return ret;
  }
  console.log('ret', ret);
  allowableTypes.some((allowableType) => {
    const {
      valueMatch, superType, childTypes
    } = Types.availableTypes[allowableType];
    if (
      (superType && valueMatch &&
        // Currently using for `true` and `false`
        superType === valType && valueMatch(v)) ||
      (childTypes && childTypes.includes(valType))
    ) {
      ret = allowableType;
      return true;
    }
    return false;
  });
  console.log('ret2', ret);
  if (ret === undefined) {
    return isInvalid(valType);
  }
  return ret;
};

/**
 * @callback FormatIterator
 * @param {StructuredCloneValue} records
 * @param {{
 *   format: string
 *   error: Error
 *   rootUI: Element
 * }} stateObj
 * @returns {Promise<Element>}
 */

/**
 * @type {FormatIterator}
 */
export const iterate = (records, stateObj) => {
  console.log('records', records);
  if (!stateObj.format) {
    stateObj.format = 'structuredCloning';
  }
  // Todo: Replace this with async typeson?
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const typeson = new Typeson({
      encapsulateObserver: encapsulateObserver(stateObj)
    }).register(structuredCloningThrowing);
    typeson.encapsulate(records);
    // Todo (low): We might want to run async encapsulate for
    //   async types (and put this after Promise resolves)
    if (stateObj.error) {
      reject(stateObj.error);
    } else {
      resolve(stateObj.rootUI);
    }
  });
};

/**
 * @param {string} state
 * @returns {string[]}
 */
export const getTypesForState = function (state) {
  if (state && Types.contexts.structuredCloning[state]) {
    const typesForFormat = this.getTypesForState() ||
      /* istanbul ignore next -- types should be an array */
      [];
    Types.contexts.structuredCloning[state].forEach(({type, after}) => {
      const precedingIdx = typesForFormat.indexOf(after);
      typesForFormat.splice(precedingIdx + 1, 0, type);
    });
    return typesForFormat;
  }
  return this.types();
  /*
  // Todo (low): These need to specify their own inner contexts
  if (['map', 'set'].includes(state)) {return;}
  if ('int8array', 'uint8array', 'uint8clampedarray',
    'int16array', 'uint16array', 'int32array',
    'uint32array', 'float32array', 'float64array'
  ).includes(state)) {return;}
  */
};

/**
 * @returns {string[]}
 */
export const types = () => {
  const jsonTypes = json.types();
  replaceTypes(jsonTypes, [
    [
      'array',
      // 'sparseArrays',
      'arrayNonindexKeys'
    ]
  ]);
  return [
    // This type is only for throwing upon cloning errors:
    // 'checkDataCloneException'
    // This type might be supported by evaluable JS or config passed in:
    // 'userObject'
    ...jsonTypes,
    'undef', // Explicit undefined only
    'bigint',
    'SpecialNumber', // '`NaN`, `Infinity`, `-Infinity`'},
    'date',
    'regexp',
    'BooleanObject',
    'NumberObject',
    'StringObject',
    'blobHTML'
    // Ok, but will need some work
    //     'map', 'set',
    //     'blob', 'file', 'filelist'
    //     'arraybuffer', 'arraybufferview'
    //     'dataview', 'imagedata', 'imagebitmap',
    /*
              // Typed Arrays
              'int8array',
              'uint8array',
              'uint8clampedarray',
              'int16array',
              'uint16array',
              'int32array',
              'uint32array',
              'float32array',
              'float64array',

              // Intl (imperfect)
              'IntlCollator',
              'IntlDateTimeFormat',
              'IntlNumberFormat'
              */
  ];
};

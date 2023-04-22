import {jml} from '../vendor/jamilih/dist/jml-es.js';
import {
  Typeson, getJSONType, structuredCloningThrowing
} from '../vendor/typeson-registry/dist/index.js';

import Formats from './formats.js';

import {$e, $$e} from './utils/templateUtils.js';

import nullType from './fundamentalTypes/nullType.js';
import trueType from './subTypes/trueType.js';
import falseType from './subTypes/falseType.js';
import blobHTMLType from './subTypes/blobHTMLType.js';
import numberType from './fundamentalTypes/numberType.js';
import bigintType from './fundamentalTypes/bigintType.js';
import stringType from './fundamentalTypes/stringType.js';
import arrayReferenceType from './fundamentalTypes/arrayReferenceType.js';
import objectReferenceType from './fundamentalTypes/objectReferenceType.js';
import arrayType from './fundamentalTypes/arrayType.js';
import objectType from './fundamentalTypes/objectType.js';
import dateType from './fundamentalTypes/dateType.js';
import undefinedType from './fundamentalTypes/undefinedType.js';
import regexpType from './fundamentalTypes/regexpType.js';
import BooleanObjectType from './fundamentalTypes/BooleanObjectType.js';
import NumberObjectType from './fundamentalTypes/NumberObjectType.js';
import StringObjectType from './fundamentalTypes/StringObjectType.js';
import sparseUndefinedType from './fundamentalTypes/sparseUndefinedType.js';
import InfinitiesSuperType from './superTypes/InfinitiesSuperType.js';
import SpecialNumberSuperType from './superTypes/SpecialNumberSuperType.js';

/**
 * Utility to retrieve the property value given a legend element.
 * @param {HTMLLegendElement} legend
 * @returns {string}
 */
export const getPropertyValueFromLegend = (legend) => {
  const propElem = $e(legend, '*[data-prop="true"]');
  return propElem.nodeName.toLowerCase() === 'input'
    ? propElem.value
    : String(Number.parseInt(propElem.textContent) - 1); // 1-based to 0-based
};

const Types = {};

/**
 * @typedef {object} TypeObject
 * @property {JamilihArray} option Creates the option HTML. May set an option
 *   `title` or `value`
 * @property {boolean} [array] Private context variable. Whether or not
 *   it is an array. Do not use in other types.
 * @property {string[]} [regexEndings] Used for string parsing.
 * @property {RegExp} [stringRegex] Used for string parsing. If not
 *   present, use `stringRegexBegin` and `stringRegexEnd`
 * @property {RegExp} [stringRegexBegin] Used for string parsing. If not
 *   present, use `stringRegex`
 * @property {RegExp} [stringRegexEnd] Used for string parsing. If not
 *   present, use `stringRegex`
 * @property {
 *   (ArbitraryValue) => boolean
 * } [valueMatch] Function to check whether this subtype matches
 * @property {string} [superType] The greater fundamental type to which
 *   the type belongs
 * @property {(s: string) => ArbitraryValue} toValue Converts from
 *   string to value. May use `stringRegex` to find components.
 * @property {
 *   (info: {root?: HTMLDivElement}) => ArbitraryValue
 * } getValue Gets the value for the type
 * @property {
 *   (info: {root?: HTMLDivElement}) => void
 * } [setValue] Should set the value of the form's `getInput` element
 * @property {
 *   (info: {
 *     value?: ArbitraryValue,
 *     typeNamespace?: string,
 *     type?: string,
 *     topRoot?: HTMLDivElement,
 *     resultType?: "keys"|"values"|"both",
 *     format?: string
 *   }) => JamilihArray
 * } viewUI
 * @property {
 *   (info: {
 *     value?: ArbitraryValue,
 *     typeNamespace?: string,
 *   }) => JamilihArray
 * } editUI
 * @property {
 *   (info: {root: HTMLDivElement}) =>
 *     HTMLInputElement|HTMLTextareaElement|HTMLSelectElement
 * } getInput Gets the form control (with `value`)
 * @property {
 *   (path: string, value: ArbitraryValue) => ArbitraryValue
 * } [resolveReference] Gets the reference. For array and object
 *   references types only
 * @property {(info: {root: HTMLDivElement, topRoot?: HTMLDivElement}) => {
 *   message: string,
 *   valid: boolean
 * }} [validate] Message will be used if validity is false.
 * @property {(info: {topRoot: HTMLDivElement}) => void} [validateAll] For
 *   validation of array and object references only.
 * @property {{
 *   structuredCloning: {
 *     after: string,
 *     contexts: string[]
 *   }
 * }} [stateDependent] The type after which it should be placed and its
 *   context types
 */

Types.availableTypes = {
  null: nullType,
  true: trueType,
  false: falseType,
  number: numberType,
  bigint: bigintType,
  string: stringType,
  arrayReference: arrayReferenceType,
  objectReference: objectReferenceType,
  array: arrayType,
  // Note: We don't do for BooleanObject/NumberObject/StringObject, date,
  //   regexp, as added properties on them are not being cloned (in Chrome
  //   at least)
  object: objectType,
  date: dateType,

  // This type is only for throwing upon cloning errors:
  // 'checkDataCloneException'
  // This type might be supported by evaluable JS or config
  //   passed in:
  userObject: ['User objects'],
  undef: undefinedType,
  Infinities: InfinitiesSuperType,
  SpecialNumber: SpecialNumberSuperType,

  regexp: regexpType,
  BooleanObject: BooleanObjectType,
  NumberObject: NumberObjectType,
  StringObject: StringObjectType,

  map: {
    option: ['Map']
  },
  set: {
    option: ['Set']
  },

  file: {
    option: ['File']
  },
  filelist: {
    option: ['FileList']
  },
  blobHTML: blobHTMLType,
  arraybuffer: {
    option: ['ArrayBuffer']
  },
  arraybufferview: {
    option: ['ArrayBufferView']
  },
  dataview: {
    option: ['DataView']
  },
  imagedata: {
    option: ['ImageData']
  },
  imagebitmap: {
    option: ['ImageBitmap']
  },

  // Typed Arrays
  int8array: {
    option: ['Int8Array']
  },
  uint8array: {
    option: ['Uint8Array']
  },
  uint8clampedarray: {
    option: ['Uint8ClampedArray']
  },
  int16array: {
    option: ['Int16Array']
  },
  uint16array: {
    option: ['Uint16Array']
  },
  int32array: {
    option: ['Int32Array']
  },
  uint32array: {
    option: ['Uint32Array']
  },
  float32array: {
    option: ['Float32Array']
  },
  float64array: {
    option: ['Float64Array']
  },

  // Intl (imperfect)
  IntlCollator: {
    option: ['Intl.Collator']
  },
  IntlDateTimeFormat: {
    option: ['Intl.DateTimeFormat']
  },
  IntlNumberFormat: {
    option: ['Intl.NumberFormat']
  },

  // We're catching this instead of using this
  sparseUndefined: sparseUndefinedType
};
Types.availableTypes.ValidDate = {
  valid: true
};
/*
Types.availableTypes.sparseArrays = {
    sparse: true
};
*/
Types.availableTypes.arrayNonindexKeys = {
  sparse: true
};

/**
 * @param {[copyTo: string, copyFrom: string]} replacements
 * @returns {void}
 */
const copyTypeObjs = (replacements) => {
  replacements.forEach(([copyFrom, copyTo]) => {
    Object.assign(Types.availableTypes[copyTo], Types.availableTypes[copyFrom]);
  });
};
copyTypeObjs([
  ['date', 'ValidDate'],
  [
    'array',
    'arrayNonindexKeys'
    // 'sparseArrays'
  ]
]);

/**
 * Utility to retrieve the type out of a type root element.
 * @public
 * @param {?RootElement} root
 * @returns {string|undefined} Why would it not exist?
 */
Types.getTypeForRoot = (root) => {
  return root && root.dataset.type;
};

/**
 * Utility to get the value out of a type root element with a given
 *   state and path.
 * @public
 * @param {RootElement} root
 * @param {StateObject} stateObj
 * @param {string} currentPath
 * @returns {StructuredCloneValue}
 */
Types.getValueForRoot = (root, stateObj, currentPath) => {
  return Types.availableTypes[Types.getTypeForRoot(root)].getValue({
    root, stateObj, currentPath
  });
};

/**
 * Utility to get the form control (e.g., input element) for a root.
 * @public
 * @param {RootElement} root
 * @returns {null|HTMLInputElement}
 */
Types.getFormControlForRoot = (root) => {
  const typeObj = Types.availableTypes[Types.getTypeForRoot(root)];
  /* istanbul ignore if -- All have except aliases */
  if (!typeObj.getInput) {
    return null;
  }
  return typeObj.getInput({root});
};

/**
 * Utility to get the value for a root using its ancestor and state.
 * @public
 * @param {string|Element} selOrEl
 * @param {StateObject} stateObj
 * @returns {StructuredCloneValue}
 */
Types.getValueFromRootAncestor = (selOrEl, stateObj) => {
  return Types.getValueForRoot($e(selOrEl, 'div[data-type]'), stateObj);
};

/**
 * @public
 * @param {string|Element} selOrEl
 * @returns {null|HTMLInputElement}
 */
Types.getFormControlFromRootAncestor = (selOrEl) => {
  const root = $e(selOrEl, 'div[data-type]');
  if (!root) {
    return null;
  }
  return Types.getFormControlForRoot(root);
};

/**
 * @param {string} format
 * @param {string} state
 * @returns {string[]}
 */
Types.getTypesForFormatAndState = (
  format, state
) => Formats.availableFormats[format].getTypesForState(state);

/**
 * @public
 * @param {string} type
 * @returns {JamilihArray}
 */
Types.getOptionForType = (type) => {
  const optInfo = [...Types.availableTypes[type].option];
  optInfo[1] = {value: type, ...optInfo[1]};
  return optInfo;
};

/**
 * @public
 * @param {string} format
 * @param {string} parserState
 * @returns {JamilihArray[]}
 */
Types.getTypeOptionsForFormatAndState = (format, parserState) => {
  const typesForFormatAndState = Types.getTypesForFormatAndState(
    format, parserState
  );
  return typesForFormatAndState.map((type) => {
    return Types.getOptionForType(type);
  });
};

/**
 * @public
 * @param {object} cfg
 * @param {boolean} cfg."readonly"
 * @param {"both"|"keys"|"values"} cfg.resultType
 * @param {string} cfg.typeNamespace
 * @param {string} cfg.type
 * @param {RootElement} cfg.topRoot
 * @param {boolean} cfg.bringIntoFocus
 * @param {BuildTypeChoices} cfg.buildTypeChoices
 * @param {string} cfg.format
 * @param {string} cfg.schemaContent
 * @param {StateObject} cfg.schemaState Not currently in use and may
 *   need to change the type
 * @param {StructuredCloneValue} cfg.value
 * @param {boolean} cfg.hasValue
 * @returns {Element}
 */
Types.getUIForModeAndType = ({
  readonly, resultType, typeNamespace, type, topRoot, bringIntoFocus,
  buildTypeChoices, format, schemaContent, schemaState, value, hasValue
}) => {
  const typeObj = Types.availableTypes[type];
  const root = jml(
    ...typeObj[readonly ? 'viewUI' : 'editUI'](
      hasValue
        ? {
          typeNamespace, type, buildTypeChoices,
          format, schemaContent, schemaState,
          resultType, topRoot, bringIntoFocus, value
        }
        : {
          typeNamespace, type, buildTypeChoices,
          format, schemaContent, schemaState,
          resultType, topRoot, bringIntoFocus
        }
    )
  );
  if (!readonly && typeObj.validate) {
    const formControl = typeObj.getInput({root});
    formControl.addEventListener('input', () => {
      Types.validate({type, root, topRoot});
    });
  }
  return root;
};

Types.contexts = {};
Object.entries(Types.availableTypes).forEach(([type, {stateDependent}]) => {
  if (stateDependent) {
    Object.entries(stateDependent).forEach(([format, formatStateDependent]) => {
      if (!Types.contexts[format]) {
        Types.contexts[format] = {};
      }
      const {contexts, after} = formatStateDependent;
      contexts.forEach((context) => {
        if (!Types.contexts[format][context]) {
          Types.contexts[format][context] = [];
        }
        Types.contexts[format][context].push({type, after});
      });
    });
  }
});

/**
 * @public
 * @param {object} cfg
 * @param {HTMLFormElement} cfg.form
 * @param {string} cfg.typeNamespace
 * @param {string} cfg.keySelectClass
 * @returns {boolean}
 */
Types.validValuesSet = ({form, typeNamespace, keySelectClass}) => {
  // If form is hidden, don't list errors by default
  if (!form.offsetParent ||
        // Not an invalid form (bad key or value)
        // May be redundant as re-validating below
        !form.checkValidity()
  ) {
    return false;
  }

  const typeChoices = $$e(
    form,
    keySelectClass ? `.${keySelectClass}` : `.typeChoices-${typeNamespace}`
  );
  return (
    // Specific value type set if present (any descendant, not
    //   only the first) chosen
    typeChoices.every((sel) => {
      // console.log('sel', sel.value !== '' && sel.$validate());
      // Hidden are ok
      return !sel.offsetParent ||
        // If present, must be valid
        (sel.value !== '' && sel.$validate());
    })
  // Container of a specific type added (should always be present
  //   if typeChoices non-empty)
  // $e(form, '.typeContainer')
  );
};

/**
 * Any other possibilities than `div`?
 * @typedef {HTMLDivElement} RootElement
 */

/**
 * @public
 * @param {object} cfg
 * @param {RootElement} cfg.topRoot
 * @returns {void}
 */
Types.validateAllReferences = ({topRoot}) => {
  /* istanbul ignore if -- Unreachable? */
  if (!topRoot) {
    console.log('No references present');
    return;
  }

  // Could just hard-code arrayReference and objectReference,
  //  but we'll try to avoid depending on specific types
  Object.values(Types.availableTypes).forEach((typeObject) => {
    if (typeObject.validateAll) {
      typeObject.validateAll({topRoot});
    }
  });

  if (Types.customValidateAllReferences) {
    Types.customValidateAllReferences({topRoot});
  }
};

/**
 * @public
 * @param {object} cfg
 * @param {string} cfg.type
 * @param {RootElement} cfg.root
 * @param {RootElement} cfg.topRoot
 * @returns {boolean}
 */
Types.validate = ({type, root, topRoot}) => {
  const typeObj = Types.availableTypes[type];
  // Todo (low): We limit for now to input boxes which have `validate`
  if (typeObj.validate) {
    const {valid, message} = typeObj.validate({root, topRoot});
    const formControl = typeObj.getInput({root});
    formControl.setCustomValidity(
      valid
        ? ''
        /* istanbul ignore next -- Should always have a message */
        : message || 'Invalid'
    );
    formControl.reportValidity();
    return valid;
  }
  return true;
};

/**
 * @param {object} cfg
 * @param {string} cfg.type
 * @param {RootElement} cfg.root
 * @param {StructuredCloneValue} cfg.value
 * @returns {void}
 */
Types.setValue = ({type, root, value}) => {
  const typeObj = Types.availableTypes[type];
  if (typeObj.setValue) {
    typeObj.setValue({root, value});
  }
};

/**
 *
 * @param {string} str
 * @returns {string}
 */
function escapeRegex (str) {
  return String(str)
    .replace(/[.\\+*?^[\]$(){}=!<>|:-]/gu, '\\$&');
}

// Todo (low): Should really add real parser
// Todo (low): Implement `getStringForValue` (e.g., to expose feature for
//          bookmarking object value currently in view); would not be
//          enough to iterate DOM to get string URL as we'd also like
//          the ability to have arbitrary JSON/structuredCloning sent to this
//          URL from other sites/programs (can currently pass in JSON
//          format to the URL, but that is still expecting our Router
//          string syntax)

/**
 * @public
 * @param {string} s
 * @param {object} cfg
 * @param {string} cfg.format
 * @param {string} cfg.state
 * @param {TypeObject[]} [cfg.endMatchTypeObjs=[]]
 * @param {boolean} [cfg.firstRun=true]
 * @param {
 *   [
 *     type: string,
 *     parent: array|object,
 *     parentPath: string,
 *     path: string
 *   ]
 * } [cfg.rootHolder=[]]
 * @param {ArbitraryArray|ArbitraryObject} cfg.parent
 * @param {string} cfg.parentPath
 * @returns {{
 *   value: ArbitraryValue,
 *   remnant: string,
 *   beginOnly: boolean,
 *   assign: boolean
 * }}
 */
Types.getValueForString = (s, {
  format, state, endMatchTypeObjs = [], firstRun = true,
  rootHolder = [], parent, parentPath
}) => {
  let assign = true;
  let match;
  const allowedTypes = Types.getTypesForFormatAndState(format, state);
  const allowedTypeObjs = Object.entries(
    Types.availableTypes
  ).filter(([type]) => allowedTypes.includes(type));
  const allowedTypeObjsVals = allowedTypeObjs.map(([, arr]) => arr);

  const endings = '|' + allowedTypeObjsVals.reduce((arr, typeObj) => {
    if (typeObj.regexEndings) {
      arr.push(...typeObj.regexEndings);
      arr = [...new Set(arr)];
    }
    return arr;
  }, []).map((str) => escapeRegex(str)).join('|');

  let found = allowedTypeObjs.find(([_type, typeObj]) => {
    let {stringRegex} = typeObj;
    if (typeof stringRegex === 'function') {
      stringRegex = typeObj.stringRegex(true);
    }
    stringRegex = stringRegex
      // Strip off terminal (dollar sign) when matching substrings
      ? new RegExp(
        stringRegex.source.slice(0, -1) + '(?=$' + endings + ')',
        'u'
      )
      : stringRegex;
    match = stringRegex && s && s.match(stringRegex);
    return match;
  });

  let beginOnly;
  if (found === undefined) {
    found = allowedTypeObjs.find(([_type, typeObj]) => {
      const {stringRegexBegin} = typeObj;
      match = stringRegexBegin && s && s.match(stringRegexBegin);
      if (match) {
        beginOnly = true;
        endMatchTypeObjs.push(typeObj);
      }
      return match;
    });
  }
  if (found !== undefined) {
    let remnant = s.slice(match[0].length);
    s = s.slice(0, match[0].length);
    // console.log('s0', s, '::', remnant, match);
    let valObj;
    try {
      valObj = found[1].toValue(match[1] || s, {
        format,
        endMatchTypeObjs,
        remnant,
        rootHolder,
        parent,
        parentPath
      });
    } catch (e) {
      console.log('eee', e);
      throw e;
    }
    if (valObj.assign === false) {
      assign = false;
    }
    const {value} = valObj;
    if (valObj.remnant !== undefined) {
      ({remnant} = valObj);
    }

    if (beginOnly && endMatchTypeObjs.length) {
      const endMatch = remnant.match(
        endMatchTypeObjs.slice(-1)[0].stringRegexEnd
      );
      if (endMatch) {
        endMatchTypeObjs.pop(); // Safe now to extract
        remnant = remnant.slice(endMatch[0].length);
      }
    }
    if (firstRun) {
      const typeson = new Typeson().register(
        structuredCloningThrowing
      );
      try {
        const topRoot = typeson.revive(value);
        rootHolder.forEach(([type, parent, parentPath, path]) => {
          const val = Types.availableTypes[type + 'Reference']
            .resolveReference(path, topRoot);
          const basicType = getJSONType(val);
          // eslint-disable-next-line max-len -- Long
          /* istanbul ignore else -- Successful reference always an object/array? */
          if (
            ['array', 'object'].includes(type) && basicType === type
          ) {
            parent[parentPath] = val;
          }
        });
        return [topRoot, remnant, beginOnly, assign];
      } catch (err) {
        console.log('failed Typeson revival', err);
      }
    }
    return [value, remnant, beginOnly, assign];
  }
  throw new Error('Bad parsing data');
};

export default Types;

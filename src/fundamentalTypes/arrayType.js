import {jml, nbsp} from '../vendor-imports.js';

import {getPropertyValueFromLegend} from '../types.js';
import {$e, $$e, U, DOM} from '../utils/templateUtils.js';
import dialogs from '../utils/dialogs.js';
import {
  resolveJSONPointer, getJSONPointerParts, reduceJSONPointerParts
} from '../utils/jsonPointer.js';
import FileList from '../utils/FileList.js';

let optionalPropertyId = 0;

/**
 * @typedef {number} Integer
 */
/**
 * @callback ParseInt
 * @this {HTMLInputElement}
 * @returns {false|Integer}
 */
/**
 * @typedef {() => HTMLInputElement[]} InputsExceedingLength
 */
/**
 * @typedef {() => (HTMLSelectElement & {
 *   $getValue: import('../typeChoices.js').GetValue
 * })[]} GetMapKeySelects
 */
/**
 * @typedef {() => void} ValidateMapKey
 */
/**
 * @callback GetPropertyInputs
 * @returns {HTMLInputElement[]}
 */

/**
 * @callback RedrawMoveArrows
 * @returns {void}
 */
/**
 * @typedef {() => HTMLDivElement & {
 *   $inputsExceedingLength: InputsExceedingLength,
 *   $getPropertyInputs: GetPropertyInputs,
 *   $redrawMoveArrows: RedrawMoveArrows,
 *   $getMapKeySelects: GetMapKeySelects
 * }} GetArrayItems
 */
/**
 * @typedef {() => Promise<void>} Validate
 */

/**
 * @callback Resort
 * @param {{alwaysFocus?: true}} cfg
 * @returns {void}
 */

/**
 * @typedef {() => HTMLInputElement|undefined} GetPropertyInput
 */

/**
 * @typedef {any} AnyValue
 */

/**
 * Algorithm used for checking key identity in `Map`'s.
 * @param {AnyValue} x
 * @param {AnyValue} y
 * @returns {boolean}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality
 */
function sameValueZero (x, y) {
  if (typeof x === 'number' && typeof y === 'number') {
    // x and y are equal (may be -0 and 0) or they are both NaN
    // eslint-disable-next-line no-self-compare -- Not pointless with -0
    return x === y || (x !== x && y !== y);
  }
  return x === y;
}

/**
 * @type {import('../types.js').TypeObject & {sparse?: boolean|undefined}}
 */
const arrayType = {
  option: ['Array'],
  array: true,
  // sparse: undefined, // Don't add as will be copied
  regexEndings: [',', ']'],
  stringRegexBegin: /^\[/u,
  stringRegexEnd: /^\]/u,
  valueMatch (x) {
    return Array.isArray(x);
  },
  toValue (s, info) {
    const {
      /* istanbul ignore next -- Just a guard */
      endMatchTypeObjs = [],
      remnant: innerContents,
      rootHolder,
      schemaObject
    } = /** @type {import('../types.js').RootInfo} */ (info);
    // eslint-disable-next-line prefer-destructuring -- TS
    const format = /** @type {import('../types.js').RootInfo} */ (info).format;
    // eslint-disable-next-line prefer-destructuring -- TS
    const types = /** @type {import('../types.js').default} */ (
      /** @type {import('../types.js').RootInfo} */ (info).types
    );
    const {sparse} = this;
    const state = sparse
      ? 'arrayNonindexKeys'
    // ? 'sparseArrays'
      : (this.array && !this.record ? 'array' : 'object');
    /** @type {{[key: (string|number)]: any}} */
    const retObj = this.array && !this.record ? [] : {};
    let stringVal = innerContents !== undefined
      ? innerContents
      /* istanbul ignore next -- Unreachable? */
      : s;

    /**
     * @param {boolean} beginOnly
     * @returns {boolean}
     */
    const checkEnd = (beginOnly) => {
      if (beginOnly && endMatchTypeObjs.length) {
        const endMatch = stringVal.match(
          /** @type {RegExp} */ (
            /** @type {import('../types.js').TypeObject} */ (
              endMatchTypeObjs.at(-1)
            ).stringRegexEnd
          )
        );
        if (endMatch) {
          endMatchTypeObjs.pop(); // Safe now to extract
          stringVal = stringVal.slice(endMatch[0].length);
          return true;
        }
      }
      return false;
    };
    if (this.array && !this.record) {
      let idx = 0;
      const parse = () => {
        if (!stringVal) {
          return;
        }
        const sparseEntriesOrSpaces = stringVal.match(sparse ? /^[,\s]+/u : /^\s*,?\s*/u);
        if (sparseEntriesOrSpaces) {
          const ws = sparseEntriesOrSpaces[0].match(/\s/gu);
          idx += sparseEntriesOrSpaces[0].length - (ws ? ws.length : 0);
          stringVal = stringVal.slice(sparseEntriesOrSpaces[0].length);
          if (!stringVal) {
            return;
          }
        }
        let v, beginOnly, assign;
        try {
          [v, stringVal, beginOnly, assign] = types.getValueForString(
            stringVal,
            {
              firstRun: false,
              format,
              state,
              schemaObject,
              endMatchTypeObjs, rootHolder, parent: retObj, parentPath: idx
            }
          );
        } catch (err) {
          console.log('e', err);
          return;
        }
        if (assign) {
          retObj[idx] = v;
        }
        if (checkEnd(beginOnly)) {
          return;
        }
        parse();
      };
      parse();
      if (sparse && idx && idx > retObj.length - 1) {
        retObj.length = idx + 1;
      }
      return {
        value: this.set && Array.isArray(retObj)
          ? new Set(retObj)
          : this.map
            ? new Map(/** @type {Array<any>} */ (retObj))
            : this.filelist
              ? new FileList(retObj)
              : retObj,
        remnant: stringVal
      };
    }

    /**
     * @param {boolean} [notFirstRun]
     * @returns {void}
     */
    const parse = (notFirstRun) => {
      if (!stringVal) {
        return;
      }
      if (notFirstRun && stringVal[0] === ',') {
        stringVal = stringVal.slice(1);
      }
      const propAndColon = stringVal.match(/^\s*(?:([^:"}]+)|"((?:[^\\"]|\\\\|\\")*)")(\s*:\s*)/u); // Todo (low): Use some identifier production
      if (!propAndColon) { // End of object
        return;
      }
      const [, prop, propHadQuotes] = propAndColon;
      const pr = prop !== undefined ? prop : propHadQuotes;
      stringVal = stringVal.slice(propAndColon[0].length);
      let v, beginOnly, assign;
      try {
        [v, stringVal, beginOnly, assign] = types.getValueForString(
          stringVal,
          {
            firstRun: false, format, state, schemaObject,
            endMatchTypeObjs, rootHolder, parent: retObj, parentPath: pr
          }
        );
      } catch {
        // console.log(
        //   'errrrr', stringVal,
        //   JSON.stringify(endMatchTypeObjs)
        // );
        return;
      }
      // console.log('vvv', stringVal, beginOnly, v);
      if (assign) {
        // eslint-disable-next-line @stylistic/max-len -- Long
        /** @type {{[key: string]: import('../formats.js').StructuredCloneValue}} */ (
          retObj
        )[pr] = v;
      }
      if (checkEnd(beginOnly)) {
        return;
      }
      parse(true);
    };
    parse();
    return {value: retObj, remnant: stringVal};
  },
  getValue ({root, stateObj, currentPath = ''}) {
    /* istanbul ignore if */
    if (!stateObj) {
      throw new Error('TS guard'); // TS guard
    }
    // eslint-disable-next-line prefer-destructuring -- TS
    const types = /** @type {import('../types.js').default} */ (stateObj.types);
    const top = currentPath === '';
    const arrayItems =
      /**
       * @type {HTMLElement & {
       *   $getMapKeySelects: GetMapKeySelects
       * }}
       */ ($e(root, '.arrayItems'));
    const fieldsets = [...arrayItems.children];

    /**
     * @type {({[key: string]: any})|any[]}
     */
    const ret = root.dataset.type === 'object'
      ? {}
      : !this.sparse
        ? []
        : Array.from({length: Number.parseInt(
          /** @type {HTMLInputElement} */ (DOM.filterChildElements(
            root,
            ['div', 'div', 'label', 'input']
          )[0]).value
        )});

    // Todo: Should this be renamed per return arguments to
    //   `getRefOrVal` or is it ok?

    /**
     * @param {HTMLDivElement} root
     * @param {string} currentPathPart
     * @returns {[boolean, any?]}
     */
    const getValOrRef = (root, currentPathPart) => {
      const value = types.getValueForRoot(
        root, stateObj, currentPath + '/' + currentPathPart
      );
      if ('handlingReference' in stateObj && stateObj.handlingReference) {
        // We deal with references later once object is fully constructed
        stateObj.handlingReference = false;
        return [false];
      }
      return [true, value];
    };
    fieldsets.forEach((fieldset) => {
      const legend = /** @type {HTMLLegendElement} */ (
        fieldset.firstElementChild
      );
      const propVal = getPropertyValueFromLegend(legend);
      const root = /** @type {HTMLDivElement} */ (
        DOM.filterChildElements(
          /** @type {HTMLFieldSetElement} */
          (fieldset),
          [
            '.typeContainer',
            'div[data-type]'
          ]
        )[0] || DOM.filterChildElements(
          /** @type {HTMLFieldSetElement} */
          (fieldset),
          [
            '[class^=optionalProperties-placeholder]',
            '.typeContainer',
            'div[data-type]'
          ]
        )[0]
      );
      /* istanbul ignore if -- Should err first? */
      if (!root) {
        return;
      }

      const objectProperty = DOM.filterChildElements(legend, ['input']);
      const [isVal, value] = getValOrRef(
        root,
        propVal
      );
      if (isVal) {
        if (objectProperty.length) {
          /** @type {{[key: string]: any}} */ (ret)[propVal] = value;
        } else {
          ret.push(value);
        }
      }
    });
    if (top) {
      Object.entries(stateObj.paths || []).forEach(
        ([referencePath, {referentPath /* , expectArrayReferent */}]) => {
          const referentObj = referentPath === ''
            ? ret
            : resolveJSONPointer({
              path: referentPath,
              obj: ret
            });
          const referencePathJsonPtr = getJSONPointerParts(referencePath);
          const referenceFinalPathPart = referencePathJsonPtr.pop();
          const referenceParentObj = referencePathJsonPtr.reduce(
            (obj, pathPart) => {
              return reduceJSONPointerParts(obj, pathPart);
            },
            ret
          );
          /** @type {{[key: string]: any}} */ (referenceParentObj)[
            /** @type {string} */ (referenceFinalPathPart)
          ] = referentObj;
        }
      );
    }
    return this.filelist
      ? new FileList(ret)
      : this.set && Array.isArray(ret)
        ? new Set(ret)
        : this.map
          ? new Map(arrayItems.$getMapKeySelects().map((select, idx) => {
            const key = select.$getValue();
            return [key, /** @type {any[]} */ (ret)[idx]];
          }))
          : this.record
            ? arrayItems.$getMapKeySelects().reduce((obj, select, idx) => {
              const key = select.$getValue();
              const val = /** @type {any[]} */ (ret)[idx];
              obj[key] = val;
              // Todo: Reenable for native enums
              // The nature of native enums
              // if (typeof val === 'number') {
              //   obj[val] = key;
              // }
              return obj;
            }, /** @type {{[key: string]: any}} */ ({}))
            : ret;
  },

  // Try to keep in sync with basic structure of `editUI`
  viewUI ({
    typeNamespace, type, types, value, topRoot, resultType, format,
    specificSchemaObject
  }) {
    // const {sparse} = this;
    let itemIndex = -1;

    const parentType = type;

    /**
     * @param {{
     *   itemIndex: number,
     *   typeNamespace?: string,
     *   propName?: string
     * }} cfg
     * @returns {import('jamilih').JamilihArray}
     */
    const buildLegend = ({
      /* className, type, arrayItems, */
      itemIndex, typeNamespace, propName
    }) => {
      const tupleItem = /** @type {import('zodex').SzTuple} */ (
        specificSchemaObject
      )?.items?.[itemIndex];
      const restItem = /** @type {import('zodex').SzTuple} */ (
        specificSchemaObject
      )?.rest;
      return ['legend', [
        this.array && type !== 'record'
          ? /** @type {import('zodex').SzArray} */ (
            specificSchemaObject
          )?.element?.description ??
            ((type === 'set' && /** @type {import('zodex').SzSet} */ (
              specificSchemaObject
            )?.value?.description)
              ? /** @type {import('zodex').SzSet} */ (
                specificSchemaObject
              )?.value?.description
              : (
                tupleItem?.description ?? restItem?.description
              )) ?? 'Item'
          : specificSchemaObject ? '' : 'Property',
        specificSchemaObject ? '' : ':',
        nbsp.repeat(2),
        ['span', {
          class: `propertyName-${typeNamespace}`,
          title: type === 'record' && /** @type {import('zodex').SzRecord} */ (
            specificSchemaObject
          )?.key?.description
            ? /** @type {import('zodex').SzRecord} */ (
              specificSchemaObject
            )?.key?.description
            : specificSchemaObject ? propName : undefined
        }, [
          propName !== undefined
            ? /** @type {import('zodex').SzObject} */ (
              specificSchemaObject
            )?.properties?.[propName]?.description ?? propName
            // eslint-disable-next-line @stylistic/max-len -- Long
            /* istanbul ignore next -- Won't reach here as typeson will always give keypath? */
            : itemIndex
        ]]
      ]];
    };
    const div = jml('div', /** @type {import('jamilih').JamilihAttributes} */ ({
      class: 'arrayHolder',
      dataset: {type},
      $custom: {
        /**
         * @param {{
         *   propName: string,
         *   type: import('../types.js').AvailableType,
         *   value: import('../formats.js').StructuredCloneValue,
         *   bringIntoFocus: boolean,
         *   schemaContent: import('../formats/schema.js').ZodexSchema,
         * }} cfg
         * @returns {Element}
         */
        $addAndSetArrayElement ({
          propName, type, value, bringIntoFocus,
          schemaContent
        }) {
          if (parentType === 'map') {
            const root = types.getUIForModeAndType({
              resultType,
              readonly: true,
              typeNamespace, type, topRoot,
              bringIntoFocus,
              format, schemaContent,
              value,
              hasValue: true // type === 'sparseArrays' && value
            });
            if (propName === '0') {
              const fieldset = this.$addMapElement();
              this._lastFieldset = fieldset;
              const keyFieldset = jml(
                'fieldset', [
                  ['legend', {
                    title: /** @type {import('zodex').SzMap<any, any>} */ (
                      specificSchemaObject
                    )?.key?.description
                      ? '(map key)'
                      : undefined
                  }, [
                    /** @type {import('zodex').SzMap<any, any>} */ (
                      specificSchemaObject
                    )?.key?.description ?? 'Key'
                  ]]
                ], fieldset
              );
              jml(root, keyFieldset);
            } else { // propName === '1'
              const valueFieldset = jml(
                'fieldset', [
                  ['legend', {
                    title: /** @type {import('zodex').SzMap<any, any>} */ (
                      specificSchemaObject
                    )?.value?.description
                      ? '(map value)'
                      : undefined
                  }, [
                    /** @type {import('zodex').SzMap<any, any>} */ (
                      specificSchemaObject
                    )?.value?.description ??
                    'Value'
                  ]]
                ], this._lastFieldset
              );
              this._lastFieldset = null;
              jml(root, valueFieldset);
            }
            return root;
          }

          const fieldset = this.$addArrayElement({propName});
          const root = types.getUIForModeAndType({
            resultType,
            readonly: true,
            typeNamespace, type, topRoot,
            bringIntoFocus,
            format,
            schemaContent,
            specificSchemaObject: schemaContent,
            value,
            hasValue: true // type === 'sparseArrays' && value
          });
          jml(root, fieldset);
          return root;
        },
        /**
         * @returns {HTMLFieldSetElement}
         */
        $addMapElement () {
          itemIndex++;
          const arrayItems = this.$getArrayItems();
          // const className = `${type}Item`;
          const fieldset = jml('fieldset', [
            buildLegend({
              // className,
              // type,
              // arrayItems,
              itemIndex,
              typeNamespace,
              propName: undefined
            })
          ], arrayItems);
          return fieldset;
        },
        /**
         * @param {{propName: string}} cfg
         * @returns {HTMLFieldSetElement}
         */
        $addArrayElement ({propName}) {
          itemIndex++;
          const arrayItems = this.$getArrayItems();
          // const className = `${type}Item`;
          const fieldset = jml('fieldset', [
            buildLegend({
              // className,
              // type,
              // arrayItems,
              itemIndex,
              typeNamespace,
              propName
            })
          ], arrayItems);
          return fieldset;
        },
        $getArrayItems () {
          return this.lastElementChild.lastElementChild;
        }
      }
    }), [
      ['span', {
        title: specificSchemaObject?.description
      }, [
        specificSchemaObject
          ? '—'
          : DOM.initialCaps(/** @type {import('../types.js').AvailableType} */ (
            type
          )).replace(/s$/u, '')
      ]],
      nbsp.repeat(2),
      ['button', {$on: {click (/** @type {Event} */ e) {
        e.preventDefault();
        const {target} = e;
        const arrayContents = /** @type {HTMLDivElement} */ ($e(
          /** @type {HTMLElement} */
          (/** @type {HTMLElement} */ (target).closest('.arrayHolder')),
          '.arrayContents'
        ));
        arrayContents.hidden = !arrayContents.hidden;
        /** @type {HTMLElement} */ (
          target
        ).textContent = arrayContents.hidden ? '+' : '-';
      }}}, ['-']],
      ['div', {class: 'arrayContents'}, [
        this.array && type !== 'record'
          ? ['div', {
            title: specificSchemaObject
              ? (type === 'filelist'
                ? '(a FileList)'
                : type === 'set'
                  ? '(a Set)'
                  : type === 'map'
                    ? '(a Map)'
                    : type === 'tuple'
                      ? '(a tuple)'
                      : '(an Array)')
              : undefined
          }, [
            type === 'filelist'
              ? (specificSchemaObject?.description ?? 'FileList') + ' length: '
              : type === 'set'
                ? (specificSchemaObject?.description ?? 'Set') + ' size: '
                : type === 'map'
                  ? (specificSchemaObject?.description ?? 'Map') + ' size: '
                  : (specificSchemaObject?.description ?? 'Array') +
                    ' length: ',
            ['span', [
              (value && (type === 'set' || type === 'map')
                ? value.size
                : value.length) || 0
            ]]
          ]]
          : (type === 'record'
            ? specificSchemaObject?.description ?? 'Record'
            : ''),
        ['div', {
          class: 'arrayItems'
        }]
      ]]
    ]);
    return [div];
  },
  getInput ({root}) {
    // One element we are guaranteed to have for adding validation
    return /** @type {HTMLButtonElement} */ ($e(root, 'button'));
  },
  // Unlike other items, we don't use the `value`, as it wil always be
  //    an array (or object if called by that method) and we handle the
  //    population of the array in the callback
  editUI ({
    typeNamespace, buildTypeChoices, format, // resultType,
    formats, types, specificSchemaObject, schemaFallingBack, schemaContent,
    type, forcedState, topRoot, value: objectValue, bringIntoFocus = true
  }) {
    const {sparse} = this;
    // eslint-disable-next-line consistent-this -- Clearer
    const parentTypeObject = this;
    const itemAdjust = type === 'object' ? 1 : 0;
    let itemIndex = itemAdjust - 1;
    const editableProperties = type !== 'array' &&
      type !== 'set' && type !== 'map' && type !== 'filelist' &&
      type !== 'tuple' && type !== 'record'; // arrayNonindexKeys and object?
    const mapProperties = type === 'map' || type === 'record';

    const elementDesc = /** @type {import('zodex').SzArray} */ (
      specificSchemaObject
    )?.element?.description ?? (type === 'set'
      ? /** @type {import('zodex').SzSet} */ (
        specificSchemaObject
      )?.value?.description
      : undefined);

    /**
     * @param {HTMLInputElement} input
     * @param {true|undefined} alwaysFocus
     * @returns {void}
     */
    const bringFocus = (input, alwaysFocus) => {
      if (bringIntoFocus || alwaysFocus) {
        input.scrollIntoView();
        input.focus();
      }
    };

    /**
     * @callback SwapGroup
     * @param {Element} holder
     * @param {"up"|"down"} direction
     * @returns {void}
     */

    /**
     * @type {SwapGroup}
     * @this {HTMLDivElement}
     */
    const $swapGroup = function (holder, direction) {
      const group = /** @type {HTMLElement} */ (holder.parentElement);
      const swapGroup = /** @type {HTMLElement} */ (group[
        (direction === 'up' ? 'previousElementSibling' : 'nextElementSibling')
      ]);
      /* istanbul ignore if -- Just a guard */
      if (!swapGroup || swapGroup.nodeName.toLowerCase() !== 'fieldset') {
        return;
      }
      if (!sparse && (!specificSchemaObject || parentTypeObject.array)) {
        const swapCountElem = DOM.filterChildElements(
          swapGroup, ['legend', `.${type}Item`]
        )[0];
        const baseCountElem = DOM.filterChildElements(group, [
          'legend', `.${type}Item`
        ])[0];

        const swap = swapCountElem.textContent;
        const base = baseCountElem.textContent;
        swapCountElem.textContent = base;
        baseCountElem.textContent = swap;
      } else {
        // eslint-disable-next-line @stylistic/max-len -- Long
        const swapCountElem = /** @type {HTMLInputElement & {$parseInt: ParseInt}} */
          (/**
           * @type {HTMLFieldSetElement & {$getPropertyInput: GetPropertyInput}}
           */ (
              group
            ).$getPropertyInput());
        // eslint-disable-next-line @stylistic/max-len -- Long
        const baseCountElem = /** @type {HTMLInputElement & {$parseInt: ParseInt}} */
          (/**
           * @type {HTMLFieldSetElement & {$getPropertyInput: GetPropertyInput}}
           */ (
              swapGroup
            ).$getPropertyInput());
        if (typeof swapCountElem.$parseInt() === 'number' ||
          typeof baseCountElem.$parseInt() === 'number'
        ) {
          const swap = swapCountElem.value;
          const base = baseCountElem.value;
          swapCountElem.value = base;
          baseCountElem.value = swap;
        }
      }
      /*
      const baseID = group.id;
      const swapID = swapGroup.id;
      swapGroup.id = baseID;
      group.id = swapID;
      */
      if (direction === 'up') {
        swapGroup.before(group);
      } else {
        group.before(swapGroup);
      }
      types.validateAllReferences({
        // eslint-disable-next-line object-shorthand -- TS
        topRoot: /** @type {HTMLDivElement} */ (topRoot)
      }); // Needed

      /** @type {HTMLDivElement & {$redrawMoveArrows: RedrawMoveArrows}} */ (
        this
      ).$redrawMoveArrows();
    };

    /**
     * @type {RedrawMoveArrows}
     * @this {HTMLDivElement & {$swapGroup: SwapGroup}}
     */
    const $redrawMoveArrows = function () {
      if (type === 'tuple') { // Don't want to move non-rest items at least
        return;
      }
      DOM.filterChildElements(this, [
        'fieldset', `.${type}Item-arrowHolder-${typeNamespace}`
      ]).forEach((holder, j, arr) => {
        DOM.removeChildren(holder);
        let up = true, down = true;
        if (arr.length === 1) { // Nowhere to move
          return;
        }
        if (j === 0) {
          up = false;
        } else if (j === arr.length - 1) {
          down = false;
        }
        if (up) {
          jml('button', {$on: {click: () => {
            this.$swapGroup(holder, 'up');
          }}}, [U.upArrow], holder);
        }
        if (down) {
          jml('button', {$on: {click: () => {
            this.$swapGroup(holder, 'down');
          }}}, [U.downArrow], holder);
        }
      });
    };

    /**
     * @typedef {() => void} ValidateLegend
     */

    /**
     * @type {ValidateLegend}
     * @this {HTMLInputElement & {
     *   $arrayItems: HTMLDivElement & {
     *     $getPropertyInputs: GetPropertyInputs
     *   }
     * }}
     */
    const $validateLegend = function () {
      const propertyNameInputs = this.$arrayItems.$getPropertyInputs();
      const invalidStr = propertyNameInputs.some((input) => {
        return this !== input && input.value === this.value;
      })
        ? 'Duplicate property name'
        : '';

      // Don't validate if erring previously for other reason
      if (invalidStr) {
        this.setCustomValidity(
          invalidStr
        );
        this.reportValidity();
      }

      // Others may be ok (or problematic) now too
      propertyNameInputs.some((input, /* typeNamespace, */ _i, arr) => {
        const invalidStr = arr.some((item) => {
          return input !== item && input.value === item.value;
        })
          ? 'Duplicate property name'
          : '';

        if (input.validity.valid ||
          // If we just found it had an invalid length, don't
          //   make it valid now
          /* istanbul ignore next -- How to replicate? */
          input.validationMessage !== 'Invalid length'
        ) {
          input.setCustomValidity(
            invalidStr
          );
          if (invalidStr) {
            // Might not want this as changes focus; if ok, will hopefully be
            //   marked as such elsewhere
            input.reportValidity();
          }
        }
        return invalidStr; // Don't give a chance to become valid
      });
    };

    /**
     * @typedef {HTMLDivElement & {
     *   $inputsExceedingLength: InputsExceedingLength,
     *   $getPropertyInputs: GetPropertyInputs,
     *   $redrawMoveArrows: RedrawMoveArrows
     *   $getMapKeySelects: GetMapKeySelects
     * }} ArrayItems
     */

    /**
     * @param {{
     *   className: string,
     *   splice: "append"|number|undefined,
     *   itemIndex: number,
     *   typeNamespace: string|undefined,
     *   arrayItems: ArrayItems,
     *   propName: string|undefined,
     *   required?: true,
     *   schema?: import('zodex').SzType
     * }} cfg
     * @returns {import('jamilih').JamilihArray}
     */
    const buildLegend = ({
      className, splice, itemIndex, /* type, */ typeNamespace,
      arrayItems, propName, required, schema
    }) => {
      /**
       * @callback ValidateLength
       * @param {boolean} [avoidDialog]
       * @returns {Promise<void>}
       */

      /**
       * @type {ValidateLength}
       * @this {HTMLInputElement & {
       *   $validateLength: ValidateLength
       * }}
       */
      const $validateLength = async function (avoidDialog) {
        if (!sparse) {
          return;
        }
        const inputsExceedingLength = arrayItems.$inputsExceedingLength();
        const exceedsLength = inputsExceedingLength.length;
        if (avoidDialog || !exceedsLength || !(/^\d+$/u).test(this.value)) {
          return;
        }
        await dialogs.confirm({
          message: 'You are attempting to add an (integer-based) ' +
            'array item beyond the length. Click "Ok" to allow to ' +
            'permit and extend the array length or "Cancel" otherwise.'
        });
        const arrLengthInput =
          /** @type {HTMLInputElement & {$oldvalue: string}} */ (
            $e(
              /** @type {HTMLElement} */ (arrayItems.previousElementSibling),
              'input'
            )
          );
        const highest = /** @type {number} */ (inputsExceedingLength.map(
          (i) => Number.parseInt(i.value)
        ).sort().at(-1));
        arrLengthInput.value = String(highest + 1);
        arrLengthInput.$oldvalue = String(highest + 1);
        // Does have potential side effects calling `$inputsExceedingLength`
        this.$validateLength(true);
      };
      if (mapProperties) {
        const keyTypeSelection =
          /** @type {import('../typeChoices.js').BuildTypeChoices} */ (
            buildTypeChoices
          )({
            value: propName !== undefined && type === 'record'
              ? propName
              : undefined,
            setValue: propName !== undefined && type === 'record',
            // Needed as false when map value supplied
            autoTrigger: propName === undefined || type === 'record',
            // eslint-disable-next-line object-shorthand -- TS
            format: /** @type {import('../formats.js').AvailableFormat} */ (
              format
            ),
            schemaOriginal: schemaContent,
            // Can also be a `Record`
            schemaContent: /** @type {import('zodex').SzMap<any, any>} */ (
              specificSchemaObject
            )?.key,
            typeNamespace: 'key-type-choices-only'
          });
        return ['legend', [
          ['span', {
            class: 'mapKey',
            title: (
              type === 'map' &&
              /** @type {import('zodex').SzMap<any, any>} */ (
                specificSchemaObject
              )?.key?.description
            )
              ? '(map key)'
              : type === 'record' &&
              /** @type {import('zodex').SzRecord} */ (
                specificSchemaObject
              )?.key?.description
                ? '(record key)'
                : undefined
          }, [
            type === 'map'
              ? /** @type {import('zodex').SzMap<any, any>} */ (
                specificSchemaObject
              )?.key?.description ?? 'Map key'
              : /** @type {import('zodex').SzRecord} */ (
                specificSchemaObject
              )?.key?.description ?? 'Record key',
            ' '
          ]],
          ['span', {
            dataset: {prop: 'true'},
            className
          }, [String(itemIndex)]],
          ':',
          nbsp.repeat(2),

          ['span', {
            class: 'mapKeyHolder',
            $on: {
              change: [function () {
                /**
                 * @type {HTMLSpanElement & {
                 *   $validateMapKey: ValidateMapKey
                 * }}
                 */
                (this).$validateMapKey();

                // Needed?
                types.validateAllReferences({
                  // eslint-disable-next-line object-shorthand -- TS
                  topRoot: /** @type {HTMLDivElement} */ (topRoot)
                });
              }, true]
            },
            $custom: {
              /** @type {ValidateMapKey} */
              $validateMapKey () {
                const selects = arrayItems.$getMapKeySelects();

                setTimeout(() => {
                  const values = selects.map((select) => {
                    return select.$getValue();
                  });

                  const dupeIndex = values.findLastIndex((value, idx) => {
                    return values.some((val, index) => {
                      return idx !== index && sameValueZero(value, val);
                    });
                  });

                  if (dupeIndex === -1) {
                    return;
                  }
                  const select = selects[dupeIndex];
                  /* istanbul ignore if -- Should exist */
                  if (!select) {
                    return;
                  }

                  const control = select.hidden
                    ? /** @type {HTMLInputElement|HTMLTextAreaElement} */ ($e(
                      /** @type {HTMLDivElement} */ (
                        select.nextElementSibling
                      ), 'input,textarea'
                    ))
                    : select;

                  control.setCustomValidity(
                    `Duplicate ${type === 'map' ? 'Map' : 'Record'} key value`
                  );
                  control.reportValidity();
                });
              }
            }
          }, keyTypeSelection.domArray]
        ]];
      }
      if (editableProperties) {
        // console.log('PROPNAME', propName, schema, specificSchemaObject);
        const description = /** @type {import('zodex').SzObject} */ (
          specificSchemaObject
        )?.properties?.[/** @type {string} */ (propName)]?.description;
        const optionalProperties = Object.entries(
          /** @type {import('zodex').SzObject} */ (
            specificSchemaObject
          )?.properties ?? {}
        ).map(([prop, val]) => {
          if (!val.isOptional) {
            return null;
          }
          return prop;
        }).filter(Boolean);
        optionalPropertyId++;
        const initialValue = sparse
          ? (
            splice === 'append'
              ? ''
              : (propName !== undefined ? propName : itemIndex)
          )
          : propName || '';
        return /** @type {import('jamilih').JamilihArray} */ (['legend', [
          sparse
            ? elementDesc ?? 'Item'
            : {'#': required
              ? [
                ['b', {
                  className,
                  title: (elementDesc ?? description) ? propName : undefined
                }, [
                  elementDesc ?? description ?? propName
                ]]
              ]
              : [
                ['span', {
                  className: `${className}_propertyHolder${optionalPropertyId}`
                }, [
                  ...(specificSchemaObject && propName) // Optional but has name
                    ? [
                      ['b', [
                        /** @type {import('zodex').SzObject} */
                        (specificSchemaObject)?.properties?.[
                          propName
                        ]
                          ? /** @type {import('zodex').SzObject} */ (
                            specificSchemaObject
                          )?.properties?.[
                            propName
                          ]?.description ?? propName
                          : /** @type {import('zodex').SzObject} */ (
                            specificSchemaObject
                          /* istanbul ignore next -- Guard */
                          )?.catchall?.description ?? propName
                      ]]
                    ]
                    : [
                      'Property ',
                      ['span', {className}, [String(itemIndex)]],
                      ':'
                    ]
                ]]
              ]},
          nbsp.repeat(2),
          specificSchemaObject && !required
            ? ['datalist', {
              id: `optionalProperties_${optionalPropertyId}`
            }, optionalProperties.map((optionalProperty) => {
              return ['option', {value: optionalProperty}];
            })]
            : '',
          ['input', {
            list: specificSchemaObject && !required
              ? `optionalProperties_${optionalPropertyId}`
              : undefined,
            style: {
              display: required && type !== 'arrayNonindexKeys'
                ? 'none'
                : 'block'
            },
            disabled: required && type === 'arrayNonindexKeys',
            value: initialValue,
            dataset: {prop: true, object: true, optionalPropertyId},
            /*
            // Works but we do want to let the user input non-integer
            type: sparse ? 'number' : 'text',
            step: sparse ? 1 : null,
            pattern: sparse ? '\\d' : '',
            */
            $custom: {
              /**
               * @type {Validate}
               * @this {HTMLInputElement & {
               *   $validateLength: ValidateLength,
               *   $validateLegend: ValidateLegend
               * }}
               */
              async $validate () {
                try {
                  try {
                    await this.$validateLength();
                  } catch {
                    // Give chance for other validations if cancelled
                  }
                  // Don't give chance to validate positively if failed
                  /* await */ this.$validateLegend();
                  // Todo (low): We could make this more efficient by waiting
                  //   until all added (when pre-populating)
                  types.validateAllReferences({
                    // eslint-disable-next-line object-shorthand -- TS
                    topRoot: /** @type {HTMLDivElement} */ (topRoot)
                  }); // Needed
                } catch {}
              },

              /**
               * @type {ParseInt}
               * @this {HTMLInputElement}
               */
              $parseInt () {
                if (!(/^\d+$/u).test(this.value)) {
                  return false;
                }
                return Number.parseInt(this.value);
              },
              $validateLegend,
              $arrayItems: arrayItems,
              $validateLength,
              /**
               * @type {Resort}
               * @this {HTMLInputElement}
               */
              $resort ({alwaysFocus}) {
                const inputs = /**
                * @type {(HTMLInputElement & {
                *   $parseInt: ParseInt
                * })[]}
                */
                  (/**
                  * @type {HTMLInputElement & {
                  *   $arrayItems: HTMLDivElement & {
                  *     $getPropertyInputs: GetPropertyInputs
                  *   }
                  * }}
                  */ (
                      this
                    ).$arrayItems.$getPropertyInputs());
                if (inputs.length === 1) {
                  return;
                }
                /**
                 * @param {Element} el
                 * @returns {Element}
                 */
                const getFieldset = (el) => /** @type {HTMLFieldSetElement} */ (
                  el.closest('fieldset')
                );
                const thisFieldset = getFieldset(this);
                // eslint-disable-next-line @stylistic/max-len -- Long
                const intVal = /** @type {HTMLInputElement & {$parseInt: ParseInt}} */ (
                  this
                ).$parseInt();
                if (intVal === false) {
                  inputs.reverse().some((input) => {
                    if (input === this) { // No need to search further
                      return true;
                    }
                    const intValOlder =
                      /** @type {HTMLInputElement & {$parseInt: ParseInt}} */ (
                        input
                      ).$parseInt();
                    // Not sorting non-integers
                    if (typeof intValOlder !== 'number') {
                      return false;
                    }
                    getFieldset(input).after(thisFieldset);
                    bringFocus(this, alwaysFocus);
                    arrayItems.$redrawMoveArrows();
                    return true;
                  });
                  return;
                }

                /**
                 * @param {boolean} [latest]
                 * @returns {boolean}
                 */
                const getNearest = (latest) => {
                  /**
                   * @type {HTMLInputElement|undefined}
                   */
                  let nearest;

                  inputs.some((input) => {
                    if (input === this) {
                      return false;
                    }
                    const intValOlder = input.$parseInt();
                    if (typeof intValOlder !== 'number') {
                      if (!nearest) {
                        // May be no other higher ints or
                        //   no other ints at all (but some others)
                        nearest = input;
                      }
                      return false;
                    }

                    /**
                     * @param {Integer} a
                     * @param {Integer} b
                     * @returns {boolean}
                     */
                    const cmp = (a, b) => {
                      return latest ? a > b : a < b;
                    };
                    if (cmp(intVal, intValOlder) &&
                      (!nearest || cmp(
                        intValOlder, Number.parseInt(nearest.value)
                      ))
                    ) {
                      nearest = input;
                      return (intVal + (latest ? -1 : 1)) === intValOlder;
                    }
                    return false;
                  });
                  if (!nearest) {
                    return false;
                  }
                  const method = latest ? 'after' : 'before';
                  // Ensure move *after* splice that will occur after this
                  setTimeout(() => {
                    /* istanbul ignore if */
                    if (!nearest) {
                      return;
                    }
                    getFieldset(nearest)[method](thisFieldset);
                    bringFocus(this, alwaysFocus);
                    arrayItems.$redrawMoveArrows();
                  });
                  return true;
                };
                if (!getNearest()) {
                  getNearest(true);
                }
              }
            },
            $on: {
              /**
               * @this {HTMLInputElement}
               */
              input () {
                if (!specificSchemaObject && !schema) {
                  return;
                }
                const propHolder = /** @type {HTMLElement} */ (
                  $e(arrayItems, `.${className}_propertyHolder${
                    this.dataset.optionalPropertyId
                  }`)
                );
                DOM.removeChildren(propHolder);
                jml('b', [
                  /** @type {import('zodex').SzObject} */
                  (specificSchemaObject)?.properties?.[
                    this.value
                  ]
                    ? /** @type {import('zodex').SzObject} */ (
                      specificSchemaObject
                    )?.properties?.[
                      this.value
                    ]?.description ?? this.value
                    : /** @type {import('zodex').SzObject} */ (
                      specificSchemaObject
                    )?.catchall?.description ?? this.value
                ], propHolder);
              },
              /**
               * @param {Event} e
               * @this {HTMLInputElement & {
               *   $validate: Validate,
               *   $resort: Resort
               * }}
               */
              change (e) {
                const neverProperty = /** @type {import('zodex').SzObject} */ (
                  specificSchemaObject
                )?.properties?.[
                /** @type {string} */ (this.value)
                ]?.type === 'never';

                let invalid = false;
                if (neverProperty) {
                  this.setCustomValidity('Never value');
                  this.reportValidity();
                  this.style.backgroundColor = 'pink';

                  invalid = true;
                } else if (this.list && !parentTypeObject.array) {
                  const dataListValues = [
                    ...this.list.options
                  ].map(({value}) => value);

                  if (
                    !dataListValues.includes(this.value) &&
                    /** @type {import('zodex').SzObject} */ (
                      specificSchemaObject
                    ).unknownKeys === 'strict'
                  ) {
                    this.setCustomValidity('Bad value');
                    this.reportValidity();
                    this.style.backgroundColor = 'pink';
                    invalid = true;
                  } else {
                    this.style.backgroundColor = 'revert-layer';
                    this.setCustomValidity('');
                    this.reportValidity();
                    const {optionalPropertyId} = this.dataset;
                    let placeholder = /** @type {HTMLElement} */ (
                      $e(
                        arrayItems,
                        `.optionalProperties-placeholder${optionalPropertyId}`
                      )
                    );
                    if (!placeholder) {
                      placeholder = /** @type {HTMLElement} */ ($e(
                        /** @type {HTMLElement} */
                        (this.parentElement?.parentElement),
                        `.property-placeholder`
                      )?.previousElementSibling);
                      // Remove extra select element too
                      placeholder.previousElementSibling?.remove();
                    }
                    placeholder.replaceWith(
                      jml('div', {
                        className:
                          `optionalProperties-placeholder${optionalPropertyId}`
                      }, [
                        ...buildTypeChoicesForProperty({
                          propName: this.value,
                          schema:
                          /** @type {import('zodex').SzObject} */
                          (specificSchemaObject)?.properties?.[this.value] ??
                          /** @type {import('zodex').SzObject} */ (
                            specificSchemaObject
                          )?.catchall ??
                          {type: 'any'}
                        })
                      ])
                    );
                  }
                }

                if (invalid) {
                  const placeholder = /** @type {HTMLElement} */ (
                    $e(
                      arrayItems,
                      `.optionalProperties-placeholder${optionalPropertyId}`
                    )
                  );
                  DOM.removeChildren(placeholder);
                } else {
                  // Should this be awaited or awaited after stopPropagation?
                  this.$validate();
                }
                // We don't want form `onchange` to run
                //   `$checkForKeyDuplicates` again
                e.stopPropagation();
                this.$resort({alwaysFocus: true});
              }
            },
            class: `propertyName-${typeNamespace}`
          }]
        ]]);
      }

      const fileDesc = /** @type {import('zodex').SzEffect} */ (
        specificSchemaObject
      )?.inner?.description;

      return /** @type {import('jamilih').JamilihArray} */ (['legend', [
        elementDesc
          ? ''
          : fileDesc
            ? `${fileDesc} `
            : schema?.description
              ? `${schema?.description} `
              : type === 'tuple' && /** @type {import('zodex').SzTuple} */ (
                specificSchemaObject
              )?.rest?.description
                ? `${/** @type {import('zodex').SzTuple} */ (
                  specificSchemaObject
                )?.rest?.description} `
                : 'Item ',
        ['span', {
          dataset: {prop: true, array: true},
          className
        }, [
          elementDesc
            ? `${elementDesc} ${itemIndex + 1}`
            : propName !== undefined
              ? propName
              : String(itemIndex)
        ]]
      ]]);
    };

    /**
     * @param {HTMLDivElement & {
     *   $getPropertyInputs: GetPropertyInputs
     * }} arrayItems
     * @returns {void}
     */
    const decrementItemIndex = (arrayItems) => {
      if (sparse) {
        // eslint-disable-next-line @stylistic/max-len -- Long
        itemIndex = /** @type {(HTMLInputElement & {$parseInt: ParseInt})[]} */ (
          arrayItems.$getPropertyInputs()
        ).reduce(
          (highest, input) => {
            const intVal = input.$parseInt();
            return intVal !== false && intVal > highest ? intVal : highest;
          },
          -1
        );
      } else {
        itemIndex--;
      }
    };

    /**
     * @param {{
     *   propName: string|undefined,
     *   schema?: import('zodex').SzType,
     *   schemaIdx?: number,
     *   autoTrigger?: boolean
     * }} cfg
     */
    const buildTypeChoicesForProperty = ({
      propName, schema, schemaIdx, autoTrigger
    }) => {
      return /** @type {import('../typeChoices.js').BuildTypeChoices} */ (
        buildTypeChoices
      )({
        autoTrigger,
        // resultType,
        // eslint-disable-next-line object-shorthand -- TS
        topRoot: /** @type {HTMLDivElement} */ (topRoot),
        // eslint-disable-next-line object-shorthand -- TS
        format: /** @type {import('../formats.js').AvailableFormat} */ (format),
        schemaOriginal: schemaContent,
        schemaIdx,
        schemaContent: schema || type === 'tuple'
          ? (schema ?? /** @type {import('zodex').SzTuple} */ (
            specificSchemaObject
          ).rest)
          : mapProperties
            // Can also be a `Record`
            ? /** @type {import('zodex').SzMap<any, any>} */ (
              specificSchemaObject
            )?.value
            : type === 'set'
              ? /** @type {import('zodex').SzSet} */ (
                specificSchemaObject
              )?.value
              : type === 'filelist'
                ? /** @type {import('zodex').SzEffect} */ (
                  specificSchemaObject
                )?.inner
                : type === 'array' || type === 'arrayNonindexKeys'
                  ? /** @type {import('zodex').SzArray} */ (
                    specificSchemaObject
                  )?.element
                  : /** @type {import('zodex').SzObject} */ (
                    specificSchemaObject
                  )?.properties?.[/** @type {string} */ (propName)],
        state: parentTypeObject.filelist
          ? 'filelistArray'
          : forcedState ?? type,
        // itemIndex,
        typeNamespace
      }).domArray;
    };

    /**
     * @param {Integer} [offset]
     * @returns {boolean}
     */
    function preventAdding (offset = 0) {
      switch (type) {
      case 'tuple':
        if (/** @type {import('zodex').SzTuple} */ (
          specificSchemaObject
        )?.rest?.type === 'never') {
          dialogs.alert(
            'Tuple has rest type "never", so one cannot add to it.'
          );
          return true;
        }
        if (
          /** @type {import('zodex').SzTuple} */ (
            specificSchemaObject
          )?.items?.[0]?.type === 'never'
        ) {
          dialogs.alert(
            'Tuple has items type "never", so one cannot add to it.'
          );
          return true;
        }
        break;
      case 'set': {
        if (/** @type {import('zodex').SzSet} */ (
          specificSchemaObject
        )?.value?.type === 'never') {
          dialogs.alert('Set has type "never", so one cannot add to it.');
          return true;
        }

        const {maxSize} = /** @type {import('zodex').SzSet} */ (
          specificSchemaObject
        ) ?? {};
        if (maxSize !== undefined &&
          [...arrayItems.children].length + offset > maxSize
        ) {
          dialogs.alert(`You cannot add beyond the \`maxSize\` of the Set`);
          return true;
        }
        break;
      } case 'array': case 'arrayNonindexKeys': {
        if (/** @type {import('zodex').SzArray} */ (
          specificSchemaObject
        )?.element?.type === 'never') {
          dialogs.alert('Array has type "never", so one cannot add to it.');
          return true;
        }

        const {maxLength} = /** @type {import('zodex').SzArray} */ (
          specificSchemaObject
        ) ?? {};

        if (maxLength !== undefined &&
          arrayItems.$getArrayLength() + offset > maxLength
        ) {
          dialogs.alert(`You cannot add beyond the \`maxLength\` of the array`);
          return true;
        }
        break;
      } default:
        break;
      }

      return false;
    }

    /**
     * @callback AddArrayElement
     * @param {{
     *   propName?: string,
     *   splice?: "append"|number,
     *   alwaysFocus?: true
     *   required?: true
     *   autoTrigger?: boolean,
     *   schema?: import('zodex').SzType,
     *   schemaIdx?: number
     * }} cfg
     * @returns {void}
     */

    /**
     * @type {AddArrayElement}
     * @this {HTMLElement & {
     *   $getArrayItems: GetArrayItems,
     *   $addArrayElement: AddArrayElement,
     *   $getMapKeySelects?: GetMapKeySelects
     * }}
     */
    const $addArrayElement = function ({
      propName, splice, alwaysFocus, required, schema, schemaIdx, autoTrigger
    }) {
      const arrayItems = this.$getArrayItems();
      if (sparse) {
        if (propName) {
          const intVal = propName.match(/^\d+$/u) && Number.parseInt(propName);
          if (typeof intVal === 'number') {
            itemIndex = intVal;
          }
        } else if (typeof splice === 'number') {
          itemIndex = splice + 1;
        } else if (typeof splice !== 'string') {
          // eslint-disable-next-line @stylistic/max-len -- Long
          itemIndex = /** @type {(HTMLInputElement & {$parseInt: ParseInt})[]} */ (
            // eslint-disable-next-line @stylistic/max-len -- Long
            /** @type {HTMLDivElement & {$getPropertyInputs: GetPropertyInputs}} */
            (arrayItems).$getPropertyInputs()
          ).reduce(
            (highest, input) => {
              const intVal = input.$parseInt();
              return intVal !== false && intVal > highest ? intVal : highest;
            },
            -1
          ) + 1;
        }
      } else {
        itemIndex++;
      }
      const thisButton = this; // eslint-disable-line consistent-this -- Clarity
      const className = `${type}Item`;
      const fieldset = jml('fieldset',
        {
          dataset: required ? {required: 'required'} : {},
          $on: {
            change: [() => {
              if (type !== 'set') {
                return;
              }
              setTimeout(() => {
                const root = div;
                const values = /** @type {any[]} */ (
                  parentTypeObject.getValue.call({
                    ...parentTypeObject,
                    set: false
                  }, {
                    root,
                    stateObj: {
                      types,
                      // eslint-disable-next-line object-shorthand -- TS
                      formats:
                      /** @type {import('../formats.js').default} */ (
                        formats
                      )
                    }
                  })
                );
                // console.log('values', values);

                const dupeIndex = values.findLastIndex((value, idx) => {
                  return values.some((val, index) => {
                    return idx !== index && value === val;
                  });
                });

                if (dupeIndex === -1) {
                  return;
                }
                const fieldsets = arrayItems.children;
                const controls = [...fieldsets].map((fieldset) => {
                  const root = /** @type {HTMLDivElement} */ (
                    $e(fieldset, 'div[data-type]')
                  );
                  /* istanbul ignore if -- Should err first? */
                  if (!root) {
                    return null;
                  }
                  return types.getFormControlForRoot(root);
                });

                const control = controls[dupeIndex];
                /* istanbul ignore if -- Should exist */
                if (!control) {
                  return;
                }

                control.setCustomValidity(
                  'Duplicate Set value'
                );
                control.reportValidity();
              });
            }, true]
          },
          $custom: {
            /** @type {GetPropertyInput} */
            $getPropertyInput () {
              return /** @type {HTMLInputElement} */ (
                DOM.filterChildElements(
                  /**
                   * @type {HTMLFieldSetElement & {
                   *   $getPropertyInput: GetPropertyInput
                   * }}
                   */ (this),
                  ['legend', `input.propertyName-${typeNamespace}`]
                ).pop()
              );
            }
          }
        },
        [
          buildLegend({
            className,
            splice,
            itemIndex,
            // type,
            typeNamespace,
            arrayItems,
            propName,
            required,
            schema
          })
        ],
        arrayItems);

      // We must ensure fieldset is built before passing it
      jml({'#': [
        ['span', {
          class: 'mapValue',
          title: type === 'map' &&
          /** @type {import('zodex').SzMap<any, any>} */ (
            specificSchemaObject
          )?.value?.description
            ? '(map value)'
            : type === 'record' &&
            /** @type {import('zodex').SzRecord} */ (
              specificSchemaObject
            )?.value?.description
              ? '(record value)'
              : undefined
        }, [
          type === 'map'
            ? /** @type {import('zodex').SzMap<any, any>} */ (
              specificSchemaObject
            )?.value?.description ?? 'Map value'
            : type === 'record'
              ? /** @type {import('zodex').SzRecord} */ (
                specificSchemaObject
              )?.value?.description ?? 'Record value'
              : '',
          ' '
        ]],
        ...(specificSchemaObject && !propName && !parentTypeObject.array
          ? [jml('span', {
            className: `optionalProperties-placeholder${optionalPropertyId}`
          })]
          : buildTypeChoicesForProperty({
            propName, schema, schemaIdx, autoTrigger
          })),
        ['span', {className: 'property-placeholder'}],
        nbsp.repeat(2),
        ['button', {
          disabled: type === 'tuple' && required &&
            // The last item of a tuple can have content after it, but earlier
            //   items cannot
            /** @type {import('zodex').SzTuple} */
            (specificSchemaObject)?.items?.length - 1 > itemIndex,
          $on: {click (/** @type {Event} */ e) {
            e.preventDefault();
            // e.stopPropagation();

            if (preventAdding(1)) {
              return;
            }

            /** @type {number | "append" | undefined} */
            let splice;
            if (sparse) {
              const prevInputVal =
                /**
                 * @type {HTMLInputElement & {
                 *   $parseInt: ParseInt
                 * }}
                 */ (
                  /**
                   * @type {HTMLFieldSetElement & {
                   *   $getPropertyInput: GetPropertyInput
                   * }}
                   */ (
                    fieldset
                  ).$getPropertyInput()).$parseInt();
              splice = prevInputVal === false ? 'append' : prevInputVal;
            }
            thisButton.$addArrayElement({
              splice, alwaysFocus: true, schema
            });
            const newArrayFieldset =
              /** @type {Element & {$getPropertyInput: GetPropertyInput}} */ (
                arrayItems.lastElementChild
              );
            fieldset.after(newArrayFieldset);
            if (sparse || (
              // Because schemas (with descriptions?) don't use className for
              //   property count (and the else block will rewrite the
              //   property name)
              (specificSchemaObject || schema) &&
              !parentTypeObject.array
            )) {
              const newPrevInput = /** @type {HTMLInputElement} */ (
                newArrayFieldset.$getPropertyInput()
              );
              bringFocus(newPrevInput, true);
            } else {
              DOM.filterChildElements(
                arrayItems, [
                  'fieldset', 'legend', '.' + className
                ]
              ).forEach((span, i) => {
                span.textContent = elementDesc
                  ? `${elementDesc} ${i + itemAdjust + 1}`
                  : String(i + itemAdjust);
              });
            }
            // Maybe not needed as addition (without renumbering)
            //   wouldn't yet add type
            types.validateAllReferences({
              // eslint-disable-next-line object-shorthand -- TS
              topRoot: /** @type {HTMLDivElement} */ (topRoot)
            });
            arrayItems.$redrawMoveArrows();
          }}
        }, ['+']],
        /**
         * @type {import('jamilih').JamilihArray}
         */
        ([
          'button',
          {
            disabled: required,
            $on: {
              click (/** @type {Event} */ e) {
                e.preventDefault();
                // e.stopPropagation();
                fieldset.remove();
                decrementItemIndex(arrayItems);
                if (!sparse &&
                  (!specificSchemaObject || parentTypeObject.array)
                ) {
                  DOM.filterChildElements(arrayItems, [
                    'fieldset', 'legend', '.' + className
                  ]).forEach((span, i) => {
                    span.textContent = elementDesc
                      ? `${elementDesc} ${i + itemAdjust + 1}`
                      : String(i + itemAdjust);
                  });
                }
                // Maybe not needed as removal would remove circular
                types.validateAllReferences({
                  // eslint-disable-next-line object-shorthand -- TS
                  topRoot: /** @type {HTMLDivElement} */ (topRoot)
                });

                /**
                 * @type {HTMLDivElement & {
                 *   $redrawMoveArrows: RedrawMoveArrows
                 * }}
                 */
                (arrayItems).$redrawMoveArrows();
              }
            }
          }, ['x']
        ]),
        ['span', {
          class: `${type}Item-arrowHolder-${typeNamespace}`
        }, []]
      ]}, fieldset);

      // Need to validate if adding more than one property (in
      //   case two have empty string)
      if (editableProperties) {
        const pns = arrayItems.$getPropertyInputs();
        /* istanbul ignore else -- Just a guard */
        if (pns.length) {
          const input =
            /**
             * @type {HTMLInputElement & {
             *   $validate: Validate,
             *   $resort: Resort
             * }}
             */
            (pns.pop());
          input.$validate();
          input.$resort({alwaysFocus});
          bringFocus(input, alwaysFocus);
        }
      }
      arrayItems.$redrawMoveArrows();
    };

    /**
     * @callback GetArrayLength
     * @returns {number}
     */

    /**
     * @type {GetArrayLength}
     * @this {HTMLDivElement}
     */
    const $getArrayLength = function () {
      return Number(/** @type {HTMLInputElement} */ (
        $e(/** @type {HTMLElement} */ (this.previousElementSibling), 'input')
      ).value);
    };

    /**
     * @type {InputsExceedingLength}
     * @this {HTMLDivElement & {
     *   $getArrayLength: GetArrayLength,
     *   $getPropertyInputs: GetPropertyInputs
     * }}
     */
    const $inputsExceedingLength = function () {
      const highestExpectedIndex = this.$getArrayLength() - 1;
      return this.$getPropertyInputs().filter(
        (input) => input.value.match(/^\d+$/u)
      ).filter((input) => {
        // We cycle through all elements to set the proper validity on them
        const val = Number.parseInt(input.value);
        const exceedsLength = val > highestExpectedIndex;
        input.setCustomValidity(
          exceedsLength
            ? 'Invalid length'
            : ''
        );
        input.reportValidity(); // Is this having an effect now?
        return exceedsLength;
      });
    };
    const addArrayElement = /** @type {import('jamilih').JamilihArray} */ (
      ['button', {
        class: 'addArrayElement',
        // is: 'add-array-element',
        $custom: {
          $addArrayElement,
          /**
           * @type {GetArrayItems}
           * @this {HTMLDivElement}
           */
          $getArrayItems () {
            const prevSibling = /**
             * @type {HTMLDivElement & {
             *   $inputsExceedingLength: InputsExceedingLength,
             *   $getPropertyInputs: GetPropertyInputs,
             *   $redrawMoveArrows: RedrawMoveArrows,
             *   $getMapKeySelects: GetMapKeySelects
             * }}
             */ (this.previousElementSibling);
            return prevSibling;
          }
        },
        $on: {click () {
          if (preventAdding(1)) {
            return;
          }

          // Todo: Should really check if all object properties have been used,
          //        and stop and warn if so
          /**
           * @type {HTMLButtonElement & {
           *   $addArrayElement: AddArrayElement,
           *   $getArrayItems: GetArrayItems
           * }}
           */
          (this).$addArrayElement({alwaysFocus: true});
          // Maybe not needed as addition (without renumbering)
          //   wouldn't yet add type
          types.validateAllReferences({
            // eslint-disable-next-line object-shorthand -- TS
            topRoot: /** @type {HTMLDivElement} */ (topRoot)
          });
        }}
      }, ['+ Item']]
    );

    const arrayContentsFirstChild = sparse
      ? ['div', [
        ['label', [
          'Array length: ',
          ['input', {
            type: 'number',
            value: (objectValue && objectValue.length) || 0,
            step: 1,
            size: 4,
            class: 'arrayLength',
            pattern: String.raw`\d`,
            $on: {
              /**
               * @this {HTMLInputElement & {
               *   $oldvalue: string
               * }}
               * @returns {Promise<void>}
               */
              async change () {
                if (preventAdding()) {
                  this.value = this.$oldvalue ?? this.defaultValue;
                  return;
                }

                const arrayItems = $e(
                  /** @type {HTMLElement} */ (
                    this.closest('.arrayContents')
                  ),
                  '.arrayItems'
                );
                const propInputsBeyondLength =
                  /**
                   * @type {HTMLElement & {
                   *   $inputsExceedingLength: InputsExceedingLength
                   * }}
                   */
                  (arrayItems).$inputsExceedingLength();
                try {
                  if (propInputsBeyondLength.length) {
                    await dialogs.confirm({
                      message: 'Your new length will truncate the ' +
                        'array causing items to be removed. Continue?'
                    });
                    propInputsBeyondLength.forEach((input) => {
                      const fieldset = /** @type {HTMLFieldSetElement} */ (
                        input.closest('fieldset')
                      );
                      if (!fieldset.matches('[data-required]')) {
                        fieldset.remove();
                      } else {
                        // If not truncating the array, put the length back
                        const arrayLengthInput =
                          /**
                           * @type {HTMLInputElement & {
                           *   $oldvalue: string
                           * }}
                           */ (
                            $e(div, '.arrayLength')
                          );
                        arrayLengthInput.value = String(Number.parseInt(
                          arrayLengthInput.value
                        ) + 1);
                      }
                    });
                    // Maybe not needed as removal would remove circular
                    types.validateAllReferences({
                      // eslint-disable-next-line object-shorthand -- TS
                      topRoot: /** @type {HTMLDivElement} */ (topRoot)
                    });
                  } else {
                    const element = /** @type {import('zodex').SzArray} */ (
                      specificSchemaObject
                    )?.element;
                    if (!['void', 'undefined'].includes(
                      element?.type
                    ) && (
                      element?.type !== 'union' ||
                      /** @type {import('zodex').SzUnion} */
                      (element)?.options?.every((option) => {
                        return !['void', 'undefined'].includes(option.type);
                      })
                    )) {
                      const diff = Number.parseInt(this.value) -
                        Number.parseInt(this.$oldvalue ?? this.defaultValue);
                      for (let i = 0; i < diff; i++) {
                        // Timeout needed by Cypress at least or will get
                        //   validation triggered which prevents moving forward
                        setTimeout(() => {
                          div.$addArrayElement({});
                        });
                      }
                    }
                  }
                  this.$oldvalue = this.value;
                } catch {
                  this.value = this.$oldvalue; // Revert
                }
              }
            }
          }]
        ]]
      ]]
      : '';

    const arrayItems =
      /** @type {HTMLDivElement & {$getArrayLength: GetArrayLength}} */ (
        jml('div', {
          class: 'arrayItems',
          $custom: {
            $swapGroup, $redrawMoveArrows, $getArrayLength,
            $inputsExceedingLength,

            /**
             * Only relevant for maps.
             * @type {GetMapKeySelects}
             * @this {HTMLDivElement}
             */
            $getMapKeySelects () {
              const selects =
                /**
                 * @type {(HTMLSelectElement & {
                 *   $getValue: import('../typeChoices.js').GetValue}
                 * )[]}
                 */ (DOM.filterChildElements(
                  this,
                  [
                    'fieldset',
                    'legend:first-child',
                    'span.mapKeyHolder',
                    'select.typeChoices-key-type-choices-only'
                  ]
                ));
              return selects;
            },

            /**
             * @type {GetPropertyInputs}
             * @this {HTMLDivElement}
             */
            $getPropertyInputs () {
              return /** @type {HTMLInputElement[]} */ (DOM.filterChildElements(
                this,
                ['fieldset', 'legend', `input.propertyName-${typeNamespace}`]
              ));
            }
          }
        })
      );

    const minusButton = ['button', {$on: {click (/** @type {Event} */ e) {
      e.preventDefault();
      const {target} = e;
      const arrayContents = /** @type {HTMLDivElement} */ (
        $e(div, '.arrayContents')
      );
      arrayContents.hidden = !arrayContents.hidden;
      /** @type {Element} */ (
        target
      ).textContent = arrayContents.hidden ? '+' : '-';
    }}}, ['-']];

    const arrayContents = /** @type {import('jamilih').JamilihArray} */ (
      ['div', {class: 'arrayContents'}, [
        arrayContentsFirstChild,
        arrayItems,
        addArrayElement,
        ['button', {$on: {click () {
          const arrayContents = /** @type {HTMLElement} */ (
            this.closest('.arrayContents')
          );
          const arrayItems =
            // eslint-disable-next-line @stylistic/max-len -- Long
            /** @type {HTMLDivElement & {$getPropertyInputs: GetPropertyInputs;}} */ (
              $e(/** @type {HTMLElement} */ (arrayContents), '.arrayItems')
            );
          const lastElement = arrayItems.lastElementChild;
          if (lastElement && !lastElement.matches('[data-required]')) {
            lastElement.remove();
            decrementItemIndex(arrayItems);
            // eslint-disable-next-line @stylistic/max-len -- Long
            /** @type {HTMLDivElement & {$redrawMoveArrows: RedrawMoveArrows}} */ (
              $e(/** @type {HTMLElement} */ (arrayContents), '.arrayItems')
            ).$redrawMoveArrows();
          }
          // Maybe not needed as removal would remove circular
          types.validateAllReferences({
            // eslint-disable-next-line object-shorthand -- TS
            topRoot: /** @type {HTMLDivElement} */ (topRoot)
          });
        }}}, ['- Last item']],
        // We could only add this when there was more than one
        ['button', {$on: {click () {
          const arrayContents = /** @type {HTMLElement} */ (
            /** @type {HTMLElement} */ (this).closest('.arrayContents')
          );
          const arrayItems =
            // eslint-disable-next-line @stylistic/max-len -- Long
            /** @type {HTMLDivElement & {$getPropertyInputs: GetPropertyInputs}} */ ($e(
              arrayContents,
              '.arrayItems'
            ));

          const optionalFieldsetItems = $$e(
            arrayContents,
            '.arrayItems > fieldset:not([data-required])'
          );

          for (const optionalFieldsetItem of optionalFieldsetItems) {
            optionalFieldsetItem.remove();
          }

          if (sparse) {
            decrementItemIndex(arrayItems);
          } else {
            itemIndex = -1;
          }
          // Maybe not needed as removal would remove circular
          types.validateAllReferences({
            // eslint-disable-next-line object-shorthand -- TS
            topRoot: /** @type {HTMLDivElement} */ (topRoot)
          });
        }}}, ['x All']]
      ]]
    );

    const parentType = type;

    const div =
      /**
       * @type {HTMLDivElement & {
       *   $addAndSetArrayElement:
       *     import('../formats/structuredCloning.js').AddAndSetArrayElement,
       *   $addArrayElement: AddArrayElement
       *   $getArrayItems: GetArrayItems,
       *   $getMapKeySelects?: GetMapKeySelects
       * }}
       */ (
        jml('div', /** @type {import('jamilih').JamilihAttributes} */ ({
          dataset: {type},
          // is: 'array-or-object-editor',
          $custom: {
            // eslint-disable-next-line @stylistic/max-len -- Long
            /** @type {import('../formats/structuredCloning.js').AddAndSetArrayElement} */
            $addAndSetArrayElement ({
              propName, type, value, bringIntoFocus, setAValue,
              schemaContent: schema, schemaIdx, mustBeOptional
            }) {
              if (parentType === 'map') {
                if (propName === '0') {
                  this.$addArrayElement({
                    propName,
                    // At least needed when value supplied
                    autoTrigger: false
                  });
                  const arrayItems = this.$getArrayItems();
                  const keyTypeChoices = /**
                  * @type {HTMLSelectElement & {
                  *   $setType: import('../typeChoices.js').SetType,
                  *   $getTypeRoot: import('../formatAndTypeChoices.js').
                  *     TypeRootGetter
                  * }}
                  */ (DOM.filterChildElements(
                      arrayItems,
                      [
                        'fieldset:last-of-type', 'legend',
                        '.mapKeyHolder', 'select'
                      ]
                    )[0]);
                  keyTypeChoices.$setType({
                    type, baseValue: value, bringIntoFocus,
                    avoidReport: true
                  });

                  // The key may itself be a map, etc.
                  return keyTypeChoices.$getTypeRoot();
                }
              } else if (parentType === 'record') {
                this.$addArrayElement({
                  propName, autoTrigger: false,
                  required: false
                });
              } else {
                // console.log('SCHEMA123', schema);
                this.$addArrayElement({
                  propName, schema, autoTrigger: false,
                  schemaIdx,
                  required: !mustBeOptional && schema && !schema.isOptional &&
                    schema.type !== 'never'
                });
              }
              const typeChoices = this.$getTypeChoices();
              typeChoices.$setType({
                type, baseValue: value, bringIntoFocus,
                specificSchema:
                  schema?.type === 'union' && schemaIdx !== undefined
                    ? schema.options[schemaIdx]
                    : schema,
                avoidReport: true
              });
              const root = typeChoices.$getTypeRoot();
              // If run for all, causes problems with running `Error.cause`
              //   type twice and is inefficient;
              //   currently put behind `setAValue` as we need to set a value
              //   from `errorsSpecialType` (and `filelistType`)
              if (setAValue) {
                const typeObj =
                  /** @type {import('../types.js').TypeObject} */ (
                    types.getTypeObject(type)
                  );
                if (typeObj.setValue) {
                  typeObj.setValue({root, value});
                }
              }
              types.validate({
                type, root, topRoot,
                // We don't want focus when values auto-added
                avoidReport: true
              });
              return root;
            },

            /**
             * @typedef {() => Element} GetAddArrayElement
             */

            /** @type {GetAddArrayElement} */
            $getAddArrayElement () {
              const el = this.
                lastElementChild.firstElementChild.nextElementSibling;
              return sparse ? el.nextElementSibling : el;
            },
            /**
             * @type {AddArrayElement}
             * @this {HTMLDivElement & {
             *   $getAddArrayElement: GetAddArrayElement
             * }}
             */
            // @ts-expect-error TS is apparently getting wrong $addArrayElement
            $addArrayElement ({
              propName, splice, alwaysFocus, required, schema, schemaIdx,
              autoTrigger
            }) {
              const addArrayElement = this.$getAddArrayElement();
              /**
               * @type {HTMLButtonElement & {
               *   $addArrayElement: AddArrayElement,
               *   $getArrayItems: GetArrayItems
               * }}
               */
              (addArrayElement).$addArrayElement({
                propName, splice, alwaysFocus, required, schema,
                schemaIdx,
                autoTrigger
              });
            },
            $getArrayItems () {
              const addArrayElement = this.$getAddArrayElement();
              return addArrayElement.previousElementSibling;
            },
            $getTypeChoices () {
              const arrayItems = this.$getArrayItems();
              return $e(
                arrayItems.lastElementChild,
                `fieldset > .typeChoices-${typeNamespace}` // Avoid keys
              );
            }
          },
          $on: {
            click (ev) {
              const e = /** @type {Event} */ (ev);
              // eslint-disable-next-line prefer-destructuring -- TS
              const target = /** @type {HTMLInputElement} */ (e.target);

              // We needed to stop preventing the default for the
              //    invalid date checkbox; is this sufficient to prevent
              //    other stray clicks apparently meant for the array
              //    and object reference checking?
              if (![
                'checkbox', 'radio', 'file',
                'datetime-local',
                // For label radio clicks
                undefined
              ].includes(target.type)) {
                e.preventDefault();
              }
            }
          }
        }), /** @type {import('jamilih').JamilihChildren} */ ([
          [specificSchemaObject ? 'span' : 'b', {
            title: specificSchemaObject?.description ?? (DOM.initialCaps(
              /** @type {import('../types.js').AvailableType} */
              (type)
            ).replace(/s$/u, ''))
          }, [
            specificSchemaObject
              ? '—'
              : DOM.initialCaps(
                /** @type {import('../types.js').AvailableType} */
                (type)
              ).replace(/s$/u, '')
          ]],
          nbsp.repeat(2),
          type === 'filelist'
            ? ['input', {
              name: typeNamespace + '-filelist',
              multiple: true,
              type: 'file',
              $on: {
                /**
                 * @this {HTMLInputElement}
                 */
                change () {
                  /* istanbul ignore if */
                  if (!this.files) {
                    return;
                  }
                  for (let i = 0; i < this.files.length; i++) {
                    const file = this.files.item(i);

                    div.$addAndSetArrayElement({
                      propName: String(i),
                      type: 'file',
                      value: file,
                      bringIntoFocus: false,
                      setAValue: true
                    });
                  }
                }
              }
            }]
            : '',
          minusButton,
          arrayContents
        ]))
      );
    topRoot = topRoot || div;

    if (!objectValue && specificSchemaObject) {
      switch (type) {
      case 'object': {
        // See comment referencing `arrayType.js` in `typeChoices.js`
        if (!schemaFallingBack) {
          for (const [prop, val] of
            Object.entries(
              /** @type {import('zodex').SzObject} */ (
                specificSchemaObject
              ).properties ?? {}
            )
          ) {
            if (!val.isOptional && val.type !== 'never') {
              div.$addArrayElement({propName: prop, required: true});
            }
          }
        }
        break;
      }
      case 'tuple': {
        // See comment referencing `arrayType.js` in `typeChoices.js`
        if (!schemaFallingBack) {
          const specificSchemaObj = /** @type {import('zodex').SzTuple} */ (
            specificSchemaObject
          );
          if (
            /** @type {import('zodex').SzTuple} */ (
              specificSchemaObject
            )?.items?.[0]?.type !== 'never'
          ) {
            for (const schema of specificSchemaObj.items) {
              div.$addArrayElement({schema, required: true});
            }
          }
        }
        break;
      } case 'array': case 'arrayNonindexKeys': {
        const {minLength = 0} = /** @type {import('zodex').SzArray} */ (
          specificSchemaObject
        ) ?? {};
        const arrayLengthInput =
          /** @type {HTMLInputElement & {$oldvalue: string}} */ (
            $e(div, '.arrayLength')
          );
        arrayLengthInput.value = String(minLength);
        arrayLengthInput.$oldvalue = String(minLength);

        for (let i = 0; i < minLength; i++) {
          div.$addArrayElement({required: true});
        }
        break;
      } case 'set': {
        // See comment referencing `arrayType.js` in `typeChoices.js`
        if (!schemaFallingBack) {
          const {minSize = 0} = /** @type {import('zodex').SzSet} */ (
            specificSchemaObject
          ) ?? {};
          for (let i = 0; i < minSize; i++) {
            div.$addArrayElement({required: true});
          }
        }
        break;
      } default:
        break;
      }
    }

    return [div];
  }
};

export default arrayType;

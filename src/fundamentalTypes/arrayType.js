import {jml, nbsp} from '../vendor-imports.js';

import Types, {getPropertyValueFromLegend} from '../types.js';
import {$e, U, DOM} from '../utils/templateUtils.js';
import dialogs from '../utils/dialogs.js';
import {
  resolveJSONPointer, getJSONPointerParts, reduceJSONPointerParts
} from '../utils/jsonPointer.js';

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
  toValue (s, info) {
    const {
      /* istanbul ignore next -- Just a guard */
      endMatchTypeObjs = [],
      remnant: innerContents,
      rootHolder
    } = /** @type {import('../types.js').RootInfo} */ (info);
    // eslint-disable-next-line prefer-destructuring -- TS
    const format = /** @type {import('../types.js').RootInfo} */ (info).format;

    const {sparse} = this;
    const state = sparse
      ? 'arrayNonindexKeys'
    // ? 'sparseArrays'
      : (this.array ? 'array' : 'object');
    /** @type {{[key: (string|number)]: any}} */
    const retObj = this.array ? [] : {};
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
    if (this.array) {
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
          [v, stringVal, beginOnly, assign] = Types.getValueForString(
            stringVal,
            {
              firstRun: false,
              format,
              state,
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
        [v, stringVal, beginOnly, assign] = Types.getValueForString(
          stringVal,
          {
            firstRun: false, format, state,
            endMatchTypeObjs, rootHolder, parent: retObj, parentPath: pr
          }
        );
      } catch (err) {
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
  getValue ({root, stateObj = {}, currentPath = ''}) {
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
      const value = Types.getValueForRoot(
        root, stateObj, currentPath + '/' + currentPathPart
      );
      if (stateObj.handlingReference) {
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
    return this.set && Array.isArray(ret)
      ? new Set(ret)
      : this.map
        ? new Map(arrayItems.$getMapKeySelects().map((select, idx) => {
          const key = select.$getValue();
          return [key, /** @type {any[]} */ (ret)[idx]];
        }))
        : ret;
  },

  // Try to keep in sync with basic structure of `editUI`
  viewUI ({typeNamespace, type, value, topRoot, resultType, format}) {
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
      return ['legend', [
        this.array
          ? 'Item'
          : 'Property',
        ':',
        nbsp.repeat(2),
        ['span', {
          class: `propertyName-${typeNamespace}`
        }, [
          propName !== undefined
            ? propName
            // eslint-disable-next-line @stylistic/max-len -- Long
            /* istanbul ignore next -- Won't reach here as typeson will always give keypath? */
            : itemIndex
        ]]
      ]];
    };
    const div = /** @type {HTMLDivElement} */ (
      jml('div', /** @type {import('jamilih').JamilihAttributes} */ ({
        class: 'arrayHolder',
        dataset: {type},
        $custom: {
          /**
           * @param {{
           *   propName: string,
           *   type: import('../types.js').AvailableType,
           *   value: import('../formats.js').StructuredCloneValue,
           *   bringIntoFocus: boolean,
           *   schemaContent: object,
           *   schemaState:
           *     import('../types.js').GetPossibleSchemasForPathAndType
           * }} cfg
           * @returns {Element}
           */
          $addAndSetArrayElement ({
            propName, type, value, bringIntoFocus,
            schemaContent, schemaState
          }) {
            if (parentType === 'map') {
              const root = Types.getUIForModeAndType({
                resultType,
                readonly: true,
                typeNamespace, type, topRoot,
                bringIntoFocus,
                format, schemaContent, schemaState,
                value,
                hasValue: true // type === 'sparseArrays' && value
              });
              if (propName === '0') {
                const fieldset = this.$addMapElement();
                this._lastFieldset = fieldset;
                const keyFieldset = /** @type {HTMLFieldSetElement} */ (jml(
                  'fieldset', [
                    ['legend', ['Key']]
                  ], fieldset
                ));
                jml(root, keyFieldset);
              } else { // propName === '1'
                const valueFieldset = /** @type {HTMLFieldSetElement} */ (jml(
                  'fieldset', [
                    ['legend', ['Value']]
                  ], this._lastFieldset
                ));
                this._lastFieldset = null;
                jml(root, valueFieldset);
              }
              return root;
            }

            const fieldset = this.$addArrayElement({propName});
            const root = Types.getUIForModeAndType({
              resultType,
              readonly: true,
              typeNamespace, type, topRoot,
              bringIntoFocus,
              format, schemaContent, schemaState,
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
            const fieldset = /** @type {HTMLFieldSetElement} */ (
              jml('fieldset', [
                buildLegend({
                  // className,
                  // type,
                  // arrayItems,
                  itemIndex,
                  typeNamespace,
                  propName: undefined
                })
              ], arrayItems)
            );
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
            const fieldset = /** @type {HTMLFieldSetElement} */ (
              jml('fieldset', [
                buildLegend({
                  // className,
                  // type,
                  // arrayItems,
                  itemIndex,
                  typeNamespace,
                  propName
                })
              ], arrayItems)
            );
            return fieldset;
          },
          $getArrayItems () {
            return this.lastElementChild.lastElementChild;
          }
        }
      }), [
        DOM.initialCaps(/** @type {import('../types.js').AvailableType} */ (
          type
        )).replace(/s$/u, ''), nbsp.repeat(2),
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
          this.array
            ? ['div', [
              type === 'set'
                ? 'Set size: '
                : type === 'map'
                  ? 'Map size: '
                  : 'Array length: ',
              ['span', [
                (value && (type === 'set' || type === 'map')
                  ? value.size
                  : value.length) || 0
              ]]
            ]]
            : '',
          ['div', {
            class: 'arrayItems'
          }]
        ]]
      ])
    );
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
    type, topRoot, value, bringIntoFocus = true
  }) {
    const {sparse} = this;
    // eslint-disable-next-line consistent-this
    const parentTypeObject = this;
    const itemAdjust = type === 'object' ? 1 : 0;
    let itemIndex = itemAdjust - 1;
    const editableProperties = type !== 'array' &&
      type !== 'set' && type !== 'map';
    const mapProperties = type === 'map';

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
      if (!sparse) {
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
      Types.validateAllReferences({
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
          // input.reportValidity(); // Might not want this as changes focus
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
     *   propName: string|undefined
     * }} cfg
     * @returns {import('jamilih').JamilihArray}
     */
    const buildLegend = ({
      className, splice, itemIndex, /* type, */ typeNamespace,
      arrayItems, propName
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
          return undefined;
        }
        const inputsExceedingLength = arrayItems.$inputsExceedingLength();
        const exceedsLength = inputsExceedingLength.length;
        if (avoidDialog || !exceedsLength || !(/^\d+$/u).test(this.value)) {
          return undefined;
        }
        await dialogs.confirm({
          message: 'You are attempting to add an (integer-based) ' +
            'array item beyond the length. Click "Ok" to allow to ' +
            'permit and extend the array length or "Cancel" otherwise.'
        });
        const arrLengthInput = /** @type {HTMLInputElement} */ (
          $e(
            /** @type {HTMLElement} */ (arrayItems.previousElementSibling),
            'input'
          )
        );
        const highest = /** @type {number} */ (inputsExceedingLength.map(
          (i) => Number.parseInt(i.value)
        ).sort().at(-1));
        arrLengthInput.value = String(highest + 1);
        return this.$validateLength(true);
      };
      if (mapProperties) {
        const keyTypeSelection =
          /** @type {import('../typeChoices.js').BuildTypeChoices} */ (
            buildTypeChoices
          )({
            format: 'structuredCloning',
            typeNamespace: 'key-type-choices-only'
          });
        return ['legend', [
          'Key ',
          ['span', {
            dataset: {prop: 'true'},
            className
          }, [String(itemIndex)]],
          ':',
          nbsp.repeat(2),

          ['span', {
            class: 'mapKey',
            $on: {
              change: [function () {
                /**
                 * @type {HTMLSpanElement & {
                 *   $validateMapKey: ValidateMapKey
                 * }}
                 */
                (this).$validateMapKey();

                // Needed?
                Types.validateAllReferences({
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

                  console.log('values1111', values);

                  const dupeIndex = values.findLastIndex((value, idx) => {
                    return values.some((val, index) => {
                      return idx !== index && sameValueZero(value, val);
                    });
                  });

                  console.log('dupeIndex', dupeIndex);

                  if (dupeIndex === -1) {
                    return;
                  }
                  const select = selects[dupeIndex];
                  /* istanbul ignore if -- Should exist */
                  if (!select) {
                    return;
                  }

                  select.setCustomValidity(
                    'Duplicate Map key value'
                  );
                  select.reportValidity();
                });
              }
            }
          }, keyTypeSelection.domArray]
        ]];
      }
      if (editableProperties) {
        return /** @type {import('jamilih').JamilihArray} */ (['legend', [
          sparse
            ? 'Item'
            : {'#': [
              'Property ',
              ['span', {className}, [String(itemIndex)]],
              ':'
            ]},
          nbsp.repeat(2),
          ['input', {
            value: sparse
              ? (
                splice === 'append'
                  ? ''
                  : (propName !== undefined ? propName : itemIndex)
              )
              : propName || '',
            dataset: {prop: true, object: true},
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
                  } catch (err) {
                    // Give chance for other validations if cancelled
                  }
                  // Don't give chance to validate positively if failed
                  /* await */ this.$validateLegend();
                  // Todo (low): We could make this more efficient by waiting
                  //   until all added (when pre-populating)
                  Types.validateAllReferences({
                    // eslint-disable-next-line object-shorthand -- TS
                    topRoot: /** @type {HTMLDivElement} */ (topRoot)
                  }); // Needed
                } catch (err) {}
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
               * @param {Event} e
               * @this {HTMLInputElement & {
               *   $validate: Validate,
               *   $resort: Resort
               * }}
               */
              change (e) {
                this.$validate();
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
      return /** @type {import('jamilih').JamilihArray} */ (['legend', [
        'Item ',
        ['span', {
          dataset: {prop: true, array: true},
          className
        }, [
          propName !== undefined ? propName : String(itemIndex)
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
     * @callback AddArrayElement
     * @param {{
     *   propName?: string,
     *   splice?: "append"|number,
     *   alwaysFocus?: true
     * }} cfg
     * @returns {void}
     */

    /**
     * @type {AddArrayElement}
     * @this {HTMLButtonElement & {
     *   $getArrayItems: GetArrayItems,
     *   $addArrayElement: AddArrayElement,
     *   $getMapKeySelects?: GetMapKeySelects
     * }}
     */
    const $addArrayElement = function ({propName, splice, alwaysFocus}) {
      // console.log('propName', propName);
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
      const thisButton = this; // eslint-disable-line consistent-this
      const className = `${type}Item`;
      const fieldset =
        /** @type {HTMLFieldSetElement} */ (
          jml('fieldset',
            {
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
                      }, {root})
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
                      return Types.getFormControlForRoot(root);
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
                      /** @type {HTMLFieldSetElement} */ (this),
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
                propName
              })
            ],
            arrayItems)
        );
      // We must ensure fieldset is built before passing it
      jml({'#': [
        ...(/** @type {import('../typeChoices.js').BuildTypeChoices} */ (
          buildTypeChoices
        )({
          // resultType,
          // eslint-disable-next-line object-shorthand -- TS
          topRoot: /** @type {HTMLDivElement} */ (topRoot),
          // eslint-disable-next-line object-shorthand, @stylistic/max-len -- TS
          format: /** @type {import('../formats.js').AvailableFormat} */ (format),
          state: type,
          // itemIndex,
          typeNamespace
        }).domArray),
        nbsp.repeat(2),
        ['button', {$on: {click (/** @type {Event} */ e) {
          e.preventDefault();
          // e.stopPropagation();
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
            splice, alwaysFocus: true
          });
          const newArrayFieldset =
            /** @type {Element & {$getPropertyInput: GetPropertyInput}} */ (
              arrayItems.lastElementChild
            );
          fieldset.after(newArrayFieldset);
          if (sparse) {
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
              span.textContent = String(i + itemAdjust);
            });
          }
          // Maybe not needed as addition (without renumbering)
          //   wouldn't yet add type
          Types.validateAllReferences({
            // eslint-disable-next-line object-shorthand -- TS
            topRoot: /** @type {HTMLDivElement} */ (topRoot)
          });
          arrayItems.$redrawMoveArrows();
        }}}, ['+']],
        /**
         * @type {import('jamilih').JamilihArray}
         */
        ([
          'button',
          {
            $on: {
              click (/** @type {Event} */ e) {
                e.preventDefault();
                // e.stopPropagation();
                fieldset.remove();
                decrementItemIndex(arrayItems);
                if (!sparse) {
                  DOM.filterChildElements(arrayItems, [
                    'fieldset', 'legend', '.' + className
                  ]).forEach((span, i) => {
                    span.textContent = String(i + itemAdjust);
                  });
                }
                // Maybe not needed as removal would remove circular
                Types.validateAllReferences({
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
            return (/**
               * @type {HTMLDivElement & {
               *   $inputsExceedingLength: InputsExceedingLength,
               *   $getPropertyInputs: GetPropertyInputs,
               *   $redrawMoveArrows: RedrawMoveArrows,
               *   $getMapKeySelects: GetMapKeySelects
               * }}
               */
              (this.previousElementSibling)
            );
          }
        },
        $on: {click () {
          /**
           * @type {HTMLButtonElement & {
           *   $addArrayElement: AddArrayElement,
           *   $getArrayItems: GetArrayItems
           * }}
           */
          (this).$addArrayElement({alwaysFocus: true});
          // Maybe not needed as addition (without renumbering)
          //   wouldn't yet add type
          Types.validateAllReferences({
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
            value: (value && value.length) || 0,
            step: 1,
            size: 4,
            pattern: '\\d',
            $on: {
              /**
               * @this {HTMLInputElement & {
               *   $oldvalue: string
               * }}
               * @returns {Promise<void>}
               */
              async change () {
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
                      fieldset.remove();
                    });
                    // Maybe not needed as removal would remove circular
                    Types.validateAllReferences({
                      // eslint-disable-next-line object-shorthand -- TS
                      topRoot: /** @type {HTMLDivElement} */ (topRoot)
                    });
                  }
                  this.$oldvalue = this.value;
                } catch (err) {
                  this.value = this.$oldvalue; // Revert
                }
              }
            }
          }]
        ]]
      ]]
      : '';

    const arrayItems = ['div', {
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
                'span.mapKey',
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
    }];

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
          if (lastElement) {
            lastElement.remove();
            decrementItemIndex(arrayItems);
            // eslint-disable-next-line @stylistic/max-len -- Long
            /** @type {HTMLDivElement & {$redrawMoveArrows: RedrawMoveArrows}} */ (
              $e(/** @type {HTMLElement} */ (arrayContents), '.arrayItems')
            ).$redrawMoveArrows();
          }
          // Maybe not needed as removal would remove circular
          Types.validateAllReferences({
            // eslint-disable-next-line object-shorthand -- TS
            topRoot: /** @type {HTMLDivElement} */ (topRoot)
          });
        }}}, ['- Last item']],
        // We could only add this when there was more than one
        ['button', {$on: {click () {
          const arrayItems =
            // eslint-disable-next-line @stylistic/max-len -- Long
            /** @type {HTMLDivElement & {$getPropertyInputs: GetPropertyInputs}} */ ($e(
              /** @type {HTMLElement} */ (
                /** @type {HTMLElement} */ (this).closest('.arrayContents')
              ),
              '.arrayItems'
            ));
          DOM.removeChildren(arrayItems);
          if (sparse) {
            decrementItemIndex(arrayItems);
          } else {
            itemIndex = -1;
          }
          // Maybe not needed as removal would remove circular
          Types.validateAllReferences({
            // eslint-disable-next-line object-shorthand -- TS
            topRoot: /** @type {HTMLDivElement} */ (topRoot)
          });
        }}}, ['x All']]
      ]]
    );

    const parentType = type;

    const div = /** @type {HTMLDivElement} */ (
      jml('div', /** @type {import('jamilih').JamilihAttributes} */ ({
        dataset: {type},
        // is: 'array-or-object-editor',
        $custom: {
          // eslint-disable-next-line @stylistic/max-len -- Long
          /** @type {import('../formats/structuredCloning.js').AddAndSetArrayElement} */
          $addAndSetArrayElement ({
            propName, type, value, bringIntoFocus
            // , schemaContent, schemaState
          }) {
            if (parentType === 'map') {
              if (propName === '0') {
                this.$addArrayElement({propName});
                const arrayItems = this.$getArrayItems();
                const keyTypeChoices = /**
                 * @type {HTMLSelectElement & {
                 *   $setType: import('../typeChoices.js').SetType,
                 *   $getTypeRoot: import('../formatAndTypeChoices.js').
                 *     TypeRootGetter
                 * }}
                */ (DOM.filterChildElements(
                    arrayItems,
                    ['fieldset:last-of-type', 'legend', '.mapKey', 'select']
                  )[0]);
                keyTypeChoices.$setType({
                  type, baseValue: value, bringIntoFocus
                });

                // The key may itself be a map, etc.
                return keyTypeChoices.$getTypeRoot();
              }
            } else {
              this.$addArrayElement({propName});
            }
            const typeChoices = this.$getTypeChoices();
            typeChoices.$setType({type, baseValue: value, bringIntoFocus});
            const root = typeChoices.$getTypeRoot();
            // Reenable this repeated setting of value if setting within the
            //   array is not enough for `idb-manager`! But causes problems
            //   with running `Error.cause` type twice and is inefficient
            // const typeObj = /** @type {import('../types.js').TypeObject} */ (
            //   Types.availableTypes[type]
            // );
            // if (typeObj.setValue) {
            //   typeObj.setValue({root, value});
            // }
            Types.validate({type, root, topRoot});
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
          // @ts-ignore TS is apparently getting wrong $addArrayElement
          $addArrayElement ({propName, splice, alwaysFocus}) {
            const addArrayElement = this.$getAddArrayElement();
            /**
             * @type {HTMLButtonElement & {
             *   $addArrayElement: AddArrayElement,
             *   $getArrayItems: GetArrayItems
             * }}
             */
            (addArrayElement).$addArrayElement({propName, splice, alwaysFocus});
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
            if (target.type !== 'checkbox' && target.type !== 'radio') {
              e.preventDefault();
            }
          }
        }
      }), /** @type {import('jamilih').JamilihChildren} */ ([
        DOM.initialCaps(
          /** @type {import('../types.js').AvailableType} */
          (type)
        ).replace(/s$/u, ''), nbsp.repeat(2),
        minusButton,
        arrayContents
      ]))
    );
    topRoot = topRoot || div;
    return [div];
  }
};

export default arrayType;

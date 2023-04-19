import {jml, nbsp} from '../../vendor/jamilih/dist/jml-es.js';

import Types, {getPropertyValueFromLegend} from '../types.js';
import {$e, U, DOM} from '../utils/templateUtils.js';
import dialogs from '../utils/dialogs.js';
import {
  resolveJSONPointer, getJSONPointerParts, reduceJSONPointerParts
} from '../utils/jsonPointer.js';

/**
 * @type {TypeObject}
 */
const arrayType = {
  option: ['Array'],
  array: true,
  regexEndings: [',', ']'],
  stringRegexBegin: /^\[/u,
  stringRegexEnd: /^\]/u,
  toValue (s, {
    format,
    /* istanbul ignore next -- Just a guard */
    endMatchTypeObjs = [],
    remnant: innerContents,
    rootHolder
  }) {
    const {sparse} = this;
    const state = sparse
      ? 'arrayNonindexKeys'
    // ? 'sparseArrays'
      : (this.array ? 'array' : 'object');
    const retObj = this.array ? [] : {};
    let stringVal = innerContents !== undefined
      ? innerContents
      /* istanbul ignore next -- Unreachable? */
      : s;
    const checkEnd = (beginOnly) => {
      if (beginOnly && endMatchTypeObjs.length) {
        const endMatch = stringVal.match(
          endMatchTypeObjs.slice(-1)[0].stringRegexEnd
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
      return {value: retObj, remnant: stringVal};
    }
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
        retObj[pr] = v;
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
    const arrayItems = $e(root, '.arrayItems');
    const fieldsets = arrayItems.children;
    const ret = root.dataset.type === 'object'
      ? {}
      : !this.sparse
        ? []
        : Array.from({length: Number.parseInt(DOM.filterChildElements(
          root,
          ['div', 'div', 'label', 'input']
        )[0].value)});

    // Todo: Should this be renamed per return arguments to
    //   `getRefOrVal` or is it ok?
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
    [...fieldsets].forEach((fieldset) => {
      const legend = fieldset.firstElementChild;
      const propVal = getPropertyValueFromLegend(legend);
      const root = $e(fieldset, 'div[data-type]');
      /* istanbul ignore if -- Should err first? */
      if (!root) {
        return;
      }

      const objectProperty = $e(legend, 'input');
      const [isVal, value] = getValOrRef(
        root,
        propVal
      );
      if (isVal) {
        if (objectProperty) {
          ret[propVal] = value;
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

          referencePath = getJSONPointerParts(referencePath);
          const referenceFinalPathPart = referencePath.pop();
          const referenceParentObj = referencePath.reduce(
            (obj, pathPart) => reduceJSONPointerParts(obj, pathPart),
            ret
          );
          referenceParentObj[referenceFinalPathPart] = referentObj;
        }
      );
    }
    return ret;
  },

  // Try to keep in sync with basic structure of `editUI`
  viewUI ({typeNamespace, type, value, topRoot, resultType, format}) {
    // const {sparse} = this;
    let itemIndex = -1;
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
            // eslint-disable-next-line max-len -- Long
            /* istanbul ignore next -- Won't reach here as typeson will always give keypath? */
            : itemIndex
        ]]
      ]];
    };
    const div = jml('div', {
      class: 'arrayHolder',
      dataset: {type},
      $custom: {
        $addAndSetArrayElement ({
          propName, type, value, bringIntoFocus,
          schemaContent, schemaState
        }) {
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
        $addArrayElement ({propName}) {
          itemIndex++;
          const arrayItems = this.$getArrayItems();
          const className = `${type}Item`;
          const fieldset = jml('fieldset', [
            buildLegend({
              className, itemIndex, type, typeNamespace,
              arrayItems, propName
            })
          ], arrayItems);
          return fieldset;
        },
        $getArrayItems () {
          return this.lastElementChild.lastElementChild;
        }
      }
    }, [
      DOM.initialCaps(type).replace(/s$/u, ''), nbsp.repeat(2),
      ['button', {$on: {click (e) {
        e.preventDefault();
        const {target} = e;
        const arrayContents = $e(
          target.closest('.arrayHolder'),
          '.arrayContents'
        );
        arrayContents.hidden = !arrayContents.hidden;
        target.textContent = arrayContents.hidden ? '+' : '-';
      }}}, ['-']],
      ['div', {class: 'arrayContents'}, [
        this.array
          ? ['div', [
            'Array length: ',
            ['span', [
              (value && value.length) || 0
            ]]
          ]]
          : '',
        ['div', {
          class: 'arrayItems'
        }]
      ]]
    ]);
    return [div];
  },
  getInput ({root}) {
    // One element we are guaranteed to have for adding validation
    return $e(root, 'button');
  },
  // Unlike other items, we don't use the `value`, as it wil always be
  //    an array (or object if called by that method) and we handle the
  //    population of the array in the callback
  editUI ({
    typeNamespace, buildTypeChoices, format, resultType,
    type, topRoot, value, bringIntoFocus = true
  }) {
    const {sparse} = this;
    const itemAdjust = type === 'object' ? 1 : 0;
    let itemIndex = itemAdjust - 1;
    const editableProperties = type !== 'array';
    const bringFocus = (input, alwaysFocus) => {
      if (bringIntoFocus || alwaysFocus) {
        input.scrollIntoView();
        input.focus();
      }
    };
    const $swapGroup = function (holder, direction) {
      const group = holder.parentElement;
      const swapGroup = group[
        (direction === 'up' ? 'previous' : 'next') + 'ElementSibling'
      ];
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
        const swapCountElem = group.$getPropertyInput();
        const baseCountElem = swapGroup.$getPropertyInput();
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
      Types.validateAllReferences({topRoot}); // Needed
      this.$redrawMoveArrows();
    };
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
    const buildLegend = ({
      className, splice, itemIndex, /* type, */ typeNamespace,
      arrayItems, propName
    }) => {
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
        const arrLengthInput = $e(arrayItems.previousElementSibling, 'input');
        const highest = inputsExceedingLength.map(
          (i) => Number.parseInt(i.value)
        ).sort().slice(-1)[0];
        arrLengthInput.value = highest + 1;
        return this.$validateLength(true);
      };
      return editableProperties
        ? ['legend', [
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
                  Types.validateAllReferences({topRoot}); // Needed
                } catch (err) {}
              },
              $parseInt () {
                if (!(/^\d+$/u).test(this.value)) {
                  return false;
                }
                return Number.parseInt(this.value);
              },
              $validateLegend,
              $arrayItems: arrayItems,
              $validateLength,
              $resort ({alwaysFocus}) {
                const inputs = this.$arrayItems.$getPropertyInputs();
                if (inputs.length === 1) {
                  return;
                }
                const getFieldset = (el) => el.closest('fieldset');
                const thisFieldset = getFieldset(this);
                const intVal = this.$parseInt();
                if (intVal === false) {
                  inputs.reverse().some((input) => {
                    if (input === this) { // No need to search further
                      return true;
                    }
                    const intValOlder = input.$parseInt();
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
                const getNearest = (latest) => {
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
        ]]
        : ['legend', [
          'Item ',
          ['span', {
            dataset: {prop: true, array: true},
            className
          }, [
            propName !== undefined ? propName : String(itemIndex)
          ]]
        ]];
    };
    const decrementItemIndex = (arrayItems) => {
      if (sparse) {
        itemIndex = arrayItems.$getPropertyInputs().reduce(
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
          itemIndex = arrayItems.$getPropertyInputs().reduce(
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
      const fieldset = jml('fieldset', {
        $custom: {
          $getPropertyInput () {
            return DOM.filterChildElements(
              this,
              ['legend', `input.propertyName-${typeNamespace}`]
            ).pop();
          }
        }
      }, [
        buildLegend({
          className, splice, itemIndex, type, typeNamespace,
          arrayItems, propName
        })
      ], arrayItems);
      // We must ensure fieldset is built before passing it
      jml({'#': [
        ...buildTypeChoices({
          resultType,
          topRoot,
          format,
          state: type,
          itemIndex,
          typeNamespace
        }),
        nbsp.repeat(2),
        ['button', {$on: {click (e) {
          e.preventDefault();
          // e.stopPropagation();
          let splice;
          if (sparse) {
            const prevInputVal = fieldset.$getPropertyInput().$parseInt();
            splice = prevInputVal === false ? 'append' : prevInputVal;
          }
          thisButton.$addArrayElement({
            splice, alwaysFocus: true
          });
          const newArrayFieldset = arrayItems.lastElementChild;
          fieldset.after(newArrayFieldset);
          if (sparse) {
            const newPrevInput = newArrayFieldset.$getPropertyInput();
            bringFocus(newPrevInput, true);
          } else {
            DOM.filterChildElements(
              arrayItems, [
                'fieldset', 'legend', '.' + className
              ]
            ).forEach((span, i) => {
              span.textContent = Number.parseInt(i) + itemAdjust;
            });
          }
          // Maybe not needed as addition (without renumbering)
          //   wouldn't yet add type
          Types.validateAllReferences({topRoot});
          arrayItems.$redrawMoveArrows();
        }}}, ['+']],
        ['button', {$on: {click (e) {
          e.preventDefault();
          // e.stopPropagation();
          fieldset.remove();
          decrementItemIndex(arrayItems);
          if (!sparse) {
            DOM.filterChildElements(arrayItems, [
              'fieldset', 'legend', '.' + className
            ]).forEach((span, i) => {
              span.textContent = Number.parseInt(i) + itemAdjust;
            });
          }
          // Maybe not needed as removal would remove circular
          Types.validateAllReferences({topRoot});
          arrayItems.$redrawMoveArrows();
        }}}, ['x']],
        ['span', {class: `${type}Item-arrowHolder-${typeNamespace}`}, []]
      ]}, fieldset);
      // Need to validate if adding more than one property (in
      //   case two have empty string)
      if (editableProperties) {
        const pns = arrayItems.$getPropertyInputs();
        /* istanbul ignore else -- Just a guard */
        if (pns.length) {
          const input = pns.pop();
          input.$validate();
          input.$resort({alwaysFocus});
          bringFocus(input, alwaysFocus);
        }
      }
      arrayItems.$redrawMoveArrows();
    };

    const $getArrayLength = function () {
      return $e(this.previousElementSibling, 'input').value;
    };
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
    const div = jml('div', {
      dataset: {type},
      // is: 'array-or-object-editor',
      $custom: {
        $addAndSetArrayElement ({
          propName, type, value, bringIntoFocus
          // , schemaContent, schemaState
        }) {
          this.$addArrayElement({propName});
          const typeChoices = this.$getTypeChoices();
          typeChoices.$setType({type, baseValue: value, bringIntoFocus});
          const root = typeChoices.$getTypeRoot();
          const typeObj = Types.availableTypes[type];
          if (typeObj.setValue) typeObj.setValue({root, value});
          Types.validate({type, root, topRoot});
          return root;
        },
        $getAddArrayElement () {
          const el = this
            .lastElementChild.firstElementChild.nextElementSibling;
          return sparse ? el.nextElementSibling : el;
        },
        $addArrayElement ({propName, splice, alwaysFocus}) {
          const addArrayElement = this.$getAddArrayElement();
          addArrayElement.$addArrayElement({propName, splice, alwaysFocus});
        },
        $getArrayItems () {
          const addArrayElement = this.$getAddArrayElement();
          return addArrayElement.previousElementSibling;
        },
        $getTypeChoices () {
          const arrayItems = this.$getArrayItems();
          return $e(
            arrayItems.lastElementChild,
            `.typeChoices-${typeNamespace}`
          );
        }
      },
      $on: {click (e) {
        // We needed to stop preventing the default for the
        //    invalid date checkbox; is this sufficient to prevent
        //    other stray clicks apparently meant for the array
        //    and object reference checking?
        if (e.target.type !== 'checkbox' && e.target.type !== 'radio') {
          e.preventDefault();
        }
      }}
    }, [
      DOM.initialCaps(type).replace(/s$/u, ''), nbsp.repeat(2),
      ['button', {$on: {click (e) {
        e.preventDefault();
        const {target} = e;
        const arrayContents = $e(div, '.arrayContents');
        arrayContents.hidden = !arrayContents.hidden;
        target.textContent = arrayContents.hidden ? '+' : '-';
      }}}, ['-']],
      ['div', {class: 'arrayContents'}, [
        sparse
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
                  async change () {
                    const arrayItems = $e(
                      this.closest('.arrayContents'), '.arrayItems'
                    );
                    const propInputsBeyondLength =
                      arrayItems.$inputsExceedingLength();
                    try {
                      if (propInputsBeyondLength.length) {
                        await dialogs.confirm({
                          message: 'Your new length will truncate the ' +
                            'array causing items to be removed. Continue?'
                        });
                        propInputsBeyondLength.forEach((input) => {
                          const fieldset = input.closest('fieldset');
                          fieldset.remove();
                        });
                        // Maybe not needed as removal would remove circular
                        Types.validateAllReferences({topRoot});
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
          : '',
        ['div', {
          class: 'arrayItems',
          $custom: {
            $swapGroup, $redrawMoveArrows, $getArrayLength,
            $inputsExceedingLength,
            $getPropertyInputs () {
              return DOM.filterChildElements(
                this,
                ['fieldset', 'legend', `input.propertyName-${typeNamespace}`]
              );
            }
          }
        }],
        ['button', {
          class: 'addArrayElement',
          // is: 'add-array-element',
          $custom: {$addArrayElement, $getArrayItems () {
            return this.previousElementSibling;
          }},
          $on: {click () {
            this.$addArrayElement({alwaysFocus: true});
            // Maybe not needed as addition (without renumbering)
            //   wouldn't yet add type
            Types.validateAllReferences({topRoot});
          }}
        }, ['+ Item']],
        ['button', {$on: {click () {
          const arrayContents = this.closest('.arrayContents');
          const arrayItems = $e(arrayContents, '.arrayItems');
          const lastElement = arrayItems.lastElementChild;
          if (lastElement) {
            lastElement.remove();
            decrementItemIndex(arrayItems);
            $e(arrayContents, '.arrayItems').$redrawMoveArrows();
          }
          // Maybe not needed as removal would remove circular
          Types.validateAllReferences({topRoot});
        }}}, ['- Last item']],
        // We could only add this when there was more than one
        ['button', {$on: {click () {
          const arrayItems = $e(
            this.closest('.arrayContents'),
            '.arrayItems'
          );
          DOM.removeChildren(arrayItems);
          if (sparse) {
            decrementItemIndex(arrayItems);
          } else {
            itemIndex = -1;
          }
          // Maybe not needed as removal would remove circular
          Types.validateAllReferences({topRoot});
        }}}, ['x All']]
      ]]
    ]);
    topRoot = topRoot || div;
    return [div];
  }
};

export default arrayType;

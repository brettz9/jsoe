import {jml} from './vendor-imports.js';
import Formats, {getControlsForFormatAndValue} from './formats.js';
import Types from './types.js';

import {$e, DOM} from './utils/templateUtils.js';
import dialogs from './utils/dialogs.js';

/**
 * @typedef {import('./index.js').SetType} SetType
 */

/**
 * @typedef {(info: {type: string, editUI: Element}) => void} AddTypeAndEditUI
 */

/**
 * @typedef {(info?: {
 *   baseValue?: import('./formats.js').StructuredCloneValue,
 *   bringIntoFocus?: boolean
 * }) => void} AddAndValidateEditUI
 */

/**
 * @typedef {() => void} SetStyles
 */

/**
 * @typedef {HTMLElement & {
 *   $addAndValidateEditUI: AddAndValidateEditUI,
 *   $setStyles: SetStyles
 * }} TypeChoicesElementAPI
 */

/**
 * @callback GetValue
 * @param {import('./types.js').StateObject} [stateObj] Will
 *   auto-set `typeNamespace` and `format`
 * @param {string} [currentPath]
 * @returns {import('./formats.js').StructuredCloneValue}
 */

/**
 * @callback GetType
 * @returns {string}
 */

/**
 * @callback ValidValuesSet
 * @returns {boolean}
 */

/**
 * @callback SetValue
 * @param {import('./formats.js').StructuredCloneValue} value
 * @param {import('./types.js').StateObject} stateObj
 * @returns {Promise<void>}
 */

/**
 * @callback BuildTypeChoices
 * @param {{
 *   format: import('./formats.js').AvailableFormat,
 *   typeNamespace?: string,
 *   value?: import('./formats.js').StructuredCloneValue,
 *   setValue?: boolean,
 *   state?: string,
 *   keySelectClass?: string,
 *   requireObject?: boolean,
 *   objectHasValue?: boolean,
 *   topRoot?: import('./types.js').RootElement,
 *   schema?: string,
 *   schemaContent?: object,
 * }} cfg
 * @returns {{
 *   domArray: [select: HTMLElement, typeContainer: HTMLElement],
 *   getValue: GetValue,
 *   getType: GetType,
 *   validValuesSet: ValidValuesSet,
 *   setValue: SetValue
 * }}
 */

/**
 * @type {BuildTypeChoices}
 */
export const buildTypeChoices = ({
  format,
  typeNamespace,
  value,
  setValue = false,
  state,
  // itemIndex = 0,
  keySelectClass,
  requireObject,
  objectHasValue,
  topRoot,
  schema,
  schemaContent
}) => {
  // console.log('format', format, 'state', state, 'path', typeNamespace);
  const typeOptions = requireObject
    ? [Types.getOptionForType('object')]
    : Types.getTypeOptionsForFormatAndState(format, state);

  let editUI;

  /** @type {GetValue} */
  const $getValue = (stateObj, currentPath) => {
    const root = /** @type {HTMLDivElement} */ (
      $e(typeContainer, 'div[data-type]')
    );
    return Types.getValueForRoot(
      root,
      /** @type {import('./types.js').StateObject} */ ({
        typeNamespace,
        format,
        ...stateObj
      }),
      currentPath
    );
  };
  const sel = /** @type {HTMLSelectElement} */ (jml('select', {
    hidden: requireObject,
    class: `typeChoices-${typeNamespace}${keySelectClass
      ? ' ' + keySelectClass
      : ''
    }`,
    // is: 'type-choices',
    $custom: {
      $getValue,
      /** @type {SetType} */
      $setType ({type, baseValue, bringIntoFocus}) {
        this.value = type;
        this.$setStyles();
        this.$addAndValidateEditUI({baseValue, bringIntoFocus});
      },
      /**
       * @type {(info: {type: string}) => void} cfg
       */
      $setTypeNoEditUI ({type}) {
        this.value = type;
        this.$setStyles();
      },

      /** @type {SetStyles} */
      $setStyles () {
        const {value: type} = this;
        this.dataset.type = type; // Used for styling
        const parEl = this.parentElement;
        if (parEl.nodeName.toLowerCase() === 'fieldset') {
          parEl.dataset.type = type;
          DOM.filterChildElements(parEl, 'legend').forEach((legend) => {
            /** @type {HTMLElement} */ (legend).dataset.type = type;
          });
        }
      },
      $getTypeRoot () {
        const container = this.$getContainer();
        /* istanbul ignore if -- How to replicate? */
        if (!container) {
          return false;
        }
        return $e(container, 'div[data-type]');
      },

      /** @type {AddAndValidateEditUI} */
      $addAndValidateEditUI ({baseValue, bringIntoFocus} = {}) {
        const {value: type} = this;

        if (!type) {
          return;
        }
        let topRoot = this.$getTopRoot();

        // Todo (low): Try to avoid need for `baseValue`
        //    (needed by arrayNonindexKeys for setting an array
        //    length and avoiding errors); could set all
        //    values through here?
        editUI = Types.getUIForModeAndType({
          readonly: false,
          typeNamespace,
          type,
          bringIntoFocus,
          hasValue: type === 'arrayNonindexKeys' && baseValue,
          value: baseValue,
          buildTypeChoices,
          format,
          topRoot
        });
        this.$addEditUI({editUI});
        this.$validate();
        topRoot = this.$getTopRoot(); // May be existing now
        // Needed; Array/object ref somewhere could now be valid or invalid
        Types.validateAllReferences({topRoot});
      },

      /** @type {AddTypeAndEditUI} */
      $addTypeAndEditUI ({type, editUI}) {
        this.$setTypeNoEditUI({type});
        this.$addEditUI({editUI});
      },
      /**
       * @type {(info: {editUI: HTMLElement}) => void}
       */
      $addEditUI ({editUI}) {
        const container = this.$getContainer();
        DOM.removeChildren(container);
        jml(editUI, container);
      },
      $getContainer () {
        return this.nextElementSibling;
      },
      $getTopRoot () {
        return topRoot || this.$getTypeRoot();
      },
      /**
       * @returns {boolean}
       */
      $validate () {
        const {value: type} = this;
        const container = this.$getContainer();
        if (!container.firstElementChild) {
          return false;
        }
        const editUI = container.firstElementChild;
        return Types.validate({
          type, root: editUI, topRoot: this.$getTopRoot()
        });
      }
    },
    $on: {change (e) {
      // We don't want form `onchange` to run `$checkForKeyDuplicates`
      //   again (through `addAndValidateEditUI`->`validateAllReferences`)
      e?.stopPropagation();
      /** @type {TypeChoicesElementAPI} */ (this).$addAndValidateEditUI();
      /** @type {TypeChoicesElementAPI} */ (this).$setStyles();
    }}
  }, [
    ['option', {value: ''}, [
      '(Choose a type)'
    ]],
    // [string, {value: AvailableType; title?: string | undefined;}]
    // @ts-ignore Apparent TS bug
    ...typeOptions.map(
      ([optText, optAtts]) => [
        'option',
        optAtts ||
          /* istanbul ignore next -- Should always have atts */
          {},
        [optText]
      ]
    )
  ]));
  if (setValue || (requireObject && !objectHasValue)) {
    setTimeout(async () => {
      if (!setValue) { // if (requireObject && !objectHasValue) {
        // Todo (low): We could auto-populate keypath if has
        //   keypath (and we probably also only want if
        //   not autoincrement)
        value = {};
      }
      try {
        const rootEditUI = await Formats.availableFormats[format].iterate(
          value,
          {
            readonly: false,
            typeNamespace,
            schema,
            schemaContent
          }
        );
        const type =
          Types.getTypeForRoot(/** @type {HTMLDivElement} */ (
            rootEditUI
          ));
        // eslint-disable-next-line @stylistic/max-len -- Long
        /** @type {HTMLSelectElement & {$addTypeAndEditUI: AddTypeAndEditUI}} */ (
          sel
        ).$addTypeAndEditUI({type, editUI: rootEditUI});
      } catch (err) {
        /* istanbul ignore next -- At least some errors handled earlier */
        dialogs.alert({
          message: 'The object to be added had types not supported ' +
            'by the current format.'
        });
        /* istanbul ignore next -- How to trigger? */
        console.log('err', err);
      }
    });
  }

  const typeContainer = /** @type {HTMLDivElement} */ (
    jml('div', {class: 'typeContainer'})
  );

  return {
    domArray: [
      sel,
      typeContainer
    ],

    /** @type {GetValue} */
    getValue: $getValue,

    /** @type {GetType} */
    getType () {
      const root = /** @type {HTMLDivElement} */ (
        $e(typeContainer, 'div[data-type]')
      );
      return Types.getTypeForRoot(root);
    },

    /** @type {ValidValuesSet} */
    validValuesSet () {
      const root = /** @type {HTMLDivElement} */ (
        $e(typeContainer, 'div[data-type]')
      );
      const form = /** @type {HTMLFormElement} */ (root.closest('form'));
      return Types.validValuesSet({form, typeNamespace});
    },

    /** @type {SetValue} */
    async setValue (value, stateObj) {
      const rootEditUI = /** @type {HTMLDivElement} */ (
        await getControlsForFormatAndValue(
          format, value, stateObj
        )
      );
      const type = Types.getTypeForRoot(rootEditUI);
      /** @type {HTMLSelectElement & {$addTypeAndEditUI: AddTypeAndEditUI}} */ (
        sel
      ).$addTypeAndEditUI({type, editUI: rootEditUI});
    }
  };
};

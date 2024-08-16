import {jml} from './vendor-imports.js';
import Formats from './formats.js';
import Types from './types.js';

import {$e, DOM} from './utils/templateUtils.js';
import dialogs from './utils/dialogs.js';

// This is technically just `import('./index.js').SetType`, but our
//   redirect file causes problems, so we redefine here
/**
 * @typedef {(cfg: {
 *   type: string,
 *   baseValue?: import('./formats.js').StructuredCloneValue,
 *   bringIntoFocus?: boolean,
 *   avoidReport?: boolean,
 *   specificSchema?: import('zodex').SzType
 * }) => void} SetType
 */

/**
 * @typedef {(info: {
 *   type: string,
 *   editUI: Element,
 *   specificSchema?: import('zodex').SzType
 * }) => void} AddTypeAndEditUI
 */

/**
 * @typedef {(info?: {
 *   baseValue?: import('./formats.js').StructuredCloneValue,
 *   bringIntoFocus?: boolean,
 *   schemaObject?: import('./formatAndTypeChoices.js').ZodexSchema,
 *   avoidReport?: boolean
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
 *   autoTrigger?: boolean,
 *   format: import('./formats.js').AvailableFormat,
 *   typeNamespace?: string,
 *   value?: import('./formats.js').StructuredCloneValue,
 *   setValue?: boolean,
 *   state?: string,
 *   forcedState?: string,
 *   keySelectClass?: string,
 *   requireObject?: boolean,
 *   objectHasValue?: boolean,
 *   topRoot?: import('./types.js').RootElement,
 *   formats?: import('./formats.js').default
 *   types?: import('./types.js').default
 *   schema?: string,
 *   schemaIdx?: number,
 *   schemaOriginal?: import('./formatAndTypeChoices.js').ZodexSchema,
 *   schemaContent?: import('./formatAndTypeChoices.js').ZodexSchema,
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
  autoTrigger = true,
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
  formats = new Formats(),
  types = new Types(),
  schema,
  schemaIdx,
  schemaOriginal,
  schemaContent
}) => {
  // console.log('format', format, 'state', state, 'path', typeNamespace);
  const typeAndSchemaInfo = requireObject && !schemaContent
    ? {
      typeOptions: [types.getOptionForType('object')], schemaObjects: undefined
    }
    : types.getTypeOptionsForFormatAndState(
      format, state, schemaContent, schemaOriginal
    );
  const {typeOptions} = typeAndSchemaInfo;
  const schemaObjs = typeAndSchemaInfo.schemaObjects;

  let editUI;

  /** @type {GetValue} */
  const $getValue = (stateObj, currentPath) => {
    const root = /** @type {HTMLDivElement} */ (
      $e(typeContainer, 'div[data-type]')
    );
    return types.getValueForRoot(
      root,
      /** @type {import('./types.js').StateObject} */ ({
        typeNamespace,
        formats,
        format,
        types,
        ...stateObj
      }),
      currentPath
    );
  };
  const sel = /** @type {HTMLSelectElement} */ (jml('select', {
    hidden: requireObject || typeOptions.length === 1,
    class: `typeChoices-${typeNamespace}${keySelectClass
      ? ' ' + keySelectClass
      : ''
    }`,
    // is: 'type-choices',
    $custom: {
      $getValue,
      /** @type {SetType} */
      $setType ({
        type, baseValue, bringIntoFocus, avoidReport, specificSchema
      }) {
        if (schemaObjs && specificSchema) {
          const idx = schemaObjs.map((obj) => {
            return JSON.stringify(obj);
          }).indexOf(JSON.stringify(specificSchema));
          if (idx === -1) {
            console.log('schemaObjs', schemaObjs, specificSchema);
            this.value = type;
          } else {
            this.selectedIndex = idx + 1;
          }
        } else {
          this.value = type;
        }
        this.$setStyles();
        this.$addAndValidateEditUI({baseValue, bringIntoFocus, avoidReport});
      },
      /**
       * @type {(info: {
       *   type: string,
       *   specificSchema?: import('zodex').SzType
       * }) => void} cfg
       */
      $setTypeNoEditUI ({type, specificSchema}) {
        if (schemaObjs && specificSchema) {
          const idx = schemaObjs.map((obj) => {
            return JSON.stringify(obj);
          }).indexOf(JSON.stringify(specificSchema));
          this.selectedIndex = idx + 1;
        } else {
          this.value = type;
        }
        this.$setStyles();
      },

      /** @type {SetStyles} */
      $setStyles () {
        const {value: type} = this;
        this.dataset.type = type; // Used for styling
        let ancestorEl = this.parentElement;
        if (ancestorEl.nodeName.toLowerCase() !== 'fieldset') {
          // Grandparent check added for optional items placeholder
          ancestorEl = this.parentElement.parentElement;
        }
        if (ancestorEl.nodeName.toLowerCase() === 'fieldset') {
          ancestorEl.dataset.type = type;
          DOM.filterChildElements(ancestorEl, 'legend').forEach((legend) => {
            legend.dataset.type = type;
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
      $addAndValidateEditUI ({
        baseValue, bringIntoFocus, schemaObject, avoidReport
      } = {}) {
        const {value: type} = this;

        if (!type) {
          return;
        }
        let topRoot = this.$getTopRoot();

        // Todo (low): Try to avoid need for `baseValue`
        //    (needed by arrayNonindexKeys for setting an array
        //    length and avoiding errors); could set all
        //    values through here?
        editUI = types.getUIForModeAndType({
          readonly: false,
          typeNamespace,
          type,
          bringIntoFocus,
          hasValue: type === 'arrayNonindexKeys' && baseValue,
          value: baseValue,
          buildTypeChoices,
          format,
          topRoot,
          schemaContent: schemaOriginal ??
            (schemaContent?.type === 'union' && schemaIdx !== undefined
              ? schemaContent.options[schemaIdx]
              : schemaContent),
          // Added `schemaContent` as inner arrays were not getting their
          //   schema info; this apparently allows (actually requires)
          //   commenting out the auto-adding of object content at end of
          //   editUI in arrayType.js; we add `schemaFallingBack` to
          //   distinguish
          specificSchemaObject: schemaObject ??

            // Avoid JSON references by using this by default (or only?)
            (schemaObjs?.[sel.selectedIndex - 1]) ??

            (schemaContent?.type === 'union' && schemaIdx !== undefined
              ? schemaContent.options[schemaIdx]
              : schemaContent),
          schemaFallingBack: Boolean(!schemaObject && schemaContent)
        });
        this.$addEditUI({editUI});
        this.$validate({
          avoidReport
        });
        topRoot = this.$getTopRoot(); // May be existing now
        // Needed; Array/object ref somewhere could now be valid or invalid
        types.validateAllReferences({topRoot});
      },

      /** @type {AddTypeAndEditUI} */
      $addTypeAndEditUI ({type, editUI, specificSchema}) {
        this.$setTypeNoEditUI({type, specificSchema});
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
       * @param {{avoidReport?: boolean}} cfg
       * @returns {boolean}
       */
      $validate ({avoidReport} = {}) {
        const {value: type} = this;
        const container = this.$getContainer();
        if (!container.firstElementChild) {
          return false;
        }
        const editUI = container.firstElementChild;
        return types.validate({
          type, root: editUI, topRoot: this.$getTopRoot(),
          avoidReport
        });
      }
    },
    $on: {change (e) {
      // We don't want form `onchange` to run `$checkForKeyDuplicates`
      //   again (through `addAndValidateEditUI`->`validateAllReferences`)
      e?.stopPropagation();
      /** @type {TypeChoicesElementAPI} */ (this).$addAndValidateEditUI({
        schemaObject: schemaObjs
          ? schemaObjs[Number(
            /** @type {HTMLSelectElement} */
            (e.target).selectedOptions[0].dataset.idx
          )]
          : undefined
      });
      /** @type {TypeChoicesElementAPI} */ (this).$setStyles();
    }}
  }, [
    ['option', {value: ''}, [
      '(Choose a type)'
    ]],

    // @ts-expect-error Apparent TS bug
    ...typeOptions.map(
      ([optText, optAtts], idx) => {
        return [
          'option',
          {
            ...optAtts,
            dataset: schemaObjs ? {idx} : {}
          },
          [optText]
        ];
      }
    )
  ]));
  if (autoTrigger && typeOptions.length === 1 && !setValue) {
    setTimeout(() => {
      sel.selectedIndex = 1;
      sel.dispatchEvent(new Event('change'));
    });
  } else if (setValue || (requireObject && !objectHasValue)) {
    setTimeout(async () => {
      if (!setValue) { // if (requireObject && !objectHasValue) {
        // Todo (low): We could auto-populate keypath if has
        //   keypath (and we probably also only want if
        //   not autoincrement)
        value = {};
      }
      try {
        const {
          rootUI: rootEditUI,
          specificSchemas
        } = await formats.getControlsForFormatAndValue(
          types,
          format,
          value,
          {
            readonly: false,
            typeNamespace,
            schema,
            schemaContent,
            formats,
            types
          }
        );
        const type =
          Types.getTypeForRoot(/** @type {HTMLDivElement} */ (
            rootEditUI
          ));
        // eslint-disable-next-line @stylistic/max-len -- Long
        /** @type {HTMLSelectElement & {$addTypeAndEditUI: AddTypeAndEditUI}} */ (
          sel
        ).$addTypeAndEditUI({
          type, editUI: rootEditUI,
          // We do actually want the first one
          specificSchema: specificSchemas?.[0]
        });
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

  const typeContainer = jml('div', {class: 'typeContainer'});

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
        (await formats.getControlsForFormatAndValue(
          types,
          format, value, stateObj
        )).rootUI
      );
      const type = Types.getTypeForRoot(rootEditUI);
      /** @type {HTMLSelectElement & {$addTypeAndEditUI: AddTypeAndEditUI}} */ (
        sel
      ).$addTypeAndEditUI({type, editUI: rootEditUI});
    }
  };
};

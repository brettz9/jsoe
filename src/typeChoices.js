import Formats, {getControlsForFormatAndValue} from './formats.js';
import Types from './types.js';
import {jml} from '../vendor/jamilih/dist/jml-es.js';

import {$e, DOM} from './utils/templateUtils.js';
import dialogs from './utils/dialogs.js';

/**
 * An arbitrary Structured Clone, JSON, etc. value.
 * @typedef {any} StructuredCloneValue
 */

/**
 * @callback BuildTypeChoices
 * @param {object} cfg
 * @param {string} cfg.format
 * @param {string} cfg.typeNamespace
 * @param {StructuredCloneValue} cfg.value
 * @param {boolean} [cfg.setValue=false]
 * @param {string} cfg.state
 * @param {string} cfg.keySelectClass
 * @param {boolean} cfg.requireObject
 * @param {boolean} cfg.objectHasValue
 * @param {RootElement} cfg.topRoot Always a `div` element?
 * @param {string} cfg.schema Schema name
 * @param {string} cfg.schemaContent Schema contents
 * @returns {[select: Element, typeContainer: Element]}
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
  const sel = jml('select', {
    hidden: requireObject,
    class: `typeChoices-${typeNamespace}${keySelectClass
      ? ' ' + keySelectClass
      : ''
    }`,
    // is: 'type-choices',
    $custom: {
      $setType ({type, baseValue, bringIntoFocus}) {
        this.value = type;
        this.$setStyles();
        this.$addAndValidateEditUI({baseValue, bringIntoFocus});
      },
      $setTypeNoEditUI ({type}) {
        this.value = type;
        this.$setStyles();
      },
      $setStyles () {
        const {value: type} = this;
        this.dataset.type = type; // Used for styling
        const parEl = this.parentElement;
        if (parEl.nodeName.toLowerCase() === 'fieldset') {
          parEl.dataset.type = type;
          DOM.filterChildElements(parEl, 'legend').forEach((legend) => {
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
      $addAndValidateEditUI ({baseValue, bringIntoFocus} = {}) {
        const {value: type} = this;

        const container = this.$getContainer();
        DOM.removeChildren(container);

        if (!type) { return; }
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
      $addTypeAndEditUI ({type, editUI}) {
        this.$setTypeNoEditUI({type});
        this.$addEditUI({editUI});
      },
      $addEditUI ({editUI}) {
        const container = this.$getContainer();
        jml(editUI, container);
      },
      $getContainer () {
        return this.nextElementSibling;
      },
      $getTopRoot () {
        return topRoot || this.$getTypeRoot();
      },
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
      e.stopPropagation();
      this.$addAndValidateEditUI();
      this.$setStyles();
    }}
  }, [
    ['option', {value: ''}, [
      '(Choose a type)'
    ]],
    ...typeOptions.map(
      ([optText, optAtts]) => [
        'option',
        optAtts ||
          /* istanbul ignore next -- Should always have atts */
          {},
        [optText]
      ]
    )
  ]);
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
        const type = Types.getTypeForRoot(rootEditUI);
        sel.$addTypeAndEditUI({type, editUI: rootEditUI});
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

    /**
     * @param {import('./types.js').StateObject} [stateObj] Will
     *   auto-set `typeNamespace` and `format`
     * @param {string} [currentPath]
     * @returns {StructuredCloneValue}
     */
    getValue (stateObj, currentPath) {
      const root = $e(typeContainer, 'div[data-type]');
      return Types.getValueForRoot(root, {
        typeNamespace,
        format,
        ...stateObj
      }, currentPath);
    },

    /**
     * @returns {string|undefined}
     */
    getType () {
      const root = $e(typeContainer, 'div[data-type]');
      return Types.getTypeForRoot(root);
    },

    /**
     * @returns {boolean}
     */
    validValuesSet () {
      const root = $e(typeContainer, 'div[data-type]');
      const form = root.closest('form');
      return Types.validValuesSet({form, typeNamespace});
    },

    /**
     * @param {StructuredCloneValue} value
     * @param {import('./types.js').StateObject} stateObj
     */
    async setValue (value, stateObj) {
      const rootEditUI = await getControlsForFormatAndValue(
        format, value, stateObj
      );
      const type = Types.getTypeForRoot(rootEditUI);
      sel.$addTypeAndEditUI({type, editUI: rootEditUI});
    }
  };
};

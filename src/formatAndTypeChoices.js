import {jml} from '../vendor/jamilih/dist/jml-es.js';
import {buildTypeChoices} from './typeChoices.js';
import Types from './types.js';
import {iterateFormat} from './formats.js';
import {$e, DOM} from './utils/templateUtils.js';

/**
 * Defaults to structured cloning.
 * @todo Compose from format metadata, so can make user customizable.
 * @param {object} cfg
 * @param {string} [cfg.schema] (NOT IN USE)
 * @param {boolean} [cfg.hasKeyPath] Whether or not a key path is expected; if
 *   true, an indexedDB key is not allowed here as a key does not support
 *   the object type which is needed for a key path.
 * @returns {DocumentFragment}
 */
export const getFormatAndSchemaChoices = ({schema, hasKeyPath} = {}) => {
  const hasSchema = typeof schema === 'string';
  return [
    ['JSON only', {value: 'json'}],
    ...(hasKeyPath
      ? []
      : [['IndexedDB key', {value: 'indexedDBKey'}]]),
    ['Structured Clone (via Typeson JSON)', {
      value: 'structuredCloning', selected: !hasSchema
    }]
    /* schema:
    ...(hasSchema
      ? [
        [`Schema + arbitrary: ${schema}`, {
          value: 'schemaAndArbitrary',
          dataset: {schema}
        }],
        [`Schema only: ${schema}`, {
          value: 'schemaOnly',
          dataset: {schema},
          selected: hasSchema
        }]
      ]
      : []
    )
    */
    /*
        // This can be supported for editing only
        ['Arbitrary (Non-Typeson-serializable will be read-only)', {
            value: 'arbitrary',
            title: 'Any value that the typeson-registry supports ' +
              'for structured cloning'
        }]
    */
  ].map(([optText, optAtts]) => {
    return jml('option', optAtts, [optText]);
  }).reduce((frag, option) => {
    frag.append(option);
    return frag;
  }, document.createDocumentFragment());
};

/**
 * Builds a selector and container for types.
 * @param {object} cfg
 * @param {string} [cfg.schema] The schema name (NOT IN USE)
 * @param {object} [cfg.schemaContent] The schema content (NOT IN USE)
 * @param {boolean} [cfg.hasValue] Set to `true` if you are supplying
 *   your own value. If `false` and `hasKeyPath` is `true`,
 *   will initialize with an object.
 * @param {boolean} [cfg.singleValue] (NOT IN USE)
 * @param {boolean} [cfg.hasKeyPath] If this is set (because there is a keyPath
 *   to be found within the object) and `hasValue` is true, an object type
 *   will be set and required at the root level. This option will also
 *   prevent selection of indexedDB key at root (since a key cannot be a
 *   plain object).
 * @param {string} [cfg.typeNamespace] Used to prevent conflicts with other
 *   instances of typeChoices on the page
 * @returns {{
 *   formatChoices: FormatChoices,
 *   typesHolder: TypesHolder,
 *   domArray: [formatChoices: FormatChoices, typesHolder: TypesHolder],
 *   getValue: (stateObj: import('./types.js').StateObject,
 *     currentPath: string) => StructuredCloneValue,
 *   getType: () => string|undefined,
 *   validValuesSet: () => boolean
 * }} The selector for types and the container for them. Both should be
 *   added to the page.
 */
export function formatAndTypeChoices ({
  schema,
  schemaContent,
  hasValue,
  singleValue,
  hasKeyPath,
  typeNamespace
}) {
  const format = 'structuredCloning';
  const formatChoices = jml('select', {
    class: 'formatChoices',
    hidden: singleValue,
    // is: 'main-type-choices',
    $custom: {
      /**
       * Sets the desired format and rebuilds the type choices.
       * @callback SetFormat
       * @param {string} valueFormat
       * @returns {void}
       */

      /**
       * Rebuilds the type choices.
       * @callback TypeChoiceBuilder
       * @returns {void}
       */

      /**
       * @typedef {HTMLSelectElement} FormatChoices
       * @property {SetFormat} $setFormat
       * @property {TypeChoiceBuilder} $buildTypeChoices
       */

      /**
       * @type {SetFormat}
       */
      $setFormat (valueFormat) {
        this.value = valueFormat;
        this.$buildTypeChoices();
      },

      /**
       * @type {TypeChoiceBuilder}
       */
      $buildTypeChoices () {
        DOM.removeChildren(typesHolder);
        jml({'#': buildTypeChoices({
          topRoot: $e(typesHolder, 'div[data-type]'),
          resultType: 'both',
          format: this.value,
          typeNamespace,
          requireObject: hasKeyPath,
          objectHasValue: hasValue,
          schema,
          schemaContent
        }).domArray}, typesHolder);
      }
    },
    $on: {change () {
      this.$buildTypeChoices();
    }}
  }, [getFormatAndSchemaChoices({schema, hasKeyPath})]);

  /**
   * @callback TypeRootGetter
   * @returns {void}
   */

  /**
   * @callback TypeSelectGetter
   * @returns {void}
   */

  /**
   * @typedef {HTMLDivElement} TypesHolder
   * @property {TypeRootGetter} $getTypeRoot
   * @property {TypeSelectGetter} $getTypeSelect
   */

  const typesHolder = jml('div', {class: 'typesHolder', $custom: {
    /**
     * @type {TypeRootGetter}
     */
    $getTypeRoot () {
      return $e(this, 'div[data-type]');
    },
    /**
     * @type {TypeSelectGetter}
     */
    $getTypeSelect () {
      return $e(this, `.typeChoices-${typeNamespace}`);
    }
  }});

  jml({'#': buildTypeChoices({
    resultType: 'both',
    topRoot: $e(typesHolder, 'div[data-type]'),
    format,
    typeNamespace,
    requireObject: hasKeyPath,
    objectHasValue: hasValue,
    schema,
    schemaContent
  }).domArray}, typesHolder);

  return {
    formatChoices,
    typesHolder,
    // Easier for Jamilih
    domArray: [formatChoices, typesHolder],

    // Normal API

    /**
     * @param {import('./types.js').StateObject} [stateObj] Will
     *   auto-set `typeNamespace` and `format`
     * @param {string} [currentPath]
     * @returns {StructuredCloneValue}
     */
    getValue (stateObj, currentPath) {
      const root = typesHolder.$getTypeRoot();
      return Types.getValueForRoot(root, {
        typeNamespace,
        format: formatChoices.value,
        ...stateObj
      }, currentPath);
    },

    /**
     * @returns {string|undefined}
     */
    getType () {
      const root = typesHolder.$getTypeRoot();
      return Types.getTypeForRoot(root);
    },

    /**
     * @returns {boolean}
     */
    validValuesSet () {
      const root = typesHolder.$getTypeRoot();
      const form = root.closest('form');
      return Types.validValuesSet({form, typeNamespace});
    },

    /**
     * @param {StructuredCloneValue} value
     * @param {import('./types.js').StateObject} stateObj
     */
    async setValue (value, stateObj) {
      const rootEditUI = await iterateFormat(
        formatChoices.value, value, stateObj
      );
      const type = Types.getTypeForRoot(rootEditUI);
      const sel = typesHolder.$getTypeSelect();
      sel.$addTypeAndEditUI({type, editUI: rootEditUI});
    }
  };
}

import {jml} from './vendor-imports.js';
import {buildTypeChoices} from './typeChoices.js';
import Types from './types.js';
import Formats from './formats.js';
import {$e, DOM} from './utils/templateUtils.js';

/**
 * @callback TypeRootGetter
 * @returns {HTMLDivElement|null}
 */

/**
 * Defaults to structured cloning.
 * @todo Compose from format metadata, so can make user customizable.
 * @param {object} cfg
 * @param {string[]} [cfg.schemas]
 * @param {string} [cfg.selectedSchema]
 * @param {boolean} [cfg.hasKeyPath] Whether or not a key path is expected; if
 *   true, an indexedDB key is not allowed here as a key does not support
 *   the object type which is needed for a key path.
 * @param {boolean} [cfg.arbitraryJS] Whether to allow the choice of
 *   arbitrary JavaScript
 * @param {boolean} [cfg.preselectSchema] Whether to preselect schema
 * @returns {DocumentFragment}
 */
export const getFormatAndSchemaChoices = ({
  schemas, selectedSchema, hasKeyPath, preselectSchema, arbitraryJS = false
} = {}) => {
  const hasSchema = schemas && schemas.length;
  // eslint-disable-next-line @stylistic/max-len -- Long
  return /** @type {[optText: string, opts: {value: import('./formats.js').AvailableFormat, selected?: boolean}][]} */ ([
    ['JSON only', {value: 'json'}],
    ...(hasKeyPath
      ? []
      : [['IndexedDB key', {value: 'indexedDBKey'}]]),
    ['Structured Clone (via Typeson JSON)', {
      value: 'structuredCloning',
      selected: (!preselectSchema || !hasSchema) && !arbitraryJS
    }],
    ...(arbitraryJS
      ? [['Arbitrary JavaScript Object', {
        value: 'arbitraryJS',
        selected: !preselectSchema || !hasSchema
      }]]
      : []),
    ...(hasSchema
      ? schemas.map((schema, idx) => {
        return [`Schema: ${schema}`, {
          value: 'schema',
          dataset: {schema},
          selected: preselectSchema
            ? selectedSchema ? schema === selectedSchema : idx === 0
            : undefined
        }];
      })
      : [])
  ]).map(([optText, optAtts]) => {
    return jml('option', optAtts, [optText]);
  }).reduce((
    frag,
    option
  ) => {
    frag.append(option);
    return frag;
  }, document.createDocumentFragment());
};

/**
 * @callback SetValue
 * @param {import('./formats.js').StructuredCloneValue} value
 * @param {import('./types.js').StateObject} stateObj
 * @returns {Promise<void>}
 */

/**
 * @typedef {import('./formats/schema.js').ZodexSchema} ZodexSchema
 */

/**
 * Builds a selector and container for types.
 * @param {object} cfg
 * @param {string[]} [cfg.schemas] The schema names
 * @param {(schema: string) => Promise<ZodexSchema>} [cfg.getSchemaContent] The
 *    schema content retriever
 * @param {boolean} [cfg.hasValue] Set to `true` if you are supplying
 *   your own value. If `false` and `hasKeyPath` is `true`,
 *   will initialize with an object.
 * @param {boolean} [cfg.singleValue] (NOT IN USE)
 * @param {boolean} [cfg.hasKeyPath] If this is set (because there is a keyPath
 *   to be found within the object) and `hasValue` is true, an object type
 *   will be set and required at the root level. This option will also
 *   prevent selection of indexedDB key at root (since a key cannot be a
 *   plain object).
 * @param {boolean} [cfg.arbitraryJS] Whether to allow the choice of
 *   arbitrary JavaScript
 * @param {string} [cfg.typeNamespace] Used to prevent conflicts with other
 *   instances of typeChoices on the page
 * @param {string} [cfg.selectedSchema]
 * @param {import('./formats.js').default} [cfg.formats]
 * @param {import('./types.js').default} [cfg.types]
 * @param {boolean} [cfg.preselectSchema]
 * @returns {Promise<{
 *   formatChoices: FormatChoices,
 *   typesHolder: TypesHolder,
 *   domArray: [formatChoices: FormatChoices, typesHolder: TypesHolder],
 *   getValue: (stateObj: import('./types.js').StateObject,
 *     currentPath: string) => import('./formats.js').StructuredCloneValue,
 *   getType: () => string,
 *   validValuesSet: () => boolean,
 *   setValue: SetValue,
 *   formats: import('./formats.js').default,
 *   types: import('./types.js').default
 * }>} The selector for types and the container for them. Both should be
 *   added to the page.
 */
export async function formatAndTypeChoices ({
  schemas,
  getSchemaContent,
  hasValue,
  singleValue,
  hasKeyPath,
  arbitraryJS = false,
  preselectSchema = true,
  typeNamespace,
  selectedSchema,
  formats = new Formats(),
  types = new Types()
}) {
  const format = preselectSchema && schemas && schemas.length
    ? 'schema'
    : arbitraryJS
      ? 'arbitraryJS'
      : 'structuredCloning';
  const formatChoices = /** @type {FormatChoices} */ (jml('select', {
    class: 'formatChoices',
    hidden: singleValue,
    // is: 'main-type-choices',
    $custom: {
      /**
       * Sets the desired format and rebuilds the type choices.
       * @callback SetFormat
       * @param {{
       *   valueFormat?: import('./formats.js').AvailableFormat,
       *   autoTrigger: boolean,
       *   schema?: string
       * }} cfg
       * @this {HTMLSelectElement & {
       *   $buildTypeChoices: TypeChoiceBuilder
       * }}
       * @returns {Promise<void>}
       */

      /**
       * Rebuilds the type choices.
       * @callback TypeChoiceBuilder
       * @param {boolean} [autoTrigger]
       * @this {HTMLSelectElement & {
       *   $buildTypeChoices: TypeChoiceBuilder
       * }}
       * @returns {Promise<void>}
       */

      /**
       * @typedef {HTMLSelectElement & {
       *   $setFormat: SetFormat,
       *   $buildTypeChoices: TypeChoiceBuilder
       * }} FormatChoices
       */

      /**
       * @type {SetFormat}
       */
      async $setFormat ({valueFormat, autoTrigger, schema}) {
        if (schema) {
          const idx = [...this.options].findIndex((option) => {
            return option.dataset.schema === schema;
          });
          this.selectedIndex = idx === -1 ? 0 : idx;
        } else if (valueFormat) {
          this.value = valueFormat;
        }
        await this.$buildTypeChoices(autoTrigger);
      },

      /**
       * @type {TypeChoiceBuilder}
       */
      async $buildTypeChoices (autoTrigger) {
        DOM.removeChildren(typesHolder);
        const {schema} = this.selectedOptions[0].dataset;
        jml({'#': buildTypeChoices({
          autoTrigger,
          topRoot: /** @type {HTMLDivElement} */ (
            $e(typesHolder, 'div[data-type]')
          ),
          // resultType: 'both',
          format: /** @type {import('./formats.js').AvailableFormat} */ (
            this.value
          ),
          formats,
          types,
          typeNamespace,
          requireObject: hasKeyPath,
          objectHasValue: hasValue,
          schema,
          schemaContent: schema
            ? await getSchemaContent?.(
              /** @type {string} */ (schema)
            )
            : undefined
        }).domArray}, typesHolder);
      }
    },
    $on: {
      async change () {
        await /**
         * @type {HTMLSelectElement & {
         *   $buildTypeChoices: TypeChoiceBuilder
         * }}
         */ (
          this
        ).$buildTypeChoices();
      }
    }
  }, [getFormatAndSchemaChoices({
    schemas, hasKeyPath, selectedSchema, arbitraryJS, preselectSchema
  })]));

  /**
   * @callback TypeSelectGetter
   * @returns {HTMLSelectElement|null}
   */

  /**
   * @typedef {HTMLDivElement} TypesHolder
   * @property {TypeRootGetter} $getTypeRoot
   * @property {TypeSelectGetter} $getTypeSelect
   */

  const typesHolder = (
    jml('div', {class: 'typesHolder', $custom: {
      /**
       * @type {TypeRootGetter}
       * @this {HTMLDivElement}
       */
      $getTypeRoot () {
        return /** @type {HTMLDivElement} */ ($e(this, 'div[data-type]'));
      },
      /**
       * @type {TypeSelectGetter}
       * @this {HTMLSelectElement}
       */
      $getTypeSelect () {
        return /** @type {HTMLSelectElement} */ (
          $e(this, `.typeChoices-${typeNamespace}`)
        );
      }
    }})
  );

  const schema = format === 'schema'
    ? formatChoices.selectedOptions[0].dataset.schema
    : undefined;

  jml({'#': buildTypeChoices({
    // resultType: 'both',
    topRoot: /** @type {HTMLDivElement} */ ($e(typesHolder, 'div[data-type]')),
    format,
    formats,
    types,
    typeNamespace,
    requireObject: hasKeyPath,
    objectHasValue: hasValue,
    schema,
    schemaContent: schema === undefined
      ? undefined
      : await getSchemaContent?.(/** @type {string} */ (schema))
  }).domArray}, typesHolder);

  return {
    formats,
    types,
    formatChoices,
    typesHolder,
    // Easier for Jamilih
    domArray: [formatChoices, typesHolder],

    // Normal API

    /**
     * @param {import('./types.js').StateObject} [stateObj] Will
     *   auto-set `typeNamespace` and `format`
     * @param {string} [currentPath]
     * @returns {import('./formats.js').StructuredCloneValue}
     */
    getValue (stateObj, currentPath) {
      // eslint-disable-next-line @stylistic/max-len -- Long
      const root = /** @type {HTMLDivElement & {$getTypeRoot: TypeRootGetter}} */ (
        typesHolder
      ).$getTypeRoot();
      return types.getValueForRoot(/** @type {HTMLDivElement} */ (root), {
        typeNamespace,
        format: /** @type {import('./formats.js').AvailableFormat} */ (
          formatChoices.value
        ),
        formats,
        types,
        ...stateObj
      }, currentPath);
    },

    /**
     * @returns {string}
     */
    getType () {
      // eslint-disable-next-line @stylistic/max-len -- Long
      const root = /** @type {HTMLDivElement & {$getTypeRoot: TypeRootGetter}} */ (
        typesHolder
      ).$getTypeRoot();
      return Types.getTypeForRoot(/** @type {HTMLDivElement} */ (root));
    },

    /**
     * @returns {boolean}
     */
    validValuesSet () {
      // eslint-disable-next-line @stylistic/max-len -- Long
      const root = /** @type {HTMLDivElement & {$getTypeRoot: TypeRootGetter}} */ (
        typesHolder
      ).$getTypeRoot();
      const form = /** @type {HTMLFormElement} */ (
        /** @type {Element} */ (root).closest('form')
      );
      return Types.validValuesSet({form, typeNamespace});
    },

    /** @type {SetValue} */
    async setValue (value, stateObj) {
      const rootEditUI = /** @type {HTMLDivElement} */ (
        (await formats.getControlsForFormatAndValue(
          types,
          /** @type {import('./formats.js').AvailableFormat} */ (
            formatChoices.value
          ),
          value,
          stateObj
        )).rootUI
      );
      const type = Types.getTypeForRoot(rootEditUI);
      // eslint-disable-next-line @stylistic/max-len -- Long
      const sel = /** @type {HTMLDivElement & {$getTypeSelect: TypeSelectGetter}} */ (
        typesHolder
      ).$getTypeSelect();
      // eslint-disable-next-line @stylistic/max-len -- Long
      /** @type {HTMLSelectElement & {$addTypeAndEditUI: import('./typeChoices.js').AddTypeAndEditUI}} */ (
        sel
      ).$addTypeAndEditUI({type, editUI: rootEditUI});
    }
  };
}

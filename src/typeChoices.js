import {jml} from '../vendor/jamilih/dist/jml-es.js';
import Formats from './formats.js';
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
 * @returns {[
 *   mainTypeChoices: MainTypeChoices,
 *   typesHolder: TypesHolder
 * ]} The selector for types and the container for them. Both should be
 *   added to the page.
 */
function typeChoices ({
  schema,
  schemaContent,
  hasValue,
  singleValue,
  hasKeyPath,
  typeNamespace
}) {
  const mainTypeChoices = jml('select', {
    class: 'mainTypeChoices',
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
       * @typedef {HTMLSelectElement} MainTypeChoices
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
        jml({'#': Formats.buildTypeChoices({
          topRoot: $e(typesHolder, 'div[data-type]'),
          resultType: 'both',
          format: this.value,
          typeNamespace,
          requireObject: hasKeyPath,
          objectHasValue: hasValue,
          schema,
          schemaContent
        })}, typesHolder);
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

  jml({'#': Formats.buildTypeChoices({
    resultType: 'both',
    topRoot: $e(typesHolder, 'div[data-type]'),
    format: 'structuredCloning',
    typeNamespace,
    requireObject: hasKeyPath,
    objectHasValue: hasValue,
    schema,
    schemaContent
  })}, typesHolder);

  return [mainTypeChoices, typesHolder];
}

export default typeChoices;

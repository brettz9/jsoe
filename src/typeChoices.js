import {jml} from '../vendor/jamilih/dist/jml-es.js';
import Formats from './formats.js';
import {$e, DOM} from './utils/templateUtils.js';

/**
 * @todo Compose from format metadata, so can make user customizable.
 * @param {object} cfg
 * @param {string} cfg.schema
 * @param {boolean} cfg.hasKeyPath
 * @returns {JamilihArray[]}
 */
export const getFormatAndSchemaChoices = ({schema, hasKeyPath}) => {
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
    return ['option', optAtts, [optText]];
  });
};

/**
 * Builds a selector and container for types.
 * @param {object} cfg
 * @param {string} cfg.schema The schema name
 * @param {object} cfg.schemaContent The schema content
 * @param {boolean} cfg.hasValue If false and `hasKeyPath` is `true`,
 *   will initialize with an object
 * @param {boolean} cfg.singleValue
 * @param {boolean} cfg.hasKeyPath
 * @param {string} cfg.typeNamespace
 * @returns {{
 *   mainTypeChoices: HTMLSelectElement,
 *   typesHolder: HTMLDivElement
 * }} The selector for types and the container for them
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
      $setFormat (valueFormat) {
        this.value = valueFormat;
        this.$buildTypeChoices();
      },
      $buildTypeChoices () {
        const typesHolder = this.nextElementSibling;
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
  }, getFormatAndSchemaChoices({schema, hasKeyPath}));
  const typesHolder = jml('div', {class: 'typesHolder', $custom: {
    $getTypeRoot () {
      return $e(this, 'div[data-type]');
    },
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

  return {mainTypeChoices, typesHolder};
}

export default typeChoices;

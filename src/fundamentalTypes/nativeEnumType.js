import {$e} from '../utils/templateUtils.js';
import {escapeRegex} from '../types.js';
import {jml} from '../vendor-imports.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const nativeEnumType = {
  option: ['Native enum'],
  stringRegex: /^nativeEnum\((.*)\)$/u,
  valueMatch (x) {
    return ['number', 'string'].includes(typeof x);
  },
  toValue (s, rootInfo) {
    const key = s.charAt(0) === '"' ? s.slice(1, -1) : Number(s);

    let schema = rootInfo?.schemaObject;
    /* istanbul ignore else -- Most likely is if */
    if (rootInfo?.schemaObject?.type === 'union') {
      const schemas = /** @type {import('zodex').SzUnion} */ (
        rootInfo.schemaObject
      ).options.filter((option) => {
        return option.type === 'nativeEnum';
      });
      schema = schemas.find((schema) => {
        return key in schema.values;
      });
    }
    const value = /** @type {import('zodex').SzNativeEnum} */ (schema)?.values[
      key
    ];
    return {value};
  },
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ ($e(root, 'input'));
  },
  setValue ({root, value}) {
    const input = /**
    * @type {HTMLInputElement & {
    *   $schemaNativeEnumValues: import('zodex').SzNativeEnum['values']
    * }}
    */ (this.getInput({root}));
    input.value = Object.entries(
      input.$schemaNativeEnumValues
    ).find(([, val]) => {
      return val === value;
    })?.[0] ?? '';
    /** @type {HTMLSpanElement} */ (
      $e(root, '.enumeratedValue')
    ).textContent = value;
  },
  getValue ({root}) {
    const {value, $schemaNativeEnumValues} =
      /**
       * @type {HTMLInputElement & {
       *   $schemaNativeEnumValues: import('zodex').SzNativeEnum['values']
       * }}
       */ (
        this.getInput({root})
      );

    return $schemaNativeEnumValues[value];
  },
  viewUI ({value, specificSchemaObject}) {
    return ['div', [
      'Native enum: ',
      ['span', {
        dataset: {type: 'nativeEnum'},
        title: specificSchemaObject?.description ?? '(a native enum)'
      }, [value]]
    ]];
  },
  editUI (info) {
    const {
      specificSchemaObject,
      value
      // typeNamespace
    } = info;
    const schemaNativeEnumValues = /** @type {import('zodex').SzNativeEnum} */ (
      specificSchemaObject
    )?.values;
    const nativeEnumKeys = Object.keys(schemaNativeEnumValues);

    let keyForValue;
    if (schemaNativeEnumValues && 'value' in info) {
      keyForValue = Object.entries(schemaNativeEnumValues).find(([, val]) => {
        return val === value;
      })?.[0];
    }

    const nativeEnumPattern = nativeEnumKeys.map((nativeEnumKey) => {
      // Zod seems to prohibit numerically-indexed strings so we prevent here,
      //   but it seems the generated JavaScript allows them (?)
      if (
        (/^\d$/u).test(nativeEnumKey) &&
        Object.values(schemaNativeEnumValues).includes(
          Number.parseInt(nativeEnumKey)
        )
      ) {
        return null;
      }
      return escapeRegex(nativeEnumKey);
    }).filter(Boolean).join('|');

    const input =
      /**
       * @type {HTMLInputElement & {
       *   $schemaNativeEnumValues: import('zodex').SzNativeEnum['values']
       * }}
       */ (jml(
        'input',
        /** @type {import('jamilih').JamilihAttributes} */ ({
          class: 'nativeEnumKey',
          placeholder: nativeEnumPattern,
          title: nativeEnumPattern,
          // Implicitly already wrapped by HTML in `^(?:...)$`
          pattern: nativeEnumPattern,
          value: keyForValue ?? '',
          $on: {
            input () {
              const ev = /** @type {HTMLSpanElement} */ (
                this.parentElement?.parentElement?.querySelector(
                  '.enumeratedValue'
                )
              );
              ev.textContent = String(schemaNativeEnumValues[
                /** @type {HTMLInputElement} */
                (this).value
              ] ?? '');
            }
          }
        })
      ));
    input.$schemaNativeEnumValues = schemaNativeEnumValues;

    return ['div', {
      dataset: {type: 'nativeEnum'},
      title: specificSchemaObject?.description ?? 'Native Enum'
    }, [
      ['label', [
        'Enumerated key ',
        input
      ]],
      ['br'],
      'Enumerated value: ',
      ['span', {
        class: 'enumeratedValue'
      }, [
        value ?? ''
      ]]
    ]];
  }
};

export default nativeEnumType;

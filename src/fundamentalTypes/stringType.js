import {datetimeRegex} from 'zod';
import {$e} from '../utils/templateUtils.js';

// Adapted from Zod: https://github.com/colinhacks/zod/blob/9257ab78eec366c04331a3c2d59deb344a02d9f6/src/types.ts
const ipv4Regex =
  /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u;
const ipv6Regex =
  /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/u;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const base64Regex =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/u;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const emojiRegexStr = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
const emojiRegex = new RegExp(emojiRegexStr, 'u');
const cuidRegex = /^c[^\s-]{8,}$/iu;
const cuid2Regex = /^[0-9a-z]+$/u;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/iu;
const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/iu;
const nanoidRegex = /^[a-z0-9_-]{21}$/iu;
const durationRegex =
  /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/u;
// End adapted from Zod

/**
 * @param {{precision?: number|null}} args
 * @returns {string}
 */
function timeRegexSource (args) {
  // let regex = `\\d{2}:\\d{2}:\\d{2}`;
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;

  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision === null || args.precision === undefined) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}

/**
 * @param {{
 *   offset?: boolean;
 *   local?: boolean;
 *   precision?: number|null;
 * }} args
 * @returns {RegExp}
 */
function timeRegex (args) {
  return new RegExp(`^${timeRegexSource(args)}$`, 'u');
}

/**
 * @type {import('../types.js').TypeObject}
 */
const stringType = {
  option: ['String'],
  stringRegex: /^"(?:[^\\"]|\\\\|\\")*"$/u,
  valueMatch (x) {
    return typeof x === 'string';
  },
  toValue (s) {
    return {value: s.slice(1, -1)};
  },
  getInput ({root}) {
    return /** @type {HTMLTextAreaElement} */ (
      $e(root, '[data-type="string"] > textarea,input')
    );
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  getValue ({root}) {
    return this.getInput({root}).value;
  },
  viewUI ({value, specificSchemaObject}) {
    const kind = /** @type {import('zodex').SzString} */ (
      specificSchemaObject
    // @ts-expect-error Does exist
    )?.kind;
    return ['span', {
      dataset: {type: 'string'},
      title: specificSchemaObject?.description ??
        (kind === 'email'
          ? `(an ${kind} string)`
          : kind
            ? `(a ${kind} string)` // url, date
            : '(s string)')
    }, [value]];
  },
  editUI ({typeNamespace, specificSchemaObject, value = ''}) {
    const stringSchemaObject = /** @type {import('zodex').SzString} */ (
      specificSchemaObject
    );
    // @ts-expect-error Does exist
    const kind = stringSchemaObject?.kind;
    const isLiteral = specificSchemaObject?.type === 'literal';
    const minlength = stringSchemaObject?.min ?? stringSchemaObject?.length;
    const maxlength = stringSchemaObject?.max ?? stringSchemaObject?.length;

    const startsWith = stringSchemaObject?.startsWith;
    const endsWith = stringSchemaObject?.endsWith;

    const toLowerCase = stringSchemaObject?.toLowerCase;
    const toUpperCase = stringSchemaObject?.toUpperCase;
    const trim = stringSchemaObject?.trim;

    // @ts-expect-error It is indeed potentially present
    const includes = stringSchemaObject?.includes;
    // @ts-expect-error It is indeed potentially present
    const position = stringSchemaObject?.position;

    // @ts-expect-error It is indeed potentially present
    const regex = stringSchemaObject?.regex;
    // @ts-expect-error It is indeed potentially present
    const flags = stringSchemaObject?.flags;

    /**
     * @param {string} value
     */
    const checkValue = (value) => {
      if (startsWith && !value.startsWith(startsWith)) {
        return `Value doesn't start with expected: ${startsWith}`;
      }
      if (endsWith && !value.endsWith(endsWith)) {
        return `Value doesn't end with expected: ${endsWith}`;
      }
      if (includes && !value.includes(includes, position ?? 0)) {
        return `Value doesn't include the expected: ${includes}${
          position ? ` after position: ${position}` : ''
        }`;
      }
      if (regex && !(new RegExp(regex, flags ?? '')).test(value)) {
        return `Value doesn't match regular expression: ${regex}${
          flags ? ` with flags: ${flags}` : ''
        }`;
      }
      if (kind) {
        switch (kind) {
        case 'ip':
          // @ts-expect-error Is present
          switch (stringSchemaObject?.version) {
          case 'v4':
            if (!ipv4Regex.test(value)) {
              return `Value doesn't match IP v4 pattern.`;
            }
            break;
          default:
            if (!ipv6Regex.test(value)) {
              return `Value doesn't match IP v6 pattern.`;
            }
          }
          break;
        case 'time':
          // @ts-expect-error It is present
          if (!timeRegex(stringSchemaObject).test(value)) {
            return `Value does not match time/precision.`;
          }
          break;
        case 'datetime':
          // @ts-expect-error It is present
          if (!datetimeRegex(stringSchemaObject).test(value)) {
            return `Value does not match datetime/precision/offset/local`;
          }
          break;
        case 'emoji':
          if (!emojiRegex.test(value)) {
            return `Value does not match emoji pattern`;
          }
          break;
        case 'uuid':
          if (!uuidRegex.test(value)) {
            return `Value does not match uuid pattern`;
          }
          break;
        case 'nanoid':
          if (!nanoidRegex.test(value)) {
            return `Value does not match nanoid pattern`;
          }
          break;
        case 'cuid':
          if (!cuidRegex.test(value)) {
            return `Value does not match cuid pattern`;
          }
          break;
        case 'cuid2':
          if (!cuid2Regex.test(value)) {
            return `Value does not match cuid2 pattern`;
          }
          break;
        case 'ulid':
          if (!ulidRegex.test(value)) {
            return `Value does not match ulid pattern`;
          }
          break;
        case 'duration':
          if (!durationRegex.test(value)) {
            return `Value does not match duration pattern`;
          }
          break;
        case 'base64':
          if (!base64Regex.test(value)) {
            return `Value does not match base64 pattern`;
          }
          break;
        default:
          // 'email'|'url'|'date' should already be handled by the input element
          break;
        }
      }
      return null;
    };

    /**
     * @param {string} value
     */
    const transform = (value) => {
      if (toLowerCase) {
        value = value.toLowerCase();
      }
      if (toUpperCase) {
        value = value.toUpperCase();
      }
      if (trim) {
        value = value.trim();
      }
      return value;
    };

    return ['div', {dataset: {type: 'string'}}, [
      [
        // There is a `time` and `datetime-local` but they don't
        //    support milliseconds
        'email', 'url', 'date'
      ].includes(kind)
        ? ['input', {
          $on: {
            change () {
              const that = /** @type {HTMLInputElement} */ (this);
              that.value = transform(that.value);
              const message = checkValue(that.value);
              that.setCustomValidity(message ?? '');
              that.reportValidity();
            }
          },
          name: `${typeNamespace}-string`,
          type: kind,
          value: specificSchemaObject?.defaultValue ?? value,

          // Form doesn't support for date
          minlength: kind === 'date' ? undefined : minlength,
          maxlength: kind === 'date' ? undefined : maxlength
        }]
        : ['textarea', {
          $on: {
            change () {
              const that = /** @type {HTMLTextAreaElement} */ (this);
              that.value = transform(that.value);
              const message = checkValue(that.value);
              that.setCustomValidity(message ?? '');
              that.reportValidity();
            }
          },
          name: `${typeNamespace}-string`,
          disabled: isLiteral,
          minlength, maxlength
        }, [
          isLiteral
            ? specificSchemaObject?.value
            : (specificSchemaObject?.defaultValue ?? value)
        ]]
    ]];
  }
};

export default stringType;

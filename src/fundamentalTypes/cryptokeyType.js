import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const cryptokeyType = {
  option: ['CryptoKey'],
  stringRegex: /^CryptoKey\((.*)\)$/u,
  toValue (s) {
    const obj = JSON.parse(s);
    const {
      jwk, algorithm, usages
    } = /**
      * @type {{
      *   jwk: JsonWebKey,
      *   algorithm: KeyAlgorithm,
      *   usages: KeyUsage[]
      * }}
      */ (obj);
    return {value: crypto.subtle.importKey(
      'jwk', jwk, algorithm, true, usages
    )};
  },
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  setValue ({root, value}) {
    this.getInput({root}).value = String(value);
  },
  getValue ({root}) {
    return this.getInput({root}).value;
  },
  viewUI ({value}) {
    return ['i', {dataset: {type: 'cryptokey'}}, [`${String(value)}n`]];
  },
  editUI ({typeNamespace, value = ''}) {
    return ['div', {dataset: {type: 'cryptokey'}}, [
      ['label', [
        'Algorithm',
        ['input', {
          name: `${typeNamespace}-cryptokey-algorithm`,
          value
        }]
      ]],
      ['label', [
        'Usages'
        // "decrypt"|"deriveBits"|"deriveKey"|"encrypt"|"sign"|
        //  "unwrapKey"|"verify"|"wrapKey"
      ]]

      /*
      alg?: string;
      crv?: string;
      d?: string;
      dp?: string;
      dq?: string;
      e?: string;
      ext?: boolean;
      k?: string;
      key_ops?: string[];
      kty?: string;
      n?: string;
      p?: string;
      q?: string;
      qi?: string;
      use?: string;
      x?: string;
      y?: string;

      oth?: {
          d?: string;
          r?: string;
          t?: string;
      }[];
      */
    ]];
  }
};

export default cryptokeyType;

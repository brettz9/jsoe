import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const dompointType = {
  option: ['DOMPoint'],
  stringRegex: /^DOMPoint\((.*)\)$/u,
  toValue (s) {
    const {x, y, z, w} = JSON.parse(s);
    return {value: new DOMPoint(x, y, z, w)};
  },
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input'));
  },
  setValue ({root, value}) {
    /** @type {HTMLInputElement} */ (
      $e(root, '.x')
    ).value = String(value.x);
    /** @type {HTMLInputElement} */ (
      $e(root, '.y')
    ).value = String(value.y);
    /** @type {HTMLInputElement} */ (
      $e(root, '.z')
    ).value = String(value.z);
    /** @type {HTMLInputElement} */ (
      $e(root, '.w')
    ).value = String(value.w);
  },
  getValue ({root}) {
    const x = Number(/** @type {HTMLInputElement} */ (
      $e(root, '.x')
    ).value);
    const y = Number(/** @type {HTMLInputElement} */ (
      $e(root, '.y')
    ).value);
    const z = Number(/** @type {HTMLInputElement} */ (
      $e(root, '.z')
    ).value);
    const w = Number(/** @type {HTMLInputElement} */ (
      $e(root, '.w')
    ).value);
    return new DOMPoint(x, y, z, w);
  },
  viewUI ({value}) {
    return ['div', {dataset: {type: 'dompoint'}}, [
      ['b', {class: 'emphasis'}, ['DOMPoint']],
      ['br'],
      ['b', ['x ']],
      value.x,
      ['br'],
      ['b', ['y ']],
      value.y,
      ['br'],
      ['b', ['z ']],
      value.z,
      ['br'],
      ['b', ['w ']],
      value.w
    ]];
  },
  editUI ({typeNamespace, value = {
    x: '',
    y: '',
    z: '',
    w: ''
  }}) {
    // eslint-disable-next-line @stylistic/max-len -- Long
    return ['div', {dataset: {type: 'dompoint'}}, /** @type {import('jamilih').JamilihChildren} */ ([
      ['label', [
        'x: ',
        ['input', {
          class: 'x',
          name: `${typeNamespace}-dompoint-x`, value: value.x
        }]
      ]],
      ['br'],
      ['label', [
        'y: ',
        ['input', {
          class: 'y',
          name: `${typeNamespace}-dompoint-y`, value: value.y
        }]
      ]],
      ['br'],
      ['label', [
        'z: ',
        ['input', {
          class: 'z',
          name: `${typeNamespace}-dompoint-z`, value: value.z
        }]
      ]],
      ['br'],
      ['label', [
        'w: ',
        ['input', {
          class: 'w',
          name: `${typeNamespace}-dompoint-w`, value: value.w
        }]
      ]]
    ])];
  }
};

export default dompointType;

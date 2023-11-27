import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const domrectType = {
  option: ['DOMRect'],
  stringRegex: /^DOMRect\((.*)\)$/u,
  toValue (s) {
    const {x, y, width, height} = JSON.parse(s);
    return {value: new DOMRect(x, y, width, height)};
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
      $e(root, '.width')
    ).value = String(value.width);
    /** @type {HTMLInputElement} */ (
      $e(root, '.height')
    ).value = String(value.height);
  },
  getValue ({root}) {
    const x = Number(/** @type {HTMLInputElement} */ (
      $e(root, '.x')
    ).value);
    const y = Number(/** @type {HTMLInputElement} */ (
      $e(root, '.y')
    ).value);
    const width = Number(/** @type {HTMLInputElement} */ (
      $e(root, '.width')
    ).value);
    const height = Number(/** @type {HTMLInputElement} */ (
      $e(root, '.height')
    ).value);
    return new DOMRect(x, y, width, height);
  },
  viewUI ({value}) {
    return ['div', {dataset: {type: 'domrect'}}, [
      ['b', {class: 'emphasis'}, ['DOMRect']],
      ['br'],
      ['b', ['x ']],
      value.x,
      ['br'],
      ['b', ['y ']],
      value.y,
      ['br'],
      ['b', ['width ']],
      value.width,
      ['br'],
      ['b', ['height ']],
      value.height
    ]];
  },
  editUI ({typeNamespace, value = {
    x: '',
    y: '',
    width: '',
    height: ''
  }}) {
    // eslint-disable-next-line @stylistic/max-len -- Long
    return ['div', {dataset: {type: 'domrect'}}, /** @type {import('jamilih').JamilihChildren} */ ([
      ['label', [
        'x: ',
        ['input', {
          class: 'x',
          name: `${typeNamespace}-domrect-x`, value: value.x
        }]
      ]],
      ['br'],
      ['label', [
        'y: ',
        ['input', {
          class: 'y',
          name: `${typeNamespace}-domrect-y`, value: value.y
        }]
      ]],
      ['br'],
      ['label', [
        'width: ',
        ['input', {
          class: 'width',
          name: `${typeNamespace}-domrect-width`, value: value.width
        }]
      ]],
      ['br'],
      ['label', [
        'height: ',
        ['input', {
          class: 'height',
          name: `${typeNamespace}-domrect-height`, value: value.height
        }]
      ]]
    ])];
  }
};

export default domrectType;

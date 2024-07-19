import {$e} from '../utils/templateUtils.js';
import {toStringTag} from '../vendor-imports.js';

let idx = 0;

/**
 * @type {import('../types.js').SuperTypeObject}
 */
const domrectType = {
  option: ['DOMRect'],
  childTypes: ['domrectreadonly'],
  stringRegex: /^(?<domRectClass>DOMRect|DOMRectReadOnly)\((?<innerContent>.*)\)$/u,
  toValue (s, rootInfo) {
    const {groups: {
      domRectClass
    /* istanbul ignore next -- Should always be found */
    } = {}} = /** @type {RegExpMatchArray} */ (
      /** @type {import('../types.js').RootInfo} */ (rootInfo).match
    );
    const {x, y, width, height} = JSON.parse(s);
    return {
      value: new (
        domRectClass === 'DOMRect' ? DOMRect : DOMRectReadOnly
      )(x, y, width, height)};
  },
  getInput ({root}) {
    return /** @type {HTMLInputElement} */ ($e(root, 'input:not([type])'));
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

    if (toStringTag(value) === 'DOMRect') {
      /** @type {HTMLInputElement} */ (
        $e(root, '.domrect-readonly-readwrite')
      ).checked = true;
    } else {
      /** @type {HTMLInputElement} */ (
        $e(root, '.domrect-readonly-readonly')
      ).checked = true;
    }
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

    const isReadWrite = /** @type {HTMLInputElement} */ (
      $e(root, '.domrect-readonly-readwrite')
    ).checked;
    return new (isReadWrite ? DOMRect : DOMRectReadOnly)(x, y, width, height);
  },
  viewUI ({value, specificSchemaObject}) {
    const isReadWrite = toStringTag(value) === 'DOMRect';
    return ['div', {dataset: {type: 'domrect'}}, [
      ['b', {
        class: 'emphasis',
        title: specificSchemaObject?.description
          ? `(a \`${(isReadWrite ? 'DOMRect' : 'DOMRectReadOnly')}\`)`
          : undefined
      }, [
        specificSchemaObject?.description ??
          (isReadWrite ? 'DOMRect' : 'DOMRectReadOnly')
      ]],
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
    idx++;
    // eslint-disable-next-line @stylistic/max-len -- Long
    return ['div', {dataset: {type: 'domrect'}}, /** @type {import('jamilih').JamilihChildren} */ ([
      ['div', [
        ['label', [
          ['input', {
            type: 'radio',
            class: 'domrect-readonly-readwrite',
            name: `${typeNamespace}-domrect-readonly-${idx}`,
            value: 'readwrite',
            checked: toStringTag(value) !== 'DOMRectReadOnly'
          }],
          'Readwrite'
        ]],
        ' ',
        ['label', [
          ['input', {
            type: 'radio',
            class: 'domrect-readonly-readonly',
            name: `${typeNamespace}-domrect-readonly-${idx}`,
            value: 'readonly',
            checked: toStringTag(value) === 'DOMRectReadOnly'
          }],
          'Read-only'
        ]]
      ]],
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

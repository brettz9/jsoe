
const nbsp = '\u00A0';
const upArrow = '\u2191';
const downArrow = '\u2193';
const U = {nbsp, upArrow, downArrow};

/**
 * @param {string} sel
 * @returns {Element|null}
 */
const $ = (sel) => document.querySelector(sel);

/**
 * @param {string} sel
 * @returns {Element[]}
 */
const $$ = (sel) => [...document.querySelectorAll(sel)];

/**
 * @param {Element|string} el
 * @param {string} descendentsSel
 * @returns {HTMLElement|null}
 */
const $e = (el, descendentsSel) => {
  const elem = typeof el === 'string' ? $(el) : el;
  if (!elem) {
    return null;
  }
  return elem.querySelector(descendentsSel);
};

/**
 * @param {Element|string} el
 * @param {string} descendentsSel
 * @returns {Element[]}
 */
const $$e = (el, descendentsSel) => {
  const elem = typeof el === 'string' ? $(el) : el;
  if (!elem) {
    return [];
  }
  return [...elem.querySelectorAll(descendentsSel)];
};

/**
 * @param {Node} node
 * @returns {void}
 */
const removeChildren = (node) => {
  const nde = typeof node === 'string' ? $(node) : node;
  if (!nde) {
    throw new Error('Node not found!');
  }
  while (nde.hasChildNodes()) {
    nde.lastChild?.remove();
  }
};

/**
 * @param {Element|string} sel
 * @returns {void}
 */
const removeIfExists = (sel) => {
  const el = typeof sel === 'string' ? $(sel) : sel;
  if (el) {
    el.remove();
  }
};

/**
 * @param {Element} el
 * @param {string|string[]} selectors
 * @returns {Element[]}
 */
const filterChildElements = (el, selectors) => {
  /**
   * @param {Element} el
   * @param {string} sel
   * @returns {Element[]}
   */
  const getMatchingChildrenForElement = (el, sel) => {
    const childElements = el.children;
    const matchingChildElements = [...childElements].filter((el) => {
      return el.matches(sel);
    });
    return matchingChildElements;
  };
  const elem = typeof el === 'string' ? $(el) : el;
  if (!elem) {
    throw new Error('Element not found!');
  }
  let filtered = [elem];
  selectors = Array.isArray(selectors) ? selectors : [selectors];
  selectors.forEach((sel) => {
    filtered = filtered.reduce((els, childElement) => {
      if (!childElement) {
        return els;
      }
      els.push(...getMatchingChildrenForElement(childElement, sel));
      return els;
    }, /** @type {Element[]} */ ([]));
  });
  return filtered;
};

/**
 * @param {string} s
 * @returns {string}
 */
const initialCaps = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const DOM = {removeChildren, removeIfExists, filterChildElements, initialCaps};

export {
  U,
  $, $$,
  $e, $$e,
  DOM
};

/**
 * @param {unknown} obj
 */
export const isNullish = (obj) => {
  return obj === null || typeof obj === 'undefined';
};

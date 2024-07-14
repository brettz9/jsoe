/**
 * @typedef {any} ArbitraryObject
 */
/**
 * @typedef {{[key: string]: string|NestedObject}} NestedObject
 */

/**
 * @param {ArbitraryObject} obj
 * @returns {ArbitraryObject}
 */
export function copyObject (obj) {
  const newObj = Array.isArray(obj)
    ? /** @type {Array<ArbitraryObject> & {[key: string]: ArbitraryObject}} */ (
      []
    )
    : /** @type {NestedObject} */ ({});
  for (const [prop, val] of Object.entries(obj)) {
    newObj[prop] = val && typeof val === 'object' ? copyObject(val) : val;
  }
  return newObj;
}

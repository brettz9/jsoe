/**
 * @param {...string} args
 * @returns {string}
 */
const makeJSONPointer = (...args) => {
  return '#/' + args.map((path) => {
    return escapeJSONPointer(path);
  }).join('/');
};

/**
 * @param {string} path
 * @returns {string}
 */
const escapeJSONPointer = (path) => {
  return path.replace(/~/gu, '~0').replace(/\//gu, '~1');
};

/**
 * @param {string} pathPart
 * @returns {string}
 */
const unescapeJSONPointerPart = (pathPart) => {
  return pathPart.replace(/~([01])/gu, (_n0, n1) => {
    if (n1 === '0') {
      return '~';
    }
    return '/';
  });
};

/**
 * @param {string} path
 * @returns {string[]}
 */
const getJSONPointerParts = (path) => {
  return path.split('/').slice(1).map(
    (pathPart) => unescapeJSONPointerPart(pathPart)
  );
};

/**
 * @param {ArbitraryObject} obj
 * @param {string} pathPart
 * @returns {ArbitraryObject|string}
 */
const reduceJSONPointerParts = (obj, pathPart) => {
  if (!(pathPart in obj)) {
    throw new TypeError('Path part not found in object');
  }
  obj = obj[pathPart];
  return obj;
};

/**
 * @param {object} cfg
 * @param {string} cfg.path
 * @param {ArbitraryObject} cfg.obj
 * @returns {string|ArbitraryObject}
 */
const resolveJSONPointer = ({path, obj}) => {
  return getJSONPointerParts(path).reduce(
    (obj, pathPart) => reduceJSONPointerParts(obj, pathPart),
    obj
  );
};

/**
 * @param {string} path
 * @returns {string}
 */
const typesonPathToJSONPointer = (path) => {
  if (!path) {
    return path;
  }
  return '/' + path.split('.').map((keyPathComponent) => {
    // Keep `~0` (representing tilde) escaped as same sequence in
    //   JSONPointer (that's why we don't just use
    //   Typeson's `unescapeKeyPathComponent` + `escapeJSONPointer` here)
    return keyPathComponent.replace(/~1/gu, '.').replace(/\//gu, '~1');
  }).join('/');
};

export {
  makeJSONPointer, escapeJSONPointer,
  unescapeJSONPointerPart, getJSONPointerParts, reduceJSONPointerParts,
  resolveJSONPointer,
  typesonPathToJSONPointer
};

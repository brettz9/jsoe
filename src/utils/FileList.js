/**
 * @typedef {number} Integer
 */
/**
 * `FileList` polyfill.
 */
class FileList {
  /**
   * Set private properties and length.
   */
  constructor () {
    // eslint-disable-next-line prefer-rest-params -- Keep API
    this._files = arguments[0];
    this.length = this._files.length;
  }
  /**
   * @param {Integer} index
   * @returns {File}
   */
  item (index) {
    return this._files[index];
  }
  /* eslint-disable class-methods-use-this -- API */
  /**
   * @returns {"FileList"}
   */
  get [Symbol.toStringTag] () {
    /* eslint-enable class-methods-use-this -- API */
    return 'FileList';
  }
}
export default FileList;

import {
  makeJSONPointer, reduceJSONPointerParts
} from '../../../instrumented/utils/jsonPointer.js';
// import {
//   makeJSONPointer, reduceJSONPointerParts
// } from '../../../src/utils/jsonPointer.js'; // Test Cypress TS

describe('jsonPointer', function () {
  describe('`makeJSONPointer`', function () {
    it('makeJSONPointer creates a JSON pointer path', function () {
      expect(makeJSONPointer('ab', 'cd~', 'ef/')).to.equal(
        '#/ab/cd~0/ef~1'
      );
    });
  });
  describe('reduceJSONPointerParts', function () {
    it('throws if path part not found', function () {
      expect(() => {
        reduceJSONPointerParts({}, 'abc');
      }).to.throw('Path part not found in object');
    });
  });
});

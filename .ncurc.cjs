'use strict';

module.exports = {
  reject: [
    // todo[engine:node@>=20]: Can remove
    'rimraf',

    // todo: check for updates that may fix, but current 4.19.0 causes problems
    //        for instrumenting (the index-schema.html file won't load)
    'rollup'
  ]
};

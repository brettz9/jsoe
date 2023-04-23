function ownKeys(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n);}return r}function _objectSpread2(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(r),!0).forEach((function(t){_defineProperty(e,t,r[t]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ownKeys(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t));}));}return e}function _typeof(e){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,_toPropertyKey(n.key),n);}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function _defineProperty(e,t,r){return (t=_toPropertyKey(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _slicedToArray(e,t){return function _arrayWithHoles(e){if(Array.isArray(e))return e}(e)||function _iterableToArrayLimit(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a,i,c=[],s=!0,u=!1;try{if(a=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;s=!1;}else for(;!(s=(n=a.call(r)).done)&&(c.push(n.value),c.length!==t);s=!0);}catch(e){u=!0,o=e;}finally{try{if(!s&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(u)throw o}}return c}}(e,t)||_unsupportedIterableToArray(e,t)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _toConsumableArray(e){return function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}(e)||function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||_unsupportedIterableToArray(e)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return "Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function _toPropertyKey(e){var t=function _toPrimitive(e,t){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return ("string"===t?String:Number)(e)}(e,"string");return "symbol"==typeof t?t:String(t)}var e=_createClass((function TypesonPromise(e){_classCallCheck(this,TypesonPromise),this.p=new Promise(e);}));e.__typeson__type__="TypesonPromise","undefined"!=typeof Symbol&&(e.prototype[Symbol.toStringTag]="TypesonPromise"),e.prototype.then=function(t,r){var n=this;return new e((function(e,o){n.p.then((function(r){e(t?t(r):r);})).catch((function(e){return r?r(e):Promise.reject(e)})).then(e,o);}))},e.prototype.catch=function(e){return this.then(null,e)},e.resolve=function(t){return new e((function(e){e(t);}))},e.reject=function(t){return new e((function(e,r){r(t);}))},["all","race","allSettled"].forEach((function(t){e[t]=function(r){return new e((function(e,n){Promise[t](r.map((function(e){return e&&e.constructor&&"TypesonPromise"===e.constructor.__typeson__type__?e.p:e}))).then(e,n);}))};}));var t={}.toString,r={}.hasOwnProperty,n=Object.getPrototypeOf,o=r.toString;function isThenable(e,t){return isObject(e)&&"function"==typeof e.then&&(!t||"function"==typeof e.catch)}function toStringTag(e){return t.call(e).slice(8,-1)}function hasConstructorOf(e,t){if(!e||"object"!==_typeof(e))return !1;var a=n(e);if(!a)return null===t;var i=r.call(a,"constructor")&&a.constructor;return "function"!=typeof i?null===t:t===i||(null!==t&&o.call(i)===o.call(t)||"function"==typeof t&&"string"==typeof i.__typeson__type__&&i.__typeson__type__===t.__typeson__type__)}function isPlainObject(e){return !(!e||"Object"!==toStringTag(e))&&(!n(e)||hasConstructorOf(e,Object))}function isUserObject(e){if(!e||"Object"!==toStringTag(e))return !1;var t=n(e);return !t||(hasConstructorOf(e,Object)||isUserObject(t))}function isObject(e){return e&&"object"===_typeof(e)}function escapeKeyPathComponent(e){return e.replace(/''/g,"''''").replace(/^$/,"''").replace(/~/g,"~0").replace(/\./g,"~1")}function unescapeKeyPathComponent(e){return e.replace(/~1/g,".").replace(/~0/g,"~").replace(/^''$/,"").replace(/''''/g,"''")}function getByKeyPath(e,t){if(""===t)return e;var r=t.indexOf(".");if(r>-1){var n=e[unescapeKeyPathComponent(t.slice(0,r))];return void 0===n?void 0:getByKeyPath(n,t.slice(r+1))}return e[unescapeKeyPathComponent(t)]}function setAtKeyPath(e,t,r){if(""===t)return r;var n=t.indexOf(".");return n>-1?setAtKeyPath(e[unescapeKeyPathComponent(t.slice(0,n))],t.slice(n+1),r):(e[unescapeKeyPathComponent(t)]=r,e)}function getJSONType(e){return null===e?"null":Array.isArray(e)?"array":_typeof(e)}function _await(e,t,r){return r?t?t(e):e:(e&&e.then||(e=Promise.resolve(e)),t?e.then(t):e)}var a=Object.keys,i$1=Array.isArray,c={}.hasOwnProperty,s=["type","replaced","iterateIn","iterateUnsetNumeric"];function _async(e){return function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];try{return Promise.resolve(e.apply(this,t))}catch(e){return Promise.reject(e)}}}function nestedPathsFirst(e,t){if(""===e.keypath)return -1;var r=e.keypath.match(/\./g)||0,n=t.keypath.match(/\./g)||0;return r&&(r=r.length),n&&(n=n.length),r>n?-1:r<n?1:e.keypath<t.keypath?-1:e.keypath>t.keypath}var u=function(){function Typeson(e){_classCallCheck(this,Typeson),this.options=e,this.plainObjectReplacers=[],this.nonplainObjectReplacers=[],this.revivers={},this.types={};}return _createClass(Typeson,[{key:"stringify",value:function stringify(e,t,r,n){n=_objectSpread2(_objectSpread2(_objectSpread2({},this.options),n),{},{stringification:!0});var o=this.encapsulate(e,null,n);return i$1(o)?JSON.stringify(o[0],t,r):o.then((function(e){return JSON.stringify(e,t,r)}))}},{key:"stringifySync",value:function stringifySync(e,t,r,n){return this.stringify(e,t,r,_objectSpread2(_objectSpread2({throwOnBadSyncType:!0},n),{},{sync:!0}))}},{key:"stringifyAsync",value:function stringifyAsync(e,t,r,n){return this.stringify(e,t,r,_objectSpread2(_objectSpread2({throwOnBadSyncType:!0},n),{},{sync:!1}))}},{key:"parse",value:function parse(e,t,r){return r=_objectSpread2(_objectSpread2(_objectSpread2({},this.options),r),{},{parse:!0}),this.revive(JSON.parse(e,t),r)}},{key:"parseSync",value:function parseSync(e,t,r){return this.parse(e,t,_objectSpread2(_objectSpread2({throwOnBadSyncType:!0},r),{},{sync:!0}))}},{key:"parseAsync",value:function parseAsync(e,t,r){return this.parse(e,t,_objectSpread2(_objectSpread2({throwOnBadSyncType:!0},r),{},{sync:!1}))}},{key:"specialTypeNames",value:function specialTypeNames(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return r.returnTypeNames=!0,this.encapsulate(e,t,r)}},{key:"rootTypeName",value:function rootTypeName(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return r.iterateNone=!0,this.encapsulate(e,t,r)}},{key:"encapsulate",value:function encapsulate(t,r,n){var o=_async((function(t,r){return _await(Promise.all(r.map((function(e){return e[1].p}))),(function(n){return _await(Promise.all(n.map(_async((function(n){var a=!1,i=[],c=_slicedToArray(r.splice(0,1),1),s=_slicedToArray(c[0],7),u=s[0],p=s[2],l=s[3],y=s[4],f=s[5],h=s[6],v=_encapsulate(u,n,p,l,i,!0,h),b=hasConstructorOf(v,e);return function _invoke(e,t){var r=e();return r&&r.then?r.then(t):t(r)}((function(){if(u&&b)return _await(v.p,(function(e){y[f]=e;var r=o(t,i);return a=!0,r}))}),(function(e){return a?e:(u?y[f]=v:t=b?v.p:v,o(t,i))}))})))),(function(){return t}))}))})),u=(n=_objectSpread2(_objectSpread2({sync:!0},this.options),n)).sync,p=this,l={},y=[],f=[],h=[],v=!("cyclic"in n)||n.cyclic,b=n.encapsulateObserver,d=_encapsulate("",t,v,r||{},h);function finish(e){var t=Object.values(l);if(n.iterateNone)return t.length?t[0]:getJSONType(e);if(t.length){if(n.returnTypeNames)return _toConsumableArray(new Set(t));e&&isPlainObject(e)&&!c.call(e,"$types")?e.$types=l:e={$:e,$types:{$:l}};}else isObject(e)&&c.call(e,"$types")&&(e={$:e,$types:!0});return !n.returnTypeNames&&e}function _adaptBuiltinStateObjectProperties(e,t,r){Object.assign(e,t);var n=s.map((function(t){var r=e[t];return delete e[t],r}));r(),s.forEach((function(t,r){e[t]=n[r];}));}function _encapsulate(t,r,o,s,u,h,v){var d,_={},O=_typeof(r),j=b?function(n){var a=v||s.type||getJSONType(r);b(Object.assign(n||_,{keypath:t,value:r,cyclic:o,stateObj:s,promisesData:u,resolvingTypesonPromise:h,awaitingTypesonPromise:hasConstructorOf(r,e)},{type:a}));}:null;if(["string","boolean","number","undefined"].includes(O))return void 0===r||Number.isNaN(r)||r===Number.NEGATIVE_INFINITY||r===Number.POSITIVE_INFINITY||0===r?(d=s.replaced?r:replace(t,r,s,u,!1,h,j))!==r&&(_={replaced:d}):d=r,j&&j(),d;if(null===r)return j&&j(),r;if(o&&!s.iterateIn&&!s.iterateUnsetNumeric&&r&&"object"===_typeof(r)){var m=y.indexOf(r);if(!(m<0))return l[t]="#",j&&j({cyclicKeypath:f[m]}),"#"+f[m];!0===o&&(y.push(r),f.push(t));}var g,S=isPlainObject(r),P=i$1(r),T=(S||P)&&(!p.plainObjectReplacers.length||s.replaced)||s.iterateIn?r:replace(t,r,s,u,S||P,null,j);if(T!==r?(d=T,_={replaced:T}):""===t&&hasConstructorOf(r,e)?(u.push([t,r,o,s,void 0,void 0,s.type]),d=r):P&&"object"!==s.iterateIn||"array"===s.iterateIn?(g=new Array(r.length),_={clone:g}):(["function","symbol"].includes(_typeof(r))||"toJSON"in r||hasConstructorOf(r,e)||hasConstructorOf(r,Promise)||hasConstructorOf(r,ArrayBuffer))&&!S&&"object"!==s.iterateIn?d=r:(g={},s.addLength&&(g.length=r.length),_={clone:g}),j&&j(),n.iterateNone)return g||d;if(!g)return d;if(s.iterateIn){var w=function _loop(n){var a={ownKeys:c.call(r,n)};_adaptBuiltinStateObjectProperties(s,a,(function(){var a=t+(t?".":"")+escapeKeyPathComponent(n),i=_encapsulate(a,r[n],Boolean(o),s,u,h);hasConstructorOf(i,e)?u.push([a,i,Boolean(o),s,g,n,s.type]):void 0!==i&&(g[n]=i);}));};for(var A in r)w(A);j&&j({endIterateIn:!0,end:!0});}else a(r).forEach((function(n){var a=t+(t?".":"")+escapeKeyPathComponent(n);_adaptBuiltinStateObjectProperties(s,{ownKeys:!0},(function(){var t=_encapsulate(a,r[n],Boolean(o),s,u,h);hasConstructorOf(t,e)?u.push([a,t,Boolean(o),s,g,n,s.type]):void 0!==t&&(g[n]=t);}));})),j&&j({endIterateOwn:!0,end:!0});if(s.iterateUnsetNumeric){for(var C=r.length,k=function _loop2(n){if(!(n in r)){var a=t+(t?".":"")+n;_adaptBuiltinStateObjectProperties(s,{ownKeys:!1},(function(){var t=_encapsulate(a,void 0,Boolean(o),s,u,h);hasConstructorOf(t,e)?u.push([a,t,Boolean(o),s,g,n,s.type]):void 0!==t&&(g[n]=t);}));}},N=0;N<C;N++)k(N);j&&j({endIterateUnsetNumeric:!0,end:!0});}return g}function replace(e,t,r,n,o,a,i){for(var c=o?p.plainObjectReplacers:p.nonplainObjectReplacers,s=c.length;s--;){var y=c[s];if(y.test(t,r)){var f=y.type;if(p.revivers[f]){var h=l[e];l[e]=h?[f].concat(h):f;}return Object.assign(r,{type:f,replaced:!0}),!u&&y.replaceAsync||y.replace?(i&&i({replacing:!0}),_encapsulate(e,y[u||!y.replaceAsync?"replace":"replaceAsync"](t,r),v&&"readonly",r,n,a,f)):(i&&i({typeDetected:!0}),_encapsulate(e,t,v&&"readonly",r,n,a,f))}}return t}return h.length?u&&n.throwOnBadSyncType?function(){throw new TypeError("Sync method requested but async result obtained")}():Promise.resolve(o(d,h)).then(finish):!u&&n.throwOnBadSyncType?function(){throw new TypeError("Async method requested but sync result obtained")}():n.stringification&&u?[finish(d)]:u?finish(d):Promise.resolve(finish(d))}},{key:"encapsulateSync",value:function encapsulateSync(e,t,r){return this.encapsulate(e,t,_objectSpread2(_objectSpread2({throwOnBadSyncType:!0},r),{},{sync:!0}))}},{key:"encapsulateAsync",value:function encapsulateAsync(e,t,r){return this.encapsulate(e,t,_objectSpread2(_objectSpread2({throwOnBadSyncType:!0},r),{},{sync:!1}))}},{key:"revive",value:function revive(t,r){var n=t&&t.$types;if(!n)return t;if(!0===n)return t.$;var o=(r=_objectSpread2(_objectSpread2({sync:!0},this.options),r)).sync,c=[],s={},u=!0;n.$&&isPlainObject(n.$)&&(t=t.$,n=n.$,u=!1);var l=this;function executeReviver(e,t){var r=_slicedToArray(l.revivers[e]||[],1)[0];if(!r)throw new Error("Unregistered type: "+e);return o&&!("revive"in r)?t:r[o&&r.revive?"revive":!o&&r.reviveAsync?"reviveAsync":"revive"](t,s)}var y=[];function checkUndefined(e){return hasConstructorOf(e,p)?void 0:e}var f,h=function revivePlainObjects(){var r=[];if(Object.entries(n).forEach((function(e){var t=_slicedToArray(e,2),o=t[0],a=t[1];"#"!==a&&[].concat(a).forEach((function(e){_slicedToArray(l.revivers[e]||[null,{}],2)[1].plain&&(r.push({keypath:o,type:e}),delete n[o]);}));})),r.length)return r.sort(nestedPathsFirst).reduce((function reducer(r,n){var o=n.keypath,a=n.type;if(isThenable(r))return r.then((function(e){return reducer(e,{keypath:o,type:a})}));var i=getByKeyPath(t,o);if(hasConstructorOf(i=executeReviver(a,i),e))return i.then((function(e){var r=setAtKeyPath(t,o,e);r===e&&(t=r);}));var c=setAtKeyPath(t,o,i);c===i&&(t=c);}),void 0)}();return hasConstructorOf(h,e)?f=h.then((function(){return t})):(f=function _revive(t,r,o,s,l){if(!u||"$types"!==t){var f=n[t],h=i$1(r);if(h||isPlainObject(r)){var v=h?new Array(r.length):{};for(a(r).forEach((function(n){var a=_revive(t+(t?".":"")+escapeKeyPathComponent(n),r[n],o||v,v,n),i=function set(e){return hasConstructorOf(e,p)?v[n]=void 0:void 0!==e&&(v[n]=e),e};hasConstructorOf(a,e)?y.push(a.then((function(e){return i(e)}))):i(a);})),r=v;c.length;){var b=_slicedToArray(c[0],4),d=b[0],_=b[1],O=b[2],j=b[3],m=getByKeyPath(d,_);if(void 0===m)break;O[j]=m,c.splice(0,1);}}if(!f)return r;if("#"===f){var g=getByKeyPath(o,r.slice(1));return void 0===g&&c.push([o,r.slice(1),s,l]),g}return [].concat(f).reduce((function reducer(t,r){return hasConstructorOf(t,e)?t.then((function(e){return reducer(e,r)})):executeReviver(r,t)}),r)}}("",t,null),y.length&&(f=e.resolve(f).then((function(t){return e.all([t].concat(y))})).then((function(e){return _slicedToArray(e,1)[0]})))),isThenable(f)?o&&r.throwOnBadSyncType?function(){throw new TypeError("Sync method requested but async result obtained")}():hasConstructorOf(f,e)?f.p.then(checkUndefined):f:!o&&r.throwOnBadSyncType?function(){throw new TypeError("Async method requested but sync result obtained")}():o?checkUndefined(f):Promise.resolve(checkUndefined(f))}},{key:"reviveSync",value:function reviveSync(e,t){return this.revive(e,_objectSpread2(_objectSpread2({throwOnBadSyncType:!0},t),{},{sync:!0}))}},{key:"reviveAsync",value:function reviveAsync(e,t){return this.revive(e,_objectSpread2(_objectSpread2({throwOnBadSyncType:!0},t),{},{sync:!1}))}},{key:"register",value:function register(e,t){var r=this;t=t||{};var n=function R(e){i$1(e)?e.forEach((function(e){return R(e)})):e&&a(e).forEach((function(n){if("#"===n)throw new TypeError("# cannot be used as a type name as it is reserved for cyclic objects");if(l.includes(n))throw new TypeError("Plain JSON object types are reserved as type names");var o=e[n],a=o&&o.testPlainObjects?r.plainObjectReplacers:r.nonplainObjectReplacers,c=a.filter((function(e){return e.type===n}));if(c.length&&(a.splice(a.indexOf(c[0]),1),delete r.revivers[n],delete r.types[n]),"function"==typeof o){var s=o;o={test:function test(e){return e&&e.constructor===s},replace:function replace(e){return _objectSpread2({},e)},revive:function revive(e){return Object.assign(Object.create(s.prototype),e)}};}else if(i$1(o)){var u=_slicedToArray(o,3);o={test:u[0],replace:u[1],revive:u[2]};}if(o&&o.test){var p={type:n,test:o.test.bind(o)};o.replace&&(p.replace=o.replace.bind(o)),o.replaceAsync&&(p.replaceAsync=o.replaceAsync.bind(o));var y="number"==typeof t.fallback?t.fallback:t.fallback?0:Number.POSITIVE_INFINITY;if(o.testPlainObjects?r.plainObjectReplacers.splice(y,0,p):r.nonplainObjectReplacers.splice(y,0,p),o.revive||o.reviveAsync){var f={};o.revive&&(f.revive=o.revive.bind(o)),o.reviveAsync&&(f.reviveAsync=o.reviveAsync.bind(o)),r.revivers[n]=[f,{plain:o.testPlainObjects}];}r.types[n]=o;}}));};return [].concat(e).forEach((function(e){return n(e)})),this}}]),Typeson}(),p=_createClass((function Undefined(){_classCallCheck(this,Undefined);}));p.__typeson__type__="TypesonUndefined";var l=["null","boolean","number","string","array","object"];

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2017 Brett Zamir, 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; // Use a lookup table to find the index.

var lookup = new Uint8Array(256);

for (var i = 0; i < chars.length; i++) {
  lookup[chars.codePointAt(i)] = i;
}
/**
 * @param {ArrayBuffer} arraybuffer
 * @param {Integer} byteOffset
 * @param {Integer} lngth
 * @returns {string}
 */


var encode = function encode(arraybuffer, byteOffset, lngth) {
  if (lngth === null || lngth === undefined) {
    lngth = arraybuffer.byteLength; // Needed for Safari
  }

  var bytes = new Uint8Array(arraybuffer, byteOffset || 0, // Default needed for Safari
  lngth);
  var len = bytes.length;
  var base64 = '';

  for (var _i = 0; _i < len; _i += 3) {
    base64 += chars[bytes[_i] >> 2];
    base64 += chars[(bytes[_i] & 3) << 4 | bytes[_i + 1] >> 4];
    base64 += chars[(bytes[_i + 1] & 15) << 2 | bytes[_i + 2] >> 6];
    base64 += chars[bytes[_i + 2] & 63];
  }

  if (len % 3 === 2) {
    base64 = base64.slice(0, -1) + '=';
  } else if (len % 3 === 1) {
    base64 = base64.slice(0, -2) + '==';
  }

  return base64;
};
/**
 * @param {string} base64
 * @returns {ArrayBuffer}
 */

var decode = function decode(base64) {
  var len = base64.length;
  var bufferLength = base64.length * 0.75;
  var p = 0;
  var encoded1, encoded2, encoded3, encoded4;

  if (base64[base64.length - 1] === '=') {
    bufferLength--;

    if (base64[base64.length - 2] === '=') {
      bufferLength--;
    }
  }

  var arraybuffer = new ArrayBuffer(bufferLength),
      bytes = new Uint8Array(arraybuffer);

  for (var _i2 = 0; _i2 < len; _i2 += 4) {
    encoded1 = lookup[base64.codePointAt(_i2)];
    encoded2 = lookup[base64.codePointAt(_i2 + 1)];
    encoded3 = lookup[base64.codePointAt(_i2 + 2)];
    encoded4 = lookup[base64.codePointAt(_i2 + 3)];
    bytes[p++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }

  return arraybuffer;
};

const arraybuffer = {
    arraybuffer: {
        test (x) { return toStringTag(x) === 'ArrayBuffer'; },
        replace (b, stateObj) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const index = stateObj.buffers.indexOf(b);
            if (index > -1) {
                return {index};
            }
            stateObj.buffers.push(b);
            return encode(b);
        },
        revive (b64, stateObj) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            if (typeof b64 === 'object') {
                return stateObj.buffers[b64.index];
            }
            const buffer = decode(b64);
            stateObj.buffers.push(buffer);
            return buffer;
        }
    }
};

// See also typed-arrays!

/* globals BigInt */

const bigintObject = {
    bigintObject: {
        test (x) {
            return typeof x === 'object' && hasConstructorOf(x, BigInt);
        },
        replace: String,
        revive (s) {
            // Filed this to avoid error: https://github.com/eslint/eslint/issues/11810
            // eslint-disable-next-line no-new-object
            return new Object(BigInt(s));
        }
    }
};

/* globals BigInt */

const bigint = {
    bigint: {
        test (x) {
            return typeof x === 'bigint';
        },
        replace: String,
        revive: BigInt
    }
};

/**
 * Not currently in use internally, but provided for parity.
 * @param {ArrayBuffer} buf
 * @returns {Uint8Array}
 */

/**
 *
 * @param {string} str
 * @returns {ArrayBuffer}
 */
function string2arraybuffer (str) {
    /*
    // UTF-8 approaches
    const utf8 = unescape(encodeURIComponent(str));
    const arr = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
        arr[i] = utf8.charCodeAt(i);
    }
    return arr.buffer;

    const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        // surrogate pair
        } else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10) |
                (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18),
                0x80 | ((charcode >> 12) & 0x3f),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
    */
    /*
    // Working UTF-16 options (equivalents)
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
    */

    const array = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        // eslint-disable-next-line max-len -- Long
        // eslint-disable-next-line unicorn/prefer-code-point -- Iterating char. codes
        array[i] = str.charCodeAt(i); // & 0xff;
    }
    return array.buffer;
}

/* globals XMLHttpRequest, Blob, FileReader */

const blob = {
    blob: {
        test (x) { return toStringTag(x) === 'Blob'; },
        replace (b) { // Sync
            const req = new XMLHttpRequest();
            req.overrideMimeType('text/plain; charset=x-user-defined');
            req.open('GET', URL.createObjectURL(b), false); // Sync
            req.send();

            // Seems not feasible to accurately simulate
            /* c8 ignore next 3 */
            if (req.status !== 200 && req.status !== 0) {
                throw new Error('Bad Blob access: ' + req.status);
            }
            return {
                type: b.type,
                stringContents: req.responseText
            };
        },
        revive ({type, stringContents}) {
            return new Blob([string2arraybuffer(stringContents)], {type});
        },
        replaceAsync (b) {
            return new e((resolve, reject) => {
                /*
                if (b.isClosed) { // On MDN, but not in https://w3c.github.io/FileAPI/#dfn-Blob
                    reject(new Error('The Blob is closed'));
                    return;
                }
                */
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    resolve({
                        type: b.type,
                        stringContents: reader.result
                    });
                });
                // Seems not feasible to accurately simulate
                /* c8 ignore next 3 */
                reader.addEventListener('error', () => {
                    reject(reader.error);
                });
                reader.readAsBinaryString(b);
            });
        }
    }
};

/* globals performance */

// The `performance` global is optional

/**
 * @todo We could use `import generateUUID from 'uuid/v4';` (but it needs
 *   crypto library, etc.; `rollup-plugin-node-builtins` doesn't recommend
 *   using its own version and though there is <https://www.npmjs.com/package/crypto-browserify>,
 *   it may be troublesome to bundle and not strongly needed)
 * @returns {string}
 */
function generateUUID () { //  Adapted from original: public domain/MIT: http://stackoverflow.com/a/8809472/271577
    /* c8 ignore next */
    let d = Date.now() +
        // use high-precision timer if available
        /* c8 ignore next 4 */
        (typeof performance !== 'undefined' &&
            typeof performance.now === 'function'
            ? performance.now()
            : 0);

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/gu, function (c) {
        /* eslint-disable no-bitwise */
        const r = Math.trunc((d + Math.random() * 16) % 16);
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        /* eslint-enable no-bitwise */
    });
}

const cloneableObjectsByUUID = {};

const cloneable = {
    cloneable: {
        test (x) {
            return x && typeof x === 'object' &&
                typeof x[Symbol.for('cloneEncapsulate')] === 'function';
        },
        replace (clonable) {
            const encapsulated = clonable[Symbol.for('cloneEncapsulate')]();
            const uuid = generateUUID();
            cloneableObjectsByUUID[uuid] = clonable;
            return {uuid, encapsulated};
        },
        revive ({uuid, encapsulated}) {
            return cloneableObjectsByUUID[uuid][Symbol.for('cloneRevive')](
                encapsulated
            );
        }
    }
};

/* globals crypto */

const cryptokey = {
    cryptokey: {
        test (x) {
            return toStringTag(x) === 'CryptoKey' && x.extractable;
        },
        replaceAsync (key) {
            return new e(async (resolve, reject) => {
                let jwk;
                try {
                    jwk = await crypto.subtle.exportKey('jwk', key);
                // Our format should be valid and our key extractable
                /* c8 ignore next 4 */
                } catch (err) {
                    reject(err);
                    return;
                }
                resolve({
                    jwk,
                    algorithm: key.algorithm,
                    usages: key.usages
                });
            });
        },
        revive ({jwk, algorithm, usages}) {
            return crypto.subtle.importKey('jwk', jwk, algorithm, true, usages);
        }
    }
};

const dataview = {
    dataview: {
        test (x) { return toStringTag(x) === 'DataView'; },
        replace ({buffer, byteOffset, byteLength}, stateObj) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const index = stateObj.buffers.indexOf(buffer);
            if (index > -1) {
                return {index, byteOffset, byteLength};
            }
            stateObj.buffers.push(buffer);
            return {
                encoded: encode(buffer),
                byteOffset,
                byteLength
            };
        },
        revive (b64Obj, stateObj) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const {byteOffset, byteLength, encoded, index} = b64Obj;
            let buffer;
            if ('index' in b64Obj) {
                buffer = stateObj.buffers[index];
            } else {
                buffer = decode(encoded);
                stateObj.buffers.push(buffer);
            }
            return new DataView(buffer, byteOffset, byteLength);
        }
    }
};

const date = {
    date: {
        test (x) { return toStringTag(x) === 'Date'; },
        replace (dt) {
            const time = dt.getTime();
            if (Number.isNaN(time)) {
                return 'NaN';
            }
            return time;
        },
        revive (time) {
            if (time === 'NaN') {
                return new Date(Number.NaN);
            }
            return new Date(time);
        }
    }
};

const error = {
    error: {
        test (x) { return toStringTag(x) === 'Error'; },
        replace ({
            name, message, cause, stack, fileName, lineNumber, columnNumber
        }) {
            return {
                name, message, cause, stack, fileName, lineNumber, columnNumber
            };
        },
        revive (obj) {
            const e = new Error(obj.message);
            [
                'name', 'cause', 'stack', 'fileName', 'lineNumber',
                'columnNumber'
            ].forEach((prop) => {
                e[prop] = obj[prop];
            });
            return e;
        }
    }
};

/* globals InternalError */

const errors = {};

// JS standard
[
    TypeError, RangeError, SyntaxError, ReferenceError, EvalError, URIError
].forEach((error) => create$2(error));

/* c8 ignore next 3 */
if (typeof AggregateError !== 'undefined') {
    create$2(AggregateError);
}

/* c8 ignore next 2 */
// @ts-ignore Non-standard
typeof InternalError === 'function' && create$2(InternalError);

/**
 * Comprises all built-in errors.
 * @param {
 *   TypeError|RangeError|SyntaxError|ReferenceError|EvalError|URIError|
 *   AggregateError|InternalError
 * } Ctor
 * @returns {void}
 */
function create$2 (Ctor) {
    errors[Ctor.name.toLowerCase()] = {
        test (x) { return hasConstructorOf(x, Ctor); },
        replace ({
            name, message, cause, stack, fileName,
            lineNumber, columnNumber, errors: errs
        }) {
            return {
                name, message, cause, stack, fileName,
                lineNumber, columnNumber, errors: errs
            };
        },
        revive (obj) {
            const isAggregateError = typeof AggregateError !== 'undefined' &&
                Ctor === AggregateError;
            const e = isAggregateError
                ? new Ctor(obj.errors, obj.message)
                : new Ctor(obj.message);
            [
                'name', 'cause', 'stack', 'fileName', 'lineNumber',
                'columnNumber'
            ].forEach((prop) => {
                e[prop] = obj[prop];
            });
            /* c8 ignore next 6 */
            if (isAggregateError) {
                e.errors = obj.errors;
            }
            return e;
        }
    };
}

/* globals XMLHttpRequest, File, FileReader */

const file = {
    file: {
        test (x) { return toStringTag(x) === 'File'; },
        replace (f) { // Sync
            const req = new XMLHttpRequest();
            req.overrideMimeType('text/plain; charset=x-user-defined');
            req.open('GET', URL.createObjectURL(f), false); // Sync
            req.send();

            // Seems not feasible to accurately simulate
            /* c8 ignore next 3 */
            if (req.status !== 200 && req.status !== 0) {
                throw new Error('Bad File access: ' + req.status);
            }
            return {
                type: f.type,
                stringContents: req.responseText,
                name: f.name,
                lastModified: f.lastModified
            };
        },
        revive ({name, type, stringContents, lastModified}) {
            return new File([string2arraybuffer(stringContents)], name, {
                type,
                lastModified
            });
        },
        replaceAsync (f) {
            return new e(function (resolve, reject) {
                /*
                if (f.isClosed) { // On MDN, but not in https://w3c.github.io/FileAPI/#dfn-Blob
                    reject(new Error('The File is closed'));
                    return;
                }
                */
                const reader = new FileReader();
                reader.addEventListener('load', function () {
                    resolve({
                        type: f.type,
                        stringContents: reader.result,
                        name: f.name,
                        lastModified: f.lastModified
                    });
                });
                // Seems not feasible to accurately simulate
                /* c8 ignore next 3 */
                reader.addEventListener('error', function () {
                    reject(reader.error);
                });
                reader.readAsBinaryString(f);
            });
        }
    }
};

const filelist = {
    file: file.file,
    filelist: {
        test (x) { return toStringTag(x) === 'FileList'; },
        replace (fl) {
            const arr = [];
            for (let i = 0; i < fl.length; i++) {
                arr[i] = fl.item(i);
            }
            return arr;
        },
        revive (o) {
            /**
             * `FileList` polyfill.
             */
            class FileList {
                /**
                 * Set private properties and length.
                 */
                constructor () {
                    // eslint-disable-next-line prefer-rest-params
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
                /* eslint-disable class-methods-use-this */
                /**
                 * @returns {"FileList"}
                 */
                get [Symbol.toStringTag] () {
                    /* eslint-enable class-methods-use-this */
                    return 'FileList';
                }
            }
            return new FileList(o);
        }
    }
};

/* globals createImageBitmap */

const imagebitmap = {
    imagebitmap: {
        test (x) {
            return toStringTag(x) === 'ImageBitmap' ||
                // In Node, our polyfill sets the dataset on a canvas
                //  element as JSDom no longer allows overriding toStringTag
                (x && x.dataset && x.dataset.toStringTag === 'ImageBitmap');
        },
        replace (bm) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bm, 0, 0);
            // Although `width` and `height` are part of `ImageBitMap`,
            //   these will be auto-created for us when reviving with the
            //   data URL (and they are not settable even if they weren't)
            // return {
            //   width: bm.width, height: bm.height, dataURL: canvas.toDataURL()
            // };
            return canvas.toDataURL();
        },
        revive (o) {
            /*
            var req = new XMLHttpRequest();
            req.open('GET', o, false); // Sync
            if (req.status !== 200 && req.status !== 0) {
              throw new Error('Bad ImageBitmap access: ' + req.status);
            }
            req.send();
            return req.responseText;
            */
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = document.createElement('img');
            // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
            img.addEventListener('load', function () {
                ctx.drawImage(img, 0, 0);
            });
            img.src = o;
            // Works in contexts allowing an `ImageBitmap` (We might use
            //   `OffscreenCanvas.transferToBitmap` when supported)
            return canvas;
        },
        reviveAsync (o) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = document.createElement('img');
            // The onload is needed by some browsers per http://stackoverflow.com/a/4776378/271577
            img.addEventListener('load', function () {
                ctx.drawImage(img, 0, 0);
            });
            img.src = o; // o.dataURL;
            return createImageBitmap(canvas); // Returns a promise
        }
    }
};

/* globals ImageData */

const imagedata = {
    imagedata: {
        test (x) { return toStringTag(x) === 'ImageData'; },
        replace (d) {
            return {
                // Ensure `length` gets preserved for revival
                array: [...d.data],
                width: d.width,
                height: d.height
            };
        },
        revive (o) {
            return new ImageData(
                new Uint8ClampedArray(o.array), o.width, o.height
            );
        }
    }
};

const infinity = {
    infinity: {
        test (x) { return x === Number.POSITIVE_INFINITY; },
        replace (n) { return 'Infinity'; },
        revive (s) { return Number.POSITIVE_INFINITY; }
    }
};

const IntlCollator = {
    test (x) { return hasConstructorOf(x, Intl.Collator); },
    replace (c) { return c.resolvedOptions(); },
    revive (options) { return new Intl.Collator(options.locale, options); }
};

const IntlDateTimeFormat = {
    test (x) { return hasConstructorOf(x, Intl.DateTimeFormat); },
    replace (dtf) { return dtf.resolvedOptions(); },
    revive (options) {
        return new Intl.DateTimeFormat(options.locale, options);
    }
};

const IntlNumberFormat = {
    test (x) { return hasConstructorOf(x, Intl.NumberFormat); },
    replace (nf) { return nf.resolvedOptions(); },
    revive (options) { return new Intl.NumberFormat(options.locale, options); }
};

const intlTypes = {
    IntlCollator,
    IntlDateTimeFormat,
    IntlNumberFormat
};

const map = {
    map: {
        test (x) { return toStringTag(x) === 'Map'; },
        replace (mp) { return [...mp.entries()]; },
        revive (entries) { return new Map(entries); }
    }
};

const nan = {
    nan: {
        test (x) { return Number.isNaN(x); },
        replace (n) { return 'NaN'; },
        revive (s) { return Number.NaN; }
    }
};

const negativeInfinity = {
    negativeInfinity: {
        test (x) { return x === Number.NEGATIVE_INFINITY; },
        replace (n) { return '-Infinity'; },
        revive (s) { return Number.NEGATIVE_INFINITY; }
    }
};

const negativeZero = {
    negativeZero: {
        test (x) {
            return Object.is(x, -0);
        },
        replace (n) {
            // Just adding 0 here for minimized space; will still revive as -0
            return 0;
        },
        revive (s) {
            return -0;
        }
    }
};

const nonbuiltinIgnore = {
    nonbuiltinIgnore: {
        test (x) {
            return x && typeof x === 'object' && !Array.isArray(x) && ![
                'Object',
                // `Proxy` and `Reflect`, two other built-in objects, will also
                //   have a `toStringTag` of `Object`; we don't want built-in
                //   function objects, however
                'Boolean', 'Number', 'String',
                'Error', 'RegExp', 'Math', 'Date',
                'Map', 'Set',
                'JSON',
                'ArrayBuffer', 'SharedArrayBuffer', 'DataView',
                'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array',
                'Uint16Array', 'Int32Array', 'Uint32Array',
                'Float32Array', 'Float64Array',
                'Promise',
                'String Iterator', 'Array Iterator',
                'Map Iterator', 'Set Iterator',
                'WeakMap', 'WeakSet',
                'Atomics', 'Module'
            ].includes(toStringTag(x));
        },
        replace (rexp) {
            // Not in use
        }
    }
};

// This module is for objectified primitives (such as `new Number(3)` or

const primitiveObjects = {
    // String Object (not primitive string which need no type spec)
    StringObject: {
        test (x) {
            return toStringTag(x) === 'String' && typeof x === 'object';
        },
        replace: String, // convert to primitive string
        revive (s) { return new String(s); } // Revive to an objectified string
    },
    // Boolean Object (not primitive boolean which need no type spec)
    BooleanObject: {
        test (x) {
            return toStringTag(x) === 'Boolean' &&
                typeof x === 'object';
        },
        replace: Boolean, // convert to primitive boolean
        revive (b) {
            // Revive to an objectified Boolean
            return new Boolean(b);
        }
    },
    // Number Object (not primitive number which need no type spec)
    NumberObject: {
        test (x) {
            return toStringTag(x) === 'Number' && typeof x === 'object';
        },
        replace: Number, // convert to primitive number
        revive (n) { return new Number(n); } // Revive to an objectified number
    }
};

const regexp = {
    regexp: {
        test (x) { return toStringTag(x) === 'RegExp'; },
        replace (rexp) {
            return {
                source: rexp.source,
                flags: (rexp.global ? 'g' : '') +
                    (rexp.ignoreCase ? 'i' : '') +
                    (rexp.multiline ? 'm' : '') +
                    (rexp.sticky ? 'y' : '') +
                    (rexp.unicode ? 'u' : '')
            };
        },
        revive ({source, flags}) { return new RegExp(source, flags); }
    }
};

// Here we allow the exact same non-plain object, function, and symbol

const resurrectableObjectsByUUID = {};

const resurrectable = {
    resurrectable: {
        test (x) {
            return x &&
                !Array.isArray(x) &&
                ['object', 'function', 'symbol'].includes(typeof x);
        },
        replace (rsrrctble) {
            const uuid = generateUUID();
            resurrectableObjectsByUUID[uuid] = rsrrctble;
            return uuid;
        },
        revive (serializedResurrectable) {
            return resurrectableObjectsByUUID[serializedResurrectable];
        }
    }
};

const set = {
    set: {
        test (x) { return toStringTag(x) === 'Set'; },
        replace (st) {
            return [...st.values()];
        },
        revive (values) { return new Set(values); }
    }
};

/* eslint-env browser, node */

// Support all kinds of typed arrays (views of ArrayBuffers)
const typedArraysSocketIO = {};

/**
 * @param {
 *   Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|
 *   Uint32Array|Float32Array|Float64Array
 * } TypedArray
 * @returns {void}
 */
function create$1 (TypedArray) {
    const typeName = TypedArray.name;
    typedArraysSocketIO[typeName.toLowerCase()] = {
        test (x) { return toStringTag(x) === typeName; },
        replace (a) {
            return (a.byteOffset === 0 &&
                a.byteLength === a.buffer.byteLength
                ? a
                // socket.io supports streaming ArrayBuffers.
                // If we have a typed array representing a portion
                //   of the buffer, we need to clone
                //   the buffer before leaving it to socket.io.
                : a.slice(0)).buffer;
        },
        revive (buf) {
            // One may configure socket.io to revive binary data as
            //    Buffer or Blob.
            // We should therefore not rely on that the instance we
            //   get here is an ArrayBuffer
            // If not, let's assume user wants to receive it as
            //   configured with socket.io.
            return toStringTag(buf) === 'ArrayBuffer'
                ? new TypedArray(buf)
                : buf;
        }
    };
}

if (typeof Int8Array === 'function') {
    // Those constructors are added in ES6 as a group.
    // If we have Int8Array, we can assume the rest also exists.

    [
        Int8Array,
        Uint8Array,
        Uint8ClampedArray,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array
    ].forEach((TypedArray) => create$1(TypedArray));
}

/* eslint-env browser, node */

const typedArrays = {};

/**
 * @param {
 *   Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|
 *   Uint32Array|Float32Array|Float64Array
 * } TypedArray
 * @returns {void}
 */
function create (TypedArray) {
    const typeName = TypedArray.name;
    typedArrays[typeName.toLowerCase()] = {
        test (x) { return toStringTag(x) === typeName; },
        replace ({buffer, byteOffset, length: l}, stateObj) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const index = stateObj.buffers.indexOf(buffer);
            if (index > -1) {
                return {index, byteOffset, length: l};
            }
            stateObj.buffers.push(buffer);
            return {
                encoded: encode(buffer),
                byteOffset,
                length: l
            };
        },
        revive (b64Obj, stateObj) {
            if (!stateObj.buffers) {
                stateObj.buffers = [];
            }
            const {byteOffset, length: len, encoded, index} = b64Obj;
            let buffer;
            if ('index' in b64Obj) {
                buffer = stateObj.buffers[index];
            } else {
                buffer = decode(encoded);
                stateObj.buffers.push(buffer);
            }
            return new TypedArray(buffer, byteOffset, len);
        }
    };
}

if (typeof Int8Array === 'function') {
    // Those constructors are added in ES6 as a group.
    // If we have Int8Array, we can assume the rest also exists.
    [
        Int8Array,
        Uint8Array,
        Uint8ClampedArray,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array
    ].forEach((TypedArray) => create(TypedArray));
}

// This does not preserve `undefined` in sparse arrays; see the `undef`

const undef$1 = {
    undef: {
        test (x, stateObj) {
            return typeof x === 'undefined' &&
                (stateObj.ownKeys || !('ownKeys' in stateObj));
        },
        replace (n) { return 0; },
        revive (s) {
            // Will add `undefined` (returning `undefined` would instead
            //   avoid explicitly setting)
            return new p();
        }
    }
};

const userObject = {
    userObject: {
        test (x, stateObj) { return isUserObject(x); },
        replace (n) { return {...n}; },
        revive (s) { return s; }
    }
};

const arrayNonindexKeys = [
    {
        arrayNonindexKeys: {
            testPlainObjects: true,
            test (x, stateObj) {
                if (Array.isArray(x)) {
                    if (
                        // By avoiding serializing arrays into objects which
                        //  have only positive-integer keys, we reduce
                        //  size and improve revival performance; arrays with
                        //  non-index keys will be larger however
                        Object.keys(x).some((k) => {
                            //  No need to check for `isNaN` or
                            //   `isNaN(Number.parseInt())` as `NaN` will be
                            //   treated as a string.
                            //  No need to do check as
                            //   `Number.parseInt(Number())` since scientific
                            //   notation will be pre-resolved if a number
                            //   was given, and it will otherwise be a string
                            return String(Number.parseInt(k)) !== k;
                        })
                    ) {
                        stateObj.iterateIn = 'object';
                        stateObj.addLength = true;
                    }
                    return true;
                }
                return false;
            },
            replace (a, stateObj) {
                // Catch sparse undefined
                stateObj.iterateUnsetNumeric = true;
                return a;
            },
            revive (o) {
                if (Array.isArray(o)) {
                    return o;
                }
                const arr = [];
                // No map here as may be a sparse array (including
                //   with `length` set)
                // Todo: Reenable when Node `engines` >= 7
                // Object.entries(o).forEach(([key, val]) => {
                Object.keys(o).forEach((key) => {
                    const val = o[key];
                    arr[key] = val;
                });
                return arr;
            }
        }
    },
    {
        sparseUndefined: {
            test (x, stateObj) {
                return typeof x === 'undefined' && stateObj.ownKeys === false;
            },
            replace (n) { return 0; },
            revive (s) { return undefined; } // Will avoid adding anything
        }
    }
];

const specialNumbers = [
    nan,
    infinity,
    negativeInfinity,
    negativeZero
];

/* This preset includes types that are built-in into the JavaScript
    language itself, this should work universally.

  Types that were added in ES6 or beyond will be checked before inclusion
   so that this module can be consumed by both ES5 and ES6 environments.

  Some types cannot be encapsulated because their inner state is private:
    `WeakMap`, `WeakSet`.

  The Function type is not included because their closures would not be
    serialized, so a revived Function that uses closures would not behave
    as expected.

  Symbols are similarly not included.
*/

const expObj$1 = [
    undef$1,
    // ES5
    arrayNonindexKeys, primitiveObjects, specialNumbers,
    date, error, errors, regexp
].concat(
    // ES2015 (ES6)
    /* c8 ignore next */
    typeof Map === 'function' ? map : [],
    /* c8 ignore next */
    typeof Set === 'function' ? set : [],
    /* c8 ignore next */
    typeof ArrayBuffer === 'function' ? arraybuffer : [],
    /* c8 ignore next */
    typeof Uint8Array === 'function' ? typedArrays : [],
    /* c8 ignore next */
    typeof DataView === 'function' ? dataview : [],
    /* c8 ignore next */
    typeof Intl !== 'undefined' ? intlTypes : [],

    /* c8 ignore next */
    typeof BigInt !== 'undefined' ? [bigint, bigintObject] : []
);

/*
When communicating via `postMessage()` (`Worker.postMessage()` or
`window.postMessage()`), the browser will use a similar algorithm as Typeson
does to encapsulate and revive all items in the structure (aka the structured
clone algorithm). This algorithm supports all built-in types as well as many
DOM types. Therefore, only types that are not included in the structured clone
algorithm need to be registered, which is:

* Error
* Specific Errors like SyntaxError, TypeError, etc.
* Any custom type you want to send across window- or worker boundraries

This preset will only include the Error types and you can register your
custom types after having registered these.
*/

const postmessage = [
    error,
    errors
];

const socketio = [
    expObj$1,
    // Leave ArrayBuffer as is, and let socket.io stream it instead.
    {arraybuffer: null},
    // Encapsulate TypedArrays in ArrayBuffers instead of base64 strings.
    typedArraysSocketIO
];

const sparseUndefined = [
    {
        sparseArrays: {
            testPlainObjects: true,
            test (x) { return Array.isArray(x); },
            replace (a, stateObj) {
                stateObj.iterateUnsetNumeric = true;
                return a;
            }
        }
    },
    {
        sparseUndefined: {
            test (x, stateObj) {
                return typeof x === 'undefined' && stateObj.ownKeys === false;
            },
            replace (n) { return 0; },
            revive (s) { return undefined; } // Will avoid adding anything
        }
    }
];

/* This preset includes types for the Structured Cloning Algorithm. */

const expObj = [
    // Todo: Might also register synchronous `ImageBitmap` and
    //    `Blob`/`File`/`FileList`?
    // ES5
    userObject, // Processed last (non-builtin)

    undef$1,
    arrayNonindexKeys, primitiveObjects, specialNumbers,
    date, regexp,

    // Non-built-ins
    imagedata,
    imagebitmap, // Async return
    file,
    filelist,
    blob,
    error,
    errors
].concat(
    // ES2015 (ES6)
    /* c8 ignore next */
    typeof Map === 'function' ? map : [],
    /* c8 ignore next */
    typeof Set === 'function' ? set : [],
    /* c8 ignore next */
    typeof ArrayBuffer === 'function' ? arraybuffer : [],
    /* c8 ignore next */
    typeof Uint8Array === 'function' ? typedArrays : [],
    /* c8 ignore next */
    typeof DataView === 'function' ? dataview : [],
    /* c8 ignore next */
    typeof Intl !== 'undefined' ? intlTypes : [],
    /* c8 ignore next */
    typeof crypto !== 'undefined' ? cryptokey : [],
    /* c8 ignore next */
    typeof BigInt !== 'undefined' ? [bigint, bigintObject] : []
);

/* globals DOMException */

var structuredCloningThrowing = expObj.concat({
    checkDataCloneException: {
        test (val) {
            // Should also throw with:
            // 1. `IsDetachedBuffer` (a process not called within the
            //      ECMAScript spec)
            // 2. `IsCallable` (covered by `typeof === 'function'` or a
            //       function's `toStringTag`)
            // 3. internal slots besides [[Prototype]] or [[Extensible]] (e.g.,
            //        [[PromiseState]] or [[WeakMapData]])
            // 4. exotic object (e.g., `Proxy`) (unless an `%ObjectPrototype%`
            //      intrinsic object) (which does not have default
            //      behavior for one or more of the essential internal methods
            //      that are limited to the following for non-function objects
            //      (we auto-exclude functions):
            //      [[GetPrototypeOf]],[[SetPrototypeOf]],[[IsExtensible]],
            //      [[PreventExtensions]],[[GetOwnProperty]],
            //      [[DefineOwnProperty]],[[HasProperty]],
            //      [[Get]],[[Set]],[[Delete]],[[OwnPropertyKeys]]);
            //      except for the standard, built-in exotic objects, we'd need
            //      to know whether these methods had distinct behaviors
            // Note: There is no apparent way for us to detect a `Proxy` and
            //      reject (Chrome at least is not rejecting anyways)
            const stringTag = ({}.toString.call(val).slice(8, -1));
            if (
                [
                    // Symbol's `toStringTag` is only "Symbol" for its initial
                    //   value, so we check `typeof`
                    'symbol',
                    // All functions including bound function exotic objects
                    'function'
                ].includes(typeof val) ||
                [
                    // A non-array exotic object
                    'Arguments',
                    // A non-array exotic object
                    'Module',
                    // `Error` and other errors have the [[ErrorData]] internal
                    //    slot and give "Error"
                    'Error',
                    // Promise instances have an extra slot ([[PromiseState]])
                    //    but not throwing in Chrome `postMessage`
                    'Promise',
                    // WeakMap instances have an extra slot ([[WeakMapData]])
                    //    but not throwing in Chrome `postMessage`
                    'WeakMap',
                    // WeakSet instances have an extra slot ([[WeakSetData]])
                    //    but not throwing in Chrome `postMessage`
                    'WeakSet',

                    // HTML-SPECIFIC
                    'Event',
                    // Also in Node `worker_threads` (currently experimental)
                    'MessageChannel'
                ].includes(stringTag) ||
                /*
                // isClosed is no longer documented
                ((stringTag === 'Blob' || stringTag === 'File') &&
                    val.isClosed) ||
                */
                (val && typeof val === 'object' &&
                    // Duck-type DOM node objects (non-array exotic?
                    //    objects which cannot be cloned by the SCA)
                    typeof val.nodeType === 'number' &&
                    typeof val.insertBefore === 'function')
            ) {
                throw new DOMException(
                    'The object cannot be cloned.', 'DataCloneError'
                );
            }
            return false;
        }
    }
});

const undef = [
    sparseUndefined,
    undef$1
];

const universal = [
    expObj$1
    // TODO: Add types that are de-facto universal even though not
    //   built-in into ecmasript standard.
];

export { l as JSON_TYPES, u as Typeson, e as TypesonPromise, p as Undefined, arrayNonindexKeys, arraybuffer, bigint, bigintObject, blob, expObj$1 as builtin, cloneable, cryptokey, dataview, date, error, errors, escapeKeyPathComponent, file, filelist, getByKeyPath, getJSONType, hasConstructorOf, imagebitmap, imagedata, infinity, intlTypes, isObject, isPlainObject, isThenable, isUserObject, map, nan, negativeInfinity, negativeZero, nonbuiltinIgnore, postmessage, primitiveObjects, regexp, resurrectable, set, setAtKeyPath, socketio, sparseUndefined, specialNumbers, expObj as structuredCloning, structuredCloningThrowing, toStringTag, typedArrays, typedArraysSocketIO as typedArraysSocketio, undef$1 as undef, undef as undefPreset, unescapeKeyPathComponent, universal, userObject };
//# sourceMappingURL=index.js.map

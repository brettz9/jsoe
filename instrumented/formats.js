function cov_1u5uhk019l(){var path="/Users/brett/jsoe/src/formats.js";var hash="b694004c3db613812e9f35767cb846bd1201189e";var global=new Function("return this")();var gcv="__coverage__";var coverageData={path:"/Users/brett/jsoe/src/formats.js",statementMap:{"0":{start:{line:115,column:4},end:{line:120,column:7}},"1":{start:{line:131,column:4},end:{line:139,column:9}},"2":{start:{line:148,column:4},end:{line:150,column:6}},"3":{start:{line:158,column:4},end:{line:158,column:41}}},fnMap:{"0":{name:"(anonymous_0)",decl:{start:{line:91,column:2},end:{line:91,column:3}},loc:{start:{line:91,column:17},end:{line:121,column:3}},line:91},"1":{name:"(anonymous_1)",decl:{start:{line:130,column:2},end:{line:130,column:3}},loc:{start:{line:130,column:71},end:{line:140,column:3}},line:130},"2":{name:"(anonymous_2)",decl:{start:{line:145,column:2},end:{line:145,column:3}},loc:{start:{line:147,column:4},end:{line:151,column:3}},line:147},"3":{name:"(anonymous_3)",decl:{start:{line:157,column:2},end:{line:157,column:3}},loc:{start:{line:157,column:30},end:{line:159,column:3}},line:157}},branchMap:{},s:{"0":0,"1":0,"2":0,"3":0},f:{"0":0,"1":0,"2":0,"3":0},b:{},_coverageSchema:"1a1c01bbd47fc00a2c39e90264f33305004495a9",hash:"b694004c3db613812e9f35767cb846bd1201189e"};var coverage=global[gcv]||(global[gcv]={});if(!coverage[path]||coverage[path].hash!==hash){coverage[path]=coverageData;}var actualCoverage=coverage[path];{// @ts-ignore
cov_1u5uhk019l=function(){return actualCoverage;};}return actualCoverage;}cov_1u5uhk019l();import indexedDBKey from'./formats/indexedDBKey.js';import json from'./formats/json.js';import structuredCloning from'./formats/structuredCloning.js';import schema from'./formats/schema.js';/**
 * An arbitrary Structured Clone, JSON, etc. value.
 * @typedef {any} StructuredCloneValue
 */ /**
 * @callback GetTypesAndSchemasForFormatAndState
 * @param {import('./types.js').default} types
 * @param {AvailableFormat} format
 * @param {string} [state]
 * @param {import('./formatAndTypeChoices.js').ZodexSchema|
 *   undefined} [schemaObject]
 * @param {import('./formatAndTypeChoices.js').ZodexSchema|
 *   undefined} [schemaOriginal]
 * @returns {TypesAndSchemaObjects|undefined}
 */ /* schema:
export const getTypeForFormatStateAndValue = ({format, state, value}) => {
  const valType = new Typeson().register(
    structuredCloningThrowing
  ).rootTypeName(value);
  return canonicalToAvailableType(format, state, valType, value);
};
*/ /**
 * @typedef {"indexedDBKey"|"json"|"structuredCloning"|"schema"} AvailableFormat
 */ /**
 * @typedef {{
 *   types: (import('./types.js').AvailableType)[],
 *   schemaObjects: import('./formats/schema.js').ZodexSchema[]
 * }} TypesAndSchemaObjects
 */ /**
 * Responsible for traversing over data (along with state information) to build
 *   and return a relevant UI element.
 * @callback FormatIterator
 * @param {StructuredCloneValue} records
 * @param {import('./types.js').StateObject} stateObj
 * @returns {Promise<Element>}
 */ /**
 * @typedef {object} Format
 * @property {() => (import('./types.js').AvailableType)[]} types Returns list
 *   of types generally available to structured cloning. See
 *   {@link getTypesAndSchemasForState} for context-dependent method.
 * @property {FormatIterator} iterate Traverses over data to build and return
 *   a relevant UI element.
 * @property {(
 *   types: import('./types.js').default,
 *   state?: string,
 *   schemaObject?: import('./formatAndTypeChoices.js').ZodexSchema|
 *     undefined,
 *   schemaOriginal?: import('./formatAndTypeChoices.js').ZodexSchema|
 *     undefined
 * ) => TypesAndSchemaObjects|undefined} getTypesAndSchemasForState Gets the
 *   specific types (and schemas) relevant to a given state.
 * @property {(
 *     newType: string, value: Date|Array<StructuredCloneValue>
 *   ) => boolean|undefined} [testInvalid]
 * @property {(
 *   typesonType: import('./types.js').AvailableType,
 *   types: import('./types.js').default,
 *   v?: import('./formats.js').StructuredCloneValue,
 *   arrayOrObjectPropertyName?: string,
 *   parentSchema?: import('zodex').SzType|undefined,
 *   stateObj?: import('./types.js').StateObject,
 * ) => {
 *   type: import('./types.js').AvailableType|undefined
 *   schema?: import('zodex').SzType|undefined
 * }} [convertFromTypeson]
 */ /**
 * Class for processing multiple formats.
 */class Formats{/**
   *
   */constructor(){cov_1u5uhk019l().f[0]++;cov_1u5uhk019l().s[0]++;// Can enable later (and add tests)
// if (formats) {
//   this.availableFormats = {};
//   formats.forEach((format) => {
//     let formatValue;
//     switch (format) {
//     case 'indexedDBKey':
//       formatValue = indexedDBKey;
//       break;
//     case 'json':
//       formatValue = json;
//       break;
//     case 'structuredCloning':
//       formatValue = structuredCloning;
//       break;
//     default:
//       throw new Error('Unknown format');
//     }
//     this.availableFormats[format] = formatValue;
//   });
//   return;
// }
// Using methods ensure we have fresh copies
this.availableFormats=/** @type {{[key: string]: Format}} */{indexedDBKey,json,schema,structuredCloning};}/**
   * @param {import('./types.js').default} types
   * @param {AvailableFormat} format
   * @param {StructuredCloneValue} record
   * @param {import('./types.js').StateObject} stateObj
   * @returns {Promise<Element>}
   */async getControlsForFormatAndValue(types,format,record,stateObj){cov_1u5uhk019l().f[1]++;cov_1u5uhk019l().s[1]++;return await this.availableFormats[format].iterate(record,{...stateObj,types,formats:this,// This had been before `stateObj` but should apparently have precedence
//   or just avoid passing `format` to this function
format});}/**
   * @type {GetTypesAndSchemasForFormatAndState}
   */getTypesAndSchemasForFormatAndState(types,format,state,schemaObject,schemaOriginal){cov_1u5uhk019l().f[2]++;cov_1u5uhk019l().s[2]++;return this.availableFormats[format].getTypesAndSchemasForState(types,state,schemaObject,schemaOriginal);}/**
   * @param {AvailableFormat} format
   * @returns {Format}
   */getAvailableFormat(format){cov_1u5uhk019l().f[3]++;cov_1u5uhk019l().s[3]++;return this.availableFormats[format];}}export default Formats;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMXU1dWhrMDE5bCIsImFjdHVhbENvdmVyYWdlIiwiaW5kZXhlZERCS2V5IiwianNvbiIsInN0cnVjdHVyZWRDbG9uaW5nIiwic2NoZW1hIiwiRm9ybWF0cyIsImNvbnN0cnVjdG9yIiwiZiIsInMiLCJhdmFpbGFibGVGb3JtYXRzIiwiZ2V0Q29udHJvbHNGb3JGb3JtYXRBbmRWYWx1ZSIsInR5cGVzIiwiZm9ybWF0IiwicmVjb3JkIiwic3RhdGVPYmoiLCJpdGVyYXRlIiwiZm9ybWF0cyIsImdldFR5cGVzQW5kU2NoZW1hc0ZvckZvcm1hdEFuZFN0YXRlIiwic3RhdGUiLCJzY2hlbWFPYmplY3QiLCJzY2hlbWFPcmlnaW5hbCIsImdldFR5cGVzQW5kU2NoZW1hc0ZvclN0YXRlIiwiZ2V0QXZhaWxhYmxlRm9ybWF0Il0sInNvdXJjZXMiOlsiZm9ybWF0cy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5kZXhlZERCS2V5IGZyb20gJy4vZm9ybWF0cy9pbmRleGVkREJLZXkuanMnO1xuaW1wb3J0IGpzb24gZnJvbSAnLi9mb3JtYXRzL2pzb24uanMnO1xuaW1wb3J0IHN0cnVjdHVyZWRDbG9uaW5nIGZyb20gJy4vZm9ybWF0cy9zdHJ1Y3R1cmVkQ2xvbmluZy5qcyc7XG5pbXBvcnQgc2NoZW1hIGZyb20gJy4vZm9ybWF0cy9zY2hlbWEuanMnO1xuXG4vKipcbiAqIEFuIGFyYml0cmFyeSBTdHJ1Y3R1cmVkIENsb25lLCBKU09OLCBldGMuIHZhbHVlLlxuICogQHR5cGVkZWYge2FueX0gU3RydWN0dXJlZENsb25lVmFsdWVcbiAqL1xuXG4vKipcbiAqIEBjYWxsYmFjayBHZXRUeXBlc0FuZFNjaGVtYXNGb3JGb3JtYXRBbmRTdGF0ZVxuICogQHBhcmFtIHtpbXBvcnQoJy4vdHlwZXMuanMnKS5kZWZhdWx0fSB0eXBlc1xuICogQHBhcmFtIHtBdmFpbGFibGVGb3JtYXR9IGZvcm1hdFxuICogQHBhcmFtIHtzdHJpbmd9IFtzdGF0ZV1cbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8XG4gKiAgIHVuZGVmaW5lZH0gW3NjaGVtYU9iamVjdF1cbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8XG4gKiAgIHVuZGVmaW5lZH0gW3NjaGVtYU9yaWdpbmFsXVxuICogQHJldHVybnMge1R5cGVzQW5kU2NoZW1hT2JqZWN0c3x1bmRlZmluZWR9XG4gKi9cblxuLyogc2NoZW1hOlxuZXhwb3J0IGNvbnN0IGdldFR5cGVGb3JGb3JtYXRTdGF0ZUFuZFZhbHVlID0gKHtmb3JtYXQsIHN0YXRlLCB2YWx1ZX0pID0+IHtcbiAgY29uc3QgdmFsVHlwZSA9IG5ldyBUeXBlc29uKCkucmVnaXN0ZXIoXG4gICAgc3RydWN0dXJlZENsb25pbmdUaHJvd2luZ1xuICApLnJvb3RUeXBlTmFtZSh2YWx1ZSk7XG4gIHJldHVybiBjYW5vbmljYWxUb0F2YWlsYWJsZVR5cGUoZm9ybWF0LCBzdGF0ZSwgdmFsVHlwZSwgdmFsdWUpO1xufTtcbiovXG5cbi8qKlxuICogQHR5cGVkZWYge1wiaW5kZXhlZERCS2V5XCJ8XCJqc29uXCJ8XCJzdHJ1Y3R1cmVkQ2xvbmluZ1wifFwic2NoZW1hXCJ9IEF2YWlsYWJsZUZvcm1hdFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge3tcbiAqICAgdHlwZXM6IChpbXBvcnQoJy4vdHlwZXMuanMnKS5BdmFpbGFibGVUeXBlKVtdLFxuICogICBzY2hlbWFPYmplY3RzOiBpbXBvcnQoJy4vZm9ybWF0cy9zY2hlbWEuanMnKS5ab2RleFNjaGVtYVtdXG4gKiB9fSBUeXBlc0FuZFNjaGVtYU9iamVjdHNcbiAqL1xuXG4vKipcbiAqIFJlc3BvbnNpYmxlIGZvciB0cmF2ZXJzaW5nIG92ZXIgZGF0YSAoYWxvbmcgd2l0aCBzdGF0ZSBpbmZvcm1hdGlvbikgdG8gYnVpbGRcbiAqICAgYW5kIHJldHVybiBhIHJlbGV2YW50IFVJIGVsZW1lbnQuXG4gKiBAY2FsbGJhY2sgRm9ybWF0SXRlcmF0b3JcbiAqIEBwYXJhbSB7U3RydWN0dXJlZENsb25lVmFsdWV9IHJlY29yZHNcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3R5cGVzLmpzJykuU3RhdGVPYmplY3R9IHN0YXRlT2JqXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxFbGVtZW50Pn1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IEZvcm1hdFxuICogQHByb3BlcnR5IHsoKSA9PiAoaW1wb3J0KCcuL3R5cGVzLmpzJykuQXZhaWxhYmxlVHlwZSlbXX0gdHlwZXMgUmV0dXJucyBsaXN0XG4gKiAgIG9mIHR5cGVzIGdlbmVyYWxseSBhdmFpbGFibGUgdG8gc3RydWN0dXJlZCBjbG9uaW5nLiBTZWVcbiAqICAge0BsaW5rIGdldFR5cGVzQW5kU2NoZW1hc0ZvclN0YXRlfSBmb3IgY29udGV4dC1kZXBlbmRlbnQgbWV0aG9kLlxuICogQHByb3BlcnR5IHtGb3JtYXRJdGVyYXRvcn0gaXRlcmF0ZSBUcmF2ZXJzZXMgb3ZlciBkYXRhIHRvIGJ1aWxkIGFuZCByZXR1cm5cbiAqICAgYSByZWxldmFudCBVSSBlbGVtZW50LlxuICogQHByb3BlcnR5IHsoXG4gKiAgIHR5cGVzOiBpbXBvcnQoJy4vdHlwZXMuanMnKS5kZWZhdWx0LFxuICogICBzdGF0ZT86IHN0cmluZyxcbiAqICAgc2NoZW1hT2JqZWN0PzogaW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8XG4gKiAgICAgdW5kZWZpbmVkLFxuICogICBzY2hlbWFPcmlnaW5hbD86IGltcG9ydCgnLi9mb3JtYXRBbmRUeXBlQ2hvaWNlcy5qcycpLlpvZGV4U2NoZW1hfFxuICogICAgIHVuZGVmaW5lZFxuICogKSA9PiBUeXBlc0FuZFNjaGVtYU9iamVjdHN8dW5kZWZpbmVkfSBnZXRUeXBlc0FuZFNjaGVtYXNGb3JTdGF0ZSBHZXRzIHRoZVxuICogICBzcGVjaWZpYyB0eXBlcyAoYW5kIHNjaGVtYXMpIHJlbGV2YW50IHRvIGEgZ2l2ZW4gc3RhdGUuXG4gKiBAcHJvcGVydHkgeyhcbiAqICAgICBuZXdUeXBlOiBzdHJpbmcsIHZhbHVlOiBEYXRlfEFycmF5PFN0cnVjdHVyZWRDbG9uZVZhbHVlPlxuICogICApID0+IGJvb2xlYW58dW5kZWZpbmVkfSBbdGVzdEludmFsaWRdXG4gKiBAcHJvcGVydHkgeyhcbiAqICAgdHlwZXNvblR5cGU6IGltcG9ydCgnLi90eXBlcy5qcycpLkF2YWlsYWJsZVR5cGUsXG4gKiAgIHR5cGVzOiBpbXBvcnQoJy4vdHlwZXMuanMnKS5kZWZhdWx0LFxuICogICB2PzogaW1wb3J0KCcuL2Zvcm1hdHMuanMnKS5TdHJ1Y3R1cmVkQ2xvbmVWYWx1ZSxcbiAqICAgYXJyYXlPck9iamVjdFByb3BlcnR5TmFtZT86IHN0cmluZyxcbiAqICAgcGFyZW50U2NoZW1hPzogaW1wb3J0KCd6b2RleCcpLlN6VHlwZXx1bmRlZmluZWQsXG4gKiAgIHN0YXRlT2JqPzogaW1wb3J0KCcuL3R5cGVzLmpzJykuU3RhdGVPYmplY3QsXG4gKiApID0+IHtcbiAqICAgdHlwZTogaW1wb3J0KCcuL3R5cGVzLmpzJykuQXZhaWxhYmxlVHlwZXx1bmRlZmluZWRcbiAqICAgc2NoZW1hPzogaW1wb3J0KCd6b2RleCcpLlN6VHlwZXx1bmRlZmluZWRcbiAqIH19IFtjb252ZXJ0RnJvbVR5cGVzb25dXG4gKi9cblxuLyoqXG4gKiBDbGFzcyBmb3IgcHJvY2Vzc2luZyBtdWx0aXBsZSBmb3JtYXRzLlxuICovXG5jbGFzcyBGb3JtYXRzIHtcbiAgLyoqXG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgLy8gQ2FuIGVuYWJsZSBsYXRlciAoYW5kIGFkZCB0ZXN0cylcbiAgICAvLyBpZiAoZm9ybWF0cykge1xuICAgIC8vICAgdGhpcy5hdmFpbGFibGVGb3JtYXRzID0ge307XG4gICAgLy8gICBmb3JtYXRzLmZvckVhY2goKGZvcm1hdCkgPT4ge1xuICAgIC8vICAgICBsZXQgZm9ybWF0VmFsdWU7XG4gICAgLy8gICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgLy8gICAgIGNhc2UgJ2luZGV4ZWREQktleSc6XG4gICAgLy8gICAgICAgZm9ybWF0VmFsdWUgPSBpbmRleGVkREJLZXk7XG4gICAgLy8gICAgICAgYnJlYWs7XG4gICAgLy8gICAgIGNhc2UgJ2pzb24nOlxuICAgIC8vICAgICAgIGZvcm1hdFZhbHVlID0ganNvbjtcbiAgICAvLyAgICAgICBicmVhaztcbiAgICAvLyAgICAgY2FzZSAnc3RydWN0dXJlZENsb25pbmcnOlxuICAgIC8vICAgICAgIGZvcm1hdFZhbHVlID0gc3RydWN0dXJlZENsb25pbmc7XG4gICAgLy8gICAgICAgYnJlYWs7XG4gICAgLy8gICAgIGRlZmF1bHQ6XG4gICAgLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGZvcm1hdCcpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHRoaXMuYXZhaWxhYmxlRm9ybWF0c1tmb3JtYXRdID0gZm9ybWF0VmFsdWU7XG4gICAgLy8gICB9KTtcbiAgICAvLyAgIHJldHVybjtcbiAgICAvLyB9XG4gICAgLy8gVXNpbmcgbWV0aG9kcyBlbnN1cmUgd2UgaGF2ZSBmcmVzaCBjb3BpZXNcbiAgICB0aGlzLmF2YWlsYWJsZUZvcm1hdHMgPSAvKiogQHR5cGUge3tba2V5OiBzdHJpbmddOiBGb3JtYXR9fSAqLyAoe1xuICAgICAgaW5kZXhlZERCS2V5LFxuICAgICAganNvbixcbiAgICAgIHNjaGVtYSxcbiAgICAgIHN0cnVjdHVyZWRDbG9uaW5nXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtpbXBvcnQoJy4vdHlwZXMuanMnKS5kZWZhdWx0fSB0eXBlc1xuICAgKiBAcGFyYW0ge0F2YWlsYWJsZUZvcm1hdH0gZm9ybWF0XG4gICAqIEBwYXJhbSB7U3RydWN0dXJlZENsb25lVmFsdWV9IHJlY29yZFxuICAgKiBAcGFyYW0ge2ltcG9ydCgnLi90eXBlcy5qcycpLlN0YXRlT2JqZWN0fSBzdGF0ZU9ialxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxFbGVtZW50Pn1cbiAgICovXG4gIGFzeW5jIGdldENvbnRyb2xzRm9yRm9ybWF0QW5kVmFsdWUgKHR5cGVzLCBmb3JtYXQsIHJlY29yZCwgc3RhdGVPYmopIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5hdmFpbGFibGVGb3JtYXRzW2Zvcm1hdF0uXG4gICAgICBpdGVyYXRlKHJlY29yZCwge1xuICAgICAgICAuLi5zdGF0ZU9iaixcbiAgICAgICAgdHlwZXMsXG4gICAgICAgIGZvcm1hdHM6IHRoaXMsXG4gICAgICAgIC8vIFRoaXMgaGFkIGJlZW4gYmVmb3JlIGBzdGF0ZU9iamAgYnV0IHNob3VsZCBhcHBhcmVudGx5IGhhdmUgcHJlY2VkZW5jZVxuICAgICAgICAvLyAgIG9yIGp1c3QgYXZvaWQgcGFzc2luZyBgZm9ybWF0YCB0byB0aGlzIGZ1bmN0aW9uXG4gICAgICAgIGZvcm1hdFxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge0dldFR5cGVzQW5kU2NoZW1hc0ZvckZvcm1hdEFuZFN0YXRlfVxuICAgKi9cbiAgZ2V0VHlwZXNBbmRTY2hlbWFzRm9yRm9ybWF0QW5kU3RhdGUgKFxuICAgIHR5cGVzLCBmb3JtYXQsIHN0YXRlLCBzY2hlbWFPYmplY3QsIHNjaGVtYU9yaWdpbmFsXG4gICkge1xuICAgIHJldHVybiB0aGlzLmF2YWlsYWJsZUZvcm1hdHNbZm9ybWF0XS5nZXRUeXBlc0FuZFNjaGVtYXNGb3JTdGF0ZShcbiAgICAgIHR5cGVzLCBzdGF0ZSwgc2NoZW1hT2JqZWN0LCBzY2hlbWFPcmlnaW5hbFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtBdmFpbGFibGVGb3JtYXR9IGZvcm1hdFxuICAgKiBAcmV0dXJucyB7Rm9ybWF0fVxuICAgKi9cbiAgZ2V0QXZhaWxhYmxlRm9ybWF0IChmb3JtYXQpIHtcbiAgICByZXR1cm4gdGhpcy5hdmFpbGFibGVGb3JtYXRzW2Zvcm1hdF07XG4gIH1cbn1cblxuZXhw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
function cov_1u5uhk019l(){var path="/Users/brett/jsoe/src/formats.js";var hash="2ed624a903895d085ddcceb75380168eef7d7db1";var global=new Function("return this")();var gcv="__coverage__";var coverageData={path:"/Users/brett/jsoe/src/formats.js",statementMap:{"0":{start:{line:116,column:4},end:{line:121,column:7}},"1":{start:{line:132,column:4},end:{line:140,column:9}},"2":{start:{line:149,column:4},end:{line:151,column:6}},"3":{start:{line:159,column:4},end:{line:159,column:41}}},fnMap:{"0":{name:"(anonymous_0)",decl:{start:{line:92,column:2},end:{line:92,column:3}},loc:{start:{line:92,column:17},end:{line:122,column:3}},line:92},"1":{name:"(anonymous_1)",decl:{start:{line:131,column:2},end:{line:131,column:3}},loc:{start:{line:131,column:71},end:{line:141,column:3}},line:131},"2":{name:"(anonymous_2)",decl:{start:{line:146,column:2},end:{line:146,column:3}},loc:{start:{line:148,column:4},end:{line:152,column:3}},line:148},"3":{name:"(anonymous_3)",decl:{start:{line:158,column:2},end:{line:158,column:3}},loc:{start:{line:158,column:30},end:{line:160,column:3}},line:158}},branchMap:{},s:{"0":0,"1":0,"2":0,"3":0},f:{"0":0,"1":0,"2":0,"3":0},b:{},_coverageSchema:"1a1c01bbd47fc00a2c39e90264f33305004495a9",hash:"2ed624a903895d085ddcceb75380168eef7d7db1"};var coverage=global[gcv]||(global[gcv]={});if(!coverage[path]||coverage[path].hash!==hash){coverage[path]=coverageData;}var actualCoverage=coverage[path];{// @ts-ignore
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
 * @returns {Promise<Required<import('./types.js').StateObject>>}
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
 *   schema?: import('zodex').SzType|undefined,
 *   mustBeOptional?: boolean
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
   * @returns {Promise<Required<import('./types.js').StateObject>>}
   */async getControlsForFormatAndValue(types,format,record,stateObj){cov_1u5uhk019l().f[1]++;cov_1u5uhk019l().s[1]++;return await this.availableFormats[format].iterate(record,{...stateObj,types,formats:this,// This had been before `stateObj` but should apparently have precedence
//   or just avoid passing `format` to this function
format});}/**
   * @type {GetTypesAndSchemasForFormatAndState}
   */getTypesAndSchemasForFormatAndState(types,format,state,schemaObject,schemaOriginal){cov_1u5uhk019l().f[2]++;cov_1u5uhk019l().s[2]++;return this.availableFormats[format].getTypesAndSchemasForState(types,state,schemaObject,schemaOriginal);}/**
   * @param {AvailableFormat} format
   * @returns {Format}
   */getAvailableFormat(format){cov_1u5uhk019l().f[3]++;cov_1u5uhk019l().s[3]++;return this.availableFormats[format];}}export default Formats;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMXU1dWhrMDE5bCIsImFjdHVhbENvdmVyYWdlIiwiaW5kZXhlZERCS2V5IiwianNvbiIsInN0cnVjdHVyZWRDbG9uaW5nIiwic2NoZW1hIiwiRm9ybWF0cyIsImNvbnN0cnVjdG9yIiwiZiIsInMiLCJhdmFpbGFibGVGb3JtYXRzIiwiZ2V0Q29udHJvbHNGb3JGb3JtYXRBbmRWYWx1ZSIsInR5cGVzIiwiZm9ybWF0IiwicmVjb3JkIiwic3RhdGVPYmoiLCJpdGVyYXRlIiwiZm9ybWF0cyIsImdldFR5cGVzQW5kU2NoZW1hc0ZvckZvcm1hdEFuZFN0YXRlIiwic3RhdGUiLCJzY2hlbWFPYmplY3QiLCJzY2hlbWFPcmlnaW5hbCIsImdldFR5cGVzQW5kU2NoZW1hc0ZvclN0YXRlIiwiZ2V0QXZhaWxhYmxlRm9ybWF0Il0sInNvdXJjZXMiOlsiZm9ybWF0cy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5kZXhlZERCS2V5IGZyb20gJy4vZm9ybWF0cy9pbmRleGVkREJLZXkuanMnO1xuaW1wb3J0IGpzb24gZnJvbSAnLi9mb3JtYXRzL2pzb24uanMnO1xuaW1wb3J0IHN0cnVjdHVyZWRDbG9uaW5nIGZyb20gJy4vZm9ybWF0cy9zdHJ1Y3R1cmVkQ2xvbmluZy5qcyc7XG5pbXBvcnQgc2NoZW1hIGZyb20gJy4vZm9ybWF0cy9zY2hlbWEuanMnO1xuXG4vKipcbiAqIEFuIGFyYml0cmFyeSBTdHJ1Y3R1cmVkIENsb25lLCBKU09OLCBldGMuIHZhbHVlLlxuICogQHR5cGVkZWYge2FueX0gU3RydWN0dXJlZENsb25lVmFsdWVcbiAqL1xuXG4vKipcbiAqIEBjYWxsYmFjayBHZXRUeXBlc0FuZFNjaGVtYXNGb3JGb3JtYXRBbmRTdGF0ZVxuICogQHBhcmFtIHtpbXBvcnQoJy4vdHlwZXMuanMnKS5kZWZhdWx0fSB0eXBlc1xuICogQHBhcmFtIHtBdmFpbGFibGVGb3JtYXR9IGZvcm1hdFxuICogQHBhcmFtIHtzdHJpbmd9IFtzdGF0ZV1cbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8XG4gKiAgIHVuZGVmaW5lZH0gW3NjaGVtYU9iamVjdF1cbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8XG4gKiAgIHVuZGVmaW5lZH0gW3NjaGVtYU9yaWdpbmFsXVxuICogQHJldHVybnMge1R5cGVzQW5kU2NoZW1hT2JqZWN0c3x1bmRlZmluZWR9XG4gKi9cblxuLyogc2NoZW1hOlxuZXhwb3J0IGNvbnN0IGdldFR5cGVGb3JGb3JtYXRTdGF0ZUFuZFZhbHVlID0gKHtmb3JtYXQsIHN0YXRlLCB2YWx1ZX0pID0+IHtcbiAgY29uc3QgdmFsVHlwZSA9IG5ldyBUeXBlc29uKCkucmVnaXN0ZXIoXG4gICAgc3RydWN0dXJlZENsb25pbmdUaHJvd2luZ1xuICApLnJvb3RUeXBlTmFtZSh2YWx1ZSk7XG4gIHJldHVybiBjYW5vbmljYWxUb0F2YWlsYWJsZVR5cGUoZm9ybWF0LCBzdGF0ZSwgdmFsVHlwZSwgdmFsdWUpO1xufTtcbiovXG5cbi8qKlxuICogQHR5cGVkZWYge1wiaW5kZXhlZERCS2V5XCJ8XCJqc29uXCJ8XCJzdHJ1Y3R1cmVkQ2xvbmluZ1wifFwic2NoZW1hXCJ9IEF2YWlsYWJsZUZvcm1hdFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge3tcbiAqICAgdHlwZXM6IChpbXBvcnQoJy4vdHlwZXMuanMnKS5BdmFpbGFibGVUeXBlKVtdLFxuICogICBzY2hlbWFPYmplY3RzOiBpbXBvcnQoJy4vZm9ybWF0cy9zY2hlbWEuanMnKS5ab2RleFNjaGVtYVtdXG4gKiB9fSBUeXBlc0FuZFNjaGVtYU9iamVjdHNcbiAqL1xuXG4vKipcbiAqIFJlc3BvbnNpYmxlIGZvciB0cmF2ZXJzaW5nIG92ZXIgZGF0YSAoYWxvbmcgd2l0aCBzdGF0ZSBpbmZvcm1hdGlvbikgdG8gYnVpbGRcbiAqICAgYW5kIHJldHVybiBhIHJlbGV2YW50IFVJIGVsZW1lbnQuXG4gKiBAY2FsbGJhY2sgRm9ybWF0SXRlcmF0b3JcbiAqIEBwYXJhbSB7U3RydWN0dXJlZENsb25lVmFsdWV9IHJlY29yZHNcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3R5cGVzLmpzJykuU3RhdGVPYmplY3R9IHN0YXRlT2JqXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxSZXF1aXJlZDxpbXBvcnQoJy4vdHlwZXMuanMnKS5TdGF0ZU9iamVjdD4+fVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gRm9ybWF0XG4gKiBAcHJvcGVydHkgeygpID0+IChpbXBvcnQoJy4vdHlwZXMuanMnKS5BdmFpbGFibGVUeXBlKVtdfSB0eXBlcyBSZXR1cm5zIGxpc3RcbiAqICAgb2YgdHlwZXMgZ2VuZXJhbGx5IGF2YWlsYWJsZSB0byBzdHJ1Y3R1cmVkIGNsb25pbmcuIFNlZVxuICogICB7QGxpbmsgZ2V0VHlwZXNBbmRTY2hlbWFzRm9yU3RhdGV9IGZvciBjb250ZXh0LWRlcGVuZGVudCBtZXRob2QuXG4gKiBAcHJvcGVydHkge0Zvcm1hdEl0ZXJhdG9yfSBpdGVyYXRlIFRyYXZlcnNlcyBvdmVyIGRhdGEgdG8gYnVpbGQgYW5kIHJldHVyblxuICogICBhIHJlbGV2YW50IFVJIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkgeyhcbiAqICAgdHlwZXM6IGltcG9ydCgnLi90eXBlcy5qcycpLmRlZmF1bHQsXG4gKiAgIHN0YXRlPzogc3RyaW5nLFxuICogICBzY2hlbWFPYmplY3Q/OiBpbXBvcnQoJy4vZm9ybWF0QW5kVHlwZUNob2ljZXMuanMnKS5ab2RleFNjaGVtYXxcbiAqICAgICB1bmRlZmluZWQsXG4gKiAgIHNjaGVtYU9yaWdpbmFsPzogaW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8XG4gKiAgICAgdW5kZWZpbmVkXG4gKiApID0+IFR5cGVzQW5kU2NoZW1hT2JqZWN0c3x1bmRlZmluZWR9IGdldFR5cGVzQW5kU2NoZW1hc0ZvclN0YXRlIEdldHMgdGhlXG4gKiAgIHNwZWNpZmljIHR5cGVzIChhbmQgc2NoZW1hcykgcmVsZXZhbnQgdG8gYSBnaXZlbiBzdGF0ZS5cbiAqIEBwcm9wZXJ0eSB7KFxuICogICAgIG5ld1R5cGU6IHN0cmluZywgdmFsdWU6IERhdGV8QXJyYXk8U3RydWN0dXJlZENsb25lVmFsdWU+XG4gKiAgICkgPT4gYm9vbGVhbnx1bmRlZmluZWR9IFt0ZXN0SW52YWxpZF1cbiAqIEBwcm9wZXJ0eSB7KFxuICogICB0eXBlc29uVHlwZTogaW1wb3J0KCcuL3R5cGVzLmpzJykuQXZhaWxhYmxlVHlwZSxcbiAqICAgdHlwZXM6IGltcG9ydCgnLi90eXBlcy5qcycpLmRlZmF1bHQsXG4gKiAgIHY/OiBpbXBvcnQoJy4vZm9ybWF0cy5qcycpLlN0cnVjdHVyZWRDbG9uZVZhbHVlLFxuICogICBhcnJheU9yT2JqZWN0UHJvcGVydHlOYW1lPzogc3RyaW5nLFxuICogICBwYXJlbnRTY2hlbWE/OiBpbXBvcnQoJ3pvZGV4JykuU3pUeXBlfHVuZGVmaW5lZCxcbiAqICAgc3RhdGVPYmo/OiBpbXBvcnQoJy4vdHlwZXMuanMnKS5TdGF0ZU9iamVjdCxcbiAqICkgPT4ge1xuICogICB0eXBlOiBpbXBvcnQoJy4vdHlwZXMuanMnKS5BdmFpbGFibGVUeXBlfHVuZGVmaW5lZFxuICogICBzY2hlbWE/OiBpbXBvcnQoJ3pvZGV4JykuU3pUeXBlfHVuZGVmaW5lZCxcbiAqICAgbXVzdEJlT3B0aW9uYWw/OiBib29sZWFuXG4gKiB9fSBbY29udmVydEZyb21UeXBlc29uXVxuICovXG5cbi8qKlxuICogQ2xhc3MgZm9yIHByb2Nlc3NpbmcgbXVsdGlwbGUgZm9ybWF0cy5cbiAqL1xuY2xhc3MgRm9ybWF0cyB7XG4gIC8qKlxuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIC8vIENhbiBlbmFibGUgbGF0ZXIgKGFuZCBhZGQgdGVzdHMpXG4gICAgLy8gaWYgKGZvcm1hdHMpIHtcbiAgICAvLyAgIHRoaXMuYXZhaWxhYmxlRm9ybWF0cyA9IHt9O1xuICAgIC8vICAgZm9ybWF0cy5mb3JFYWNoKChmb3JtYXQpID0+IHtcbiAgICAvLyAgICAgbGV0IGZvcm1hdFZhbHVlO1xuICAgIC8vICAgICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgIC8vICAgICBjYXNlICdpbmRleGVkREJLZXknOlxuICAgIC8vICAgICAgIGZvcm1hdFZhbHVlID0gaW5kZXhlZERCS2V5O1xuICAgIC8vICAgICAgIGJyZWFrO1xuICAgIC8vICAgICBjYXNlICdqc29uJzpcbiAgICAvLyAgICAgICBmb3JtYXRWYWx1ZSA9IGpzb247XG4gICAgLy8gICAgICAgYnJlYWs7XG4gICAgLy8gICAgIGNhc2UgJ3N0cnVjdHVyZWRDbG9uaW5nJzpcbiAgICAvLyAgICAgICBmb3JtYXRWYWx1ZSA9IHN0cnVjdHVyZWRDbG9uaW5nO1xuICAgIC8vICAgICAgIGJyZWFrO1xuICAgIC8vICAgICBkZWZhdWx0OlxuICAgIC8vICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBmb3JtYXQnKTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICB0aGlzLmF2YWlsYWJsZUZvcm1hdHNbZm9ybWF0XSA9IGZvcm1hdFZhbHVlO1xuICAgIC8vICAgfSk7XG4gICAgLy8gICByZXR1cm47XG4gICAgLy8gfVxuICAgIC8vIFVzaW5nIG1ldGhvZHMgZW5zdXJlIHdlIGhhdmUgZnJlc2ggY29waWVzXG4gICAgdGhpcy5hdmFpbGFibGVGb3JtYXRzID0gLyoqIEB0eXBlIHt7W2tleTogc3RyaW5nXTogRm9ybWF0fX0gKi8gKHtcbiAgICAgIGluZGV4ZWREQktleSxcbiAgICAgIGpzb24sXG4gICAgICBzY2hlbWEsXG4gICAgICBzdHJ1Y3R1cmVkQ2xvbmluZ1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7aW1wb3J0KCcuL3R5cGVzLmpzJykuZGVmYXVsdH0gdHlwZXNcbiAgICogQHBhcmFtIHtBdmFpbGFibGVGb3JtYXR9IGZvcm1hdFxuICAgKiBAcGFyYW0ge1N0cnVjdHVyZWRDbG9uZVZhbHVlfSByZWNvcmRcbiAgICogQHBhcmFtIHtpbXBvcnQoJy4vdHlwZXMuanMnKS5TdGF0ZU9iamVjdH0gc3RhdGVPYmpcbiAgICogQHJldHVybnMge1Byb21pc2U8UmVxdWlyZWQ8aW1wb3J0KCcuL3R5cGVzLmpzJykuU3RhdGVPYmplY3Q+Pn1cbiAgICovXG4gIGFzeW5jIGdldENvbnRyb2xzRm9yRm9ybWF0QW5kVmFsdWUgKHR5cGVzLCBmb3JtYXQsIHJlY29yZCwgc3RhdGVPYmopIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5hdmFpbGFibGVGb3JtYXRzW2Zvcm1hdF0uXG4gICAgICBpdGVyYXRlKHJlY29yZCwge1xuICAgICAgICAuLi5zdGF0ZU9iaixcbiAgICAgICAgdHlwZXMsXG4gICAgICAgIGZvcm1hdHM6IHRoaXMsXG4gICAgICAgIC8vIFRoaXMgaGFkIGJlZW4gYmVmb3JlIGBzdGF0ZU9iamAgYnV0IHNob3VsZCBhcHBhcmVudGx5IGhhdmUgcHJlY2VkZW5jZVxuICAgICAgICAvLyAgIG9yIGp1c3QgYXZvaWQgcGFzc2luZyBgZm9ybWF0YCB0byB0aGlzIGZ1bmN0aW9uXG4gICAgICAgIGZvcm1hdFxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge0dldFR5cGVzQW5kU2NoZW1hc0ZvckZvcm1hdEFuZFN0YXRlfVxuICAgKi9cbiAgZ2V0VHlwZXNBbmRTY2hlbWFzRm9yRm9ybWF0QW5kU3RhdGUgKFxuICAgIHR5cGVzLCBmb3JtYXQsIHN0YXRlLCBzY2hlbWFPYmplY3QsIHNjaGVtYU9yaWdpbmFsXG4gICkge1xuICAgIHJldHVybiB0aGlzLmF2YWlsYWJsZUZvcm1hdHNbZm9ybWF0XS5nZXRUeXBlc0FuZFNjaGVtYXNGb3JTdGF0ZShcbiAgICAgIHR5cGVzLCBzdGF0ZSwgc2NoZW1hT2JqZWN0LCBzY2hlbWFPcmlnaW5hbFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtBdmFpbGFibGVGb3JtYXR9IGZvcm1hdFxuICAgKiBAcmV0dXJucyB7Rm9ybWF0fVxuICAgKi9cbiAgZ2V0QXZhaWxhYmxlRm9ybWF0IChmb3JtYXQpIHtcbiAgICByZXR1cm4gdGhpcy5hdmFpbGFibGVGb3JtYXRzW2Zvcm1hdF07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRm9ybWF0cztcbiJdLCJtYXBwaW5ncyI6Imc1Q0FlWTtBQUFBQSxjQUFBLFNBQUFBLENBQUEsU0FBQUMsY0FBQSxXQUFBQSxjQUFBLEVBQUFELGNBQUEsR0FmWixNQUFPLENBQUFFLFlBQVksS0FBTSwyQkFBMkIsQ0FDcEQsTUFBTyxDQUFBQyxJQUFJLEtBQU0sbUJBQW1CLENBQ3BDLE1BQU8sQ0FBQUMsaUJBQWlCLEtBQU0sZ0NBQWdDLENBQzlELE1BQU8sQ0FBQUMsTUFBTSxLQUFNLHFCQUFxQixDQUV4QztBQUNBO0FBQ0E7QUFDQSxHQUhBLENBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQVZBLENBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQVBBLENBU0E7QUFDQTtBQUNBLEdBRkEsQ0FJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FMQSxDQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FQQSxDQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0EvQkEsQ0FpQ0E7QUFDQTtBQUNBLEdBQ0EsS0FBTSxDQUFBQyxPQUFRLENBQ1o7QUFDRjtBQUNBLEtBQ0VDLFdBQVdBLENBQUEsQ0FBSSxDQUFBUCxjQUFBLEdBQUFRLENBQUEsTUFBQVIsY0FBQSxHQUFBUyxDQUFBLE1BQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksQ0FBQ0MsZ0JBQWdCLENBQUcsc0NBQXdDLENBQzlEUixZQUFZLENBQ1pDLElBQUksQ0FDSkUsTUFBTSxDQUNORCxpQkFDRixDQUFFLENBQ0osQ0FFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUNFLEtBQU0sQ0FBQU8sNEJBQTRCQSxDQUFFQyxLQUFLLENBQUVDLE1BQU0sQ0FBRUMsTUFBTSxDQUFFQyxRQUFRLENBQUUsQ0FBQWYsY0FBQSxHQUFBUSxDQUFBLE1BQUFSLGNBQUEsR0FBQVMsQ0FBQSxNQUNuRSxNQUFPLE1BQU0sS0FBSSxDQUFDQyxnQkFBZ0IsQ0FBQ0csTUFBTSxDQUFDLENBQ3hDRyxPQUFPLENBQUNGLE1BQU0sQ0FBRSxDQUNkLEdBQUdDLFFBQVEsQ0FDWEgsS0FBSyxDQUNMSyxPQUFPLENBQUUsSUFBSSxDQUNiO0FBQ0E7QUFDQUosTUFDRixDQUFDLENBQUMsQ0FDTixDQUVBO0FBQ0Y7QUFDQSxLQUNFSyxtQ0FBbUNBLENBQ2pDTixLQUFLLENBQUVDLE1BQU0sQ0FBRU0sS0FBSyxDQUFFQyxZQUFZLENBQUVDLGNBQWMsQ0FDbEQsQ0FBQXJCLGNBQUEsR0FBQVEsQ0FBQSxNQUFBUixjQUFBLEdBQUFTLENBQUEsTUFDQSxNQUFPLEtBQUksQ0FBQ0MsZ0JBQWdCLENBQUNHLE1BQU0sQ0FBQyxDQUFDUywwQkFBMEIsQ0FDN0RWLEtBQUssQ0FBRU8sS0FBSyxDQUFFQyxZQUFZLENBQUVDLGNBQzlCLENBQUMsQ0FDSCxDQUVBO0FBQ0Y7QUFDQTtBQUNBLEtBQ0VFLGtCQUFrQkEsQ0FBRVYsTUFBTSxDQUFFLENBQUFiLGNBQUEsR0FBQVEsQ0FBQSxNQUFBUixjQUFBLEdBQUFTLENBQUEsTUFDMUIsTUFBTyxLQUFJLENBQUNDLGdCQUFnQixDQUFDRyxNQUFNLENBQUMsQ0FDdEMsQ0FDRixDQUVBLGNBQWUsQ0FBQVAsT0FBTyIsImlnbm9yZUxpc3QiOltdfQ==
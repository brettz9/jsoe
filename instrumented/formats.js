function cov_1u5uhk019l(){var path="/Users/brett/jsoe/src/formats.js";var hash="f1b088339e3079a48ecfb3fef1849dda978485bd";var global=new Function("return this")();var gcv="__coverage__";var coverageData={path:"/Users/brett/jsoe/src/formats.js",statementMap:{"0":{start:{line:124,column:4},end:{line:130,column:7}},"1":{start:{line:141,column:4},end:{line:149,column:9}},"2":{start:{line:158,column:4},end:{line:160,column:6}},"3":{start:{line:168,column:4},end:{line:168,column:41}}},fnMap:{"0":{name:"(anonymous_0)",decl:{start:{line:97,column:2},end:{line:97,column:3}},loc:{start:{line:97,column:17},end:{line:131,column:3}},line:97},"1":{name:"(anonymous_1)",decl:{start:{line:140,column:2},end:{line:140,column:3}},loc:{start:{line:140,column:71},end:{line:150,column:3}},line:140},"2":{name:"(anonymous_2)",decl:{start:{line:155,column:2},end:{line:155,column:3}},loc:{start:{line:157,column:4},end:{line:161,column:3}},line:157},"3":{name:"(anonymous_3)",decl:{start:{line:167,column:2},end:{line:167,column:3}},loc:{start:{line:167,column:30},end:{line:169,column:3}},line:167}},branchMap:{},s:{"0":0,"1":0,"2":0,"3":0},f:{"0":0,"1":0,"2":0,"3":0},b:{},_coverageSchema:"1a1c01bbd47fc00a2c39e90264f33305004495a9",hash:"f1b088339e3079a48ecfb3fef1849dda978485bd"};var coverage=global[gcv]||(global[gcv]={});if(!coverage[path]||coverage[path].hash!==hash){coverage[path]=coverageData;}var actualCoverage=coverage[path];{// @ts-ignore
cov_1u5uhk019l=function(){return actualCoverage;};}return actualCoverage;}cov_1u5uhk019l();import indexedDBKey from'./formats/indexedDBKey.js';import json from'./formats/json.js';import structuredCloning from'./formats/structuredCloning.js';import arbitraryJS from'./formats/arbitraryJS.js';import schema from'./formats/schema.js';/**
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
 * @typedef {"indexedDBKey"|"json"|"structuredCloning"|
 *   "arbitraryJS"|"schema"} AvailableFormat
 */ /**
 * @typedef {{
 *   types: (import('./types.js').AvailableArbitraryType)[],
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
 * @property {() => (
 *   import('./types.js').AvailableArbitraryType
 * )[]} types Returns list
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
 *   typesonType: import('./types.js').AvailableArbitraryType,
 *   types: import('./types.js').default,
 *   v?: import('./formats.js').StructuredCloneValue,
 *   arrayOrObjectPropertyName?: string,
 *   parentSchema?: [import('zodex').SzType, number|undefined]|undefined,
 *   stateObj?: import('./types.js').StateObject,
 * ) => {
 *   type: import('./types.js').AvailableArbitraryType|undefined
 *   schema?: import('zodex').SzType|undefined,
 *   mustBeOptional?: boolean,
 *   schemaIdx?: number
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
//     case 'arbitraryJS':
//       formatValue = arbitraryJS;
//       break;
//     default:
//       throw new Error('Unknown format');
//     }
//     this.availableFormats[format] = formatValue;
//   });
//   return;
// }
// Using methods ensure we have fresh copies
this.availableFormats=/** @type {{[key: string]: Format}} */{indexedDBKey,json,structuredCloning,arbitraryJS,schema};}/**
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMXU1dWhrMDE5bCIsImFjdHVhbENvdmVyYWdlIiwiaW5kZXhlZERCS2V5IiwianNvbiIsInN0cnVjdHVyZWRDbG9uaW5nIiwiYXJiaXRyYXJ5SlMiLCJzY2hlbWEiLCJGb3JtYXRzIiwiY29uc3RydWN0b3IiLCJmIiwicyIsImF2YWlsYWJsZUZvcm1hdHMiLCJnZXRDb250cm9sc0ZvckZvcm1hdEFuZFZhbHVlIiwidHlwZXMiLCJmb3JtYXQiLCJyZWNvcmQiLCJzdGF0ZU9iaiIsIml0ZXJhdGUiLCJmb3JtYXRzIiwiZ2V0VHlwZXNBbmRTY2hlbWFzRm9yRm9ybWF0QW5kU3RhdGUiLCJzdGF0ZSIsInNjaGVtYU9iamVjdCIsInNjaGVtYU9yaWdpbmFsIiwiZ2V0VHlwZXNBbmRTY2hlbWFzRm9yU3RhdGUiLCJnZXRBdmFpbGFibGVGb3JtYXQiXSwic291cmNlcyI6WyJmb3JtYXRzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbmRleGVkREJLZXkgZnJvbSAnLi9mb3JtYXRzL2luZGV4ZWREQktleS5qcyc7XG5pbXBvcnQganNvbiBmcm9tICcuL2Zvcm1hdHMvanNvbi5qcyc7XG5pbXBvcnQgc3RydWN0dXJlZENsb25pbmcgZnJvbSAnLi9mb3JtYXRzL3N0cnVjdHVyZWRDbG9uaW5nLmpzJztcbmltcG9ydCBhcmJpdHJhcnlKUyBmcm9tICcuL2Zvcm1hdHMvYXJiaXRyYXJ5SlMuanMnO1xuaW1wb3J0IHNjaGVtYSBmcm9tICcuL2Zvcm1hdHMvc2NoZW1hLmpzJztcblxuLyoqXG4gKiBBbiBhcmJpdHJhcnkgU3RydWN0dXJlZCBDbG9uZSwgSlNPTiwgZXRjLiB2YWx1ZS5cbiAqIEB0eXBlZGVmIHthbnl9IFN0cnVjdHVyZWRDbG9uZVZhbHVlXG4gKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgR2V0VHlwZXNBbmRTY2hlbWFzRm9yRm9ybWF0QW5kU3RhdGVcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3R5cGVzLmpzJykuZGVmYXVsdH0gdHlwZXNcbiAqIEBwYXJhbSB7QXZhaWxhYmxlRm9ybWF0fSBmb3JtYXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RhdGVdXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9mb3JtYXRBbmRUeXBlQ2hvaWNlcy5qcycpLlpvZGV4U2NoZW1hfFxuICogICB1bmRlZmluZWR9IFtzY2hlbWFPYmplY3RdXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi9mb3JtYXRBbmRUeXBlQ2hvaWNlcy5qcycpLlpvZGV4U2NoZW1hfFxuICogICB1bmRlZmluZWR9IFtzY2hlbWFPcmlnaW5hbF1cbiAqIEByZXR1cm5zIHtUeXBlc0FuZFNjaGVtYU9iamVjdHN8dW5kZWZpbmVkfVxuICovXG5cbi8qIHNjaGVtYTpcbmV4cG9ydCBjb25zdCBnZXRUeXBlRm9yRm9ybWF0U3RhdGVBbmRWYWx1ZSA9ICh7Zm9ybWF0LCBzdGF0ZSwgdmFsdWV9KSA9PiB7XG4gIGNvbnN0IHZhbFR5cGUgPSBuZXcgVHlwZXNvbigpLnJlZ2lzdGVyKFxuICAgIHN0cnVjdHVyZWRDbG9uaW5nVGhyb3dpbmdcbiAgKS5yb290VHlwZU5hbWUodmFsdWUpO1xuICByZXR1cm4gY2Fub25pY2FsVG9BdmFpbGFibGVUeXBlKGZvcm1hdCwgc3RhdGUsIHZhbFR5cGUsIHZhbHVlKTtcbn07XG4qL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtcImluZGV4ZWREQktleVwifFwianNvblwifFwic3RydWN0dXJlZENsb25pbmdcInxcbiAqICAgXCJhcmJpdHJhcnlKU1wifFwic2NoZW1hXCJ9IEF2YWlsYWJsZUZvcm1hdFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge3tcbiAqICAgdHlwZXM6IChpbXBvcnQoJy4vdHlwZXMuanMnKS5BdmFpbGFibGVBcmJpdHJhcnlUeXBlKVtdLFxuICogICBzY2hlbWFPYmplY3RzOiBpbXBvcnQoJy4vZm9ybWF0cy9zY2hlbWEuanMnKS5ab2RleFNjaGVtYVtdXG4gKiB9fSBUeXBlc0FuZFNjaGVtYU9iamVjdHNcbiAqL1xuXG4vKipcbiAqIFJlc3BvbnNpYmxlIGZvciB0cmF2ZXJzaW5nIG92ZXIgZGF0YSAoYWxvbmcgd2l0aCBzdGF0ZSBpbmZvcm1hdGlvbikgdG8gYnVpbGRcbiAqICAgYW5kIHJldHVybiBhIHJlbGV2YW50IFVJIGVsZW1lbnQuXG4gKiBAY2FsbGJhY2sgRm9ybWF0SXRlcmF0b3JcbiAqIEBwYXJhbSB7U3RydWN0dXJlZENsb25lVmFsdWV9IHJlY29yZHNcbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3R5cGVzLmpzJykuU3RhdGVPYmplY3R9IHN0YXRlT2JqXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxSZXF1aXJlZDxpbXBvcnQoJy4vdHlwZXMuanMnKS5TdGF0ZU9iamVjdD4+fVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gRm9ybWF0XG4gKiBAcHJvcGVydHkgeygpID0+IChcbiAqICAgaW1wb3J0KCcuL3R5cGVzLmpzJykuQXZhaWxhYmxlQXJiaXRyYXJ5VHlwZVxuICogKVtdfSB0eXBlcyBSZXR1cm5zIGxpc3RcbiAqICAgb2YgdHlwZXMgZ2VuZXJhbGx5IGF2YWlsYWJsZSB0byBzdHJ1Y3R1cmVkIGNsb25pbmcuIFNlZVxuICogICB7QGxpbmsgZ2V0VHlwZXNBbmRTY2hlbWFzRm9yU3RhdGV9IGZvciBjb250ZXh0LWRlcGVuZGVudCBtZXRob2QuXG4gKiBAcHJvcGVydHkge0Zvcm1hdEl0ZXJhdG9yfSBpdGVyYXRlIFRyYXZlcnNlcyBvdmVyIGRhdGEgdG8gYnVpbGQgYW5kIHJldHVyblxuICogICBhIHJlbGV2YW50IFVJIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkgeyhcbiAqICAgdHlwZXM6IGltcG9ydCgnLi90eXBlcy5qcycpLmRlZmF1bHQsXG4gKiAgIHN0YXRlPzogc3RyaW5nLFxuICogICBzY2hlbWFPYmplY3Q/OiBpbXBvcnQoJy4vZm9ybWF0QW5kVHlwZUNob2ljZXMuanMnKS5ab2RleFNjaGVtYXxcbiAqICAgICB1bmRlZmluZWQsXG4gKiAgIHNjaGVtYU9yaWdpbmFsPzogaW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8XG4gKiAgICAgdW5kZWZpbmVkXG4gKiApID0+IFR5cGVzQW5kU2NoZW1hT2JqZWN0c3x1bmRlZmluZWR9IGdldFR5cGVzQW5kU2NoZW1hc0ZvclN0YXRlIEdldHMgdGhlXG4gKiAgIHNwZWNpZmljIHR5cGVzIChhbmQgc2NoZW1hcykgcmVsZXZhbnQgdG8gYSBnaXZlbiBzdGF0ZS5cbiAqIEBwcm9wZXJ0eSB7KFxuICogICAgIG5ld1R5cGU6IHN0cmluZywgdmFsdWU6IERhdGV8QXJyYXk8U3RydWN0dXJlZENsb25lVmFsdWU+XG4gKiAgICkgPT4gYm9vbGVhbnx1bmRlZmluZWR9IFt0ZXN0SW52YWxpZF1cbiAqIEBwcm9wZXJ0eSB7KFxuICogICB0eXBlc29uVHlwZTogaW1wb3J0KCcuL3R5cGVzLmpzJykuQXZhaWxhYmxlQXJiaXRyYXJ5VHlwZSxcbiAqICAgdHlwZXM6IGltcG9ydCgnLi90eXBlcy5qcycpLmRlZmF1bHQsXG4gKiAgIHY/OiBpbXBvcnQoJy4vZm9ybWF0cy5qcycpLlN0cnVjdHVyZWRDbG9uZVZhbHVlLFxuICogICBhcnJheU9yT2JqZWN0UHJvcGVydHlOYW1lPzogc3RyaW5nLFxuICogICBwYXJlbnRTY2hlbWE/OiBbaW1wb3J0KCd6b2RleCcpLlN6VHlwZSwgbnVtYmVyfHVuZGVmaW5lZF18dW5kZWZpbmVkLFxuICogICBzdGF0ZU9iaj86IGltcG9ydCgnLi90eXBlcy5qcycpLlN0YXRlT2JqZWN0LFxuICogKSA9PiB7XG4gKiAgIHR5cGU6IGltcG9ydCgnLi90eXBlcy5qcycpLkF2YWlsYWJsZUFyYml0cmFyeVR5cGV8dW5kZWZpbmVkXG4gKiAgIHNjaGVtYT86IGltcG9ydCgnem9kZXgnKS5TelR5cGV8dW5kZWZpbmVkLFxuICogICBtdXN0QmVPcHRpb25hbD86IGJvb2xlYW4sXG4gKiAgIHNjaGVtYUlkeD86IG51bWJlclxuICogfX0gW2NvbnZlcnRGcm9tVHlwZXNvbl1cbiAqL1xuXG4vKipcbiAqIENsYXNzIGZvciBwcm9jZXNzaW5nIG11bHRpcGxlIGZvcm1hdHMuXG4gKi9cbmNsYXNzIEZvcm1hdHMge1xuICAvKipcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICAvLyBDYW4gZW5hYmxlIGxhdGVyIChhbmQgYWRkIHRlc3RzKVxuICAgIC8vIGlmIChmb3JtYXRzKSB7XG4gICAgLy8gICB0aGlzLmF2YWlsYWJsZUZvcm1hdHMgPSB7fTtcbiAgICAvLyAgIGZvcm1hdHMuZm9yRWFjaCgoZm9ybWF0KSA9PiB7XG4gICAgLy8gICAgIGxldCBmb3JtYXRWYWx1ZTtcbiAgICAvLyAgICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAvLyAgICAgY2FzZSAnaW5kZXhlZERCS2V5JzpcbiAgICAvLyAgICAgICBmb3JtYXRWYWx1ZSA9IGluZGV4ZWREQktleTtcbiAgICAvLyAgICAgICBicmVhaztcbiAgICAvLyAgICAgY2FzZSAnanNvbic6XG4gICAgLy8gICAgICAgZm9ybWF0VmFsdWUgPSBqc29uO1xuICAgIC8vICAgICAgIGJyZWFrO1xuICAgIC8vICAgICBjYXNlICdzdHJ1Y3R1cmVkQ2xvbmluZyc6XG4gICAgLy8gICAgICAgZm9ybWF0VmFsdWUgPSBzdHJ1Y3R1cmVkQ2xvbmluZztcbiAgICAvLyAgICAgICBicmVhaztcbiAgICAvLyAgICAgY2FzZSAnYXJiaXRyYXJ5SlMnOlxuICAgIC8vICAgICAgIGZvcm1hdFZhbHVlID0gYXJiaXRyYXJ5SlM7XG4gICAgLy8gICAgICAgYnJlYWs7XG4gICAgLy8gICAgIGRlZmF1bHQ6XG4gICAgLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGZvcm1hdCcpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHRoaXMuYXZhaWxhYmxlRm9ybWF0c1tmb3JtYXRdID0gZm9ybWF0VmFsdWU7XG4gICAgLy8gICB9KTtcbiAgICAvLyAgIHJldHVybjtcbiAgICAvLyB9XG4gICAgLy8gVXNpbmcgbWV0aG9kcyBlbnN1cmUgd2UgaGF2ZSBmcmVzaCBjb3BpZXNcbiAgICB0aGlzLmF2YWlsYWJsZUZvcm1hdHMgPSAvKiogQHR5cGUge3tba2V5OiBzdHJpbmddOiBGb3JtYXR9fSAqLyAoe1xuICAgICAgaW5kZXhlZERCS2V5LFxuICAgICAganNvbixcbiAgICAgIHN0cnVjdHVyZWRDbG9uaW5nLFxuICAgICAgYXJiaXRyYXJ5SlMsXG4gICAgICBzY2hlbWFcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2ltcG9ydCgnLi90eXBlcy5qcycpLmRlZmF1bHR9IHR5cGVzXG4gICAqIEBwYXJhbSB7QXZhaWxhYmxlRm9ybWF0fSBmb3JtYXRcbiAgICogQHBhcmFtIHtTdHJ1Y3R1cmVkQ2xvbmVWYWx1ZX0gcmVjb3JkXG4gICAqIEBwYXJhbSB7aW1wb3J0KCcuL3R5cGVzLmpzJykuU3RhdGVPYmplY3R9IHN0YXRlT2JqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFJlcXVpcmVkPGltcG9ydCgnLi90eXBlcy5qcycpLlN0YXRlT2JqZWN0Pj59XG4gICAqL1xuICBhc3luYyBnZXRDb250cm9sc0ZvckZvcm1hdEFuZFZhbHVlICh0eXBlcywgZm9ybWF0LCByZWNvcmQsIHN0YXRlT2JqKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuYXZhaWxhYmxlRm9ybWF0c1tmb3JtYXRdLlxuICAgICAgaXRlcmF0ZShyZWNvcmQsIHtcbiAgICAgICAgLi4uc3RhdGVPYmosXG4gICAgICAgIHR5cGVzLFxuICAgICAgICBmb3JtYXRzOiB0aGlzLFxuICAgICAgICAvLyBUaGlzIGhhZCBiZWVuIGJlZm9yZSBgc3RhdGVPYmpgIGJ1dCBzaG91bGQgYXBwYXJlbnRseSBoYXZlIHByZWNlZGVuY2VcbiAgICAgICAgLy8gICBvciBqdXN0IGF2b2lkIHBhc3NpbmcgYGZvcm1hdGAgdG8gdGhpcyBmdW5jdGlvblxuICAgICAgICBmb3JtYXRcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtHZXRUeXBlc0FuZFNjaGVtYXNGb3JGb3JtYXRBbmRTdGF0ZX1cbiAgICovXG4gIGdldFR5cGVzQW5kU2NoZW1hc0ZvckZvcm1hdEFuZFN0YXRlIChcbiAgICB0eXBlcywgZm9ybWF0LCBzdGF0ZSwgc2NoZW1hT2JqZWN0LCBzY2hlbWFPcmlnaW5hbFxuICApIHtcbiAgICByZXR1cm4gdGhpcy5hdmFpbGFibGVGb3JtYXRzW2Zvcm1hdF0uZ2V0VHlwZXNBbmRTY2hlbWFzRm9yU3RhdGUoXG4gICAgICB0eXBlcywgc3RhdGUsIHNjaGVtYU9iamVjdCwgc2NoZW1hT3JpZ2luYWxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7QXZhaWxhYmxlRm9ybWF0fSBmb3JtYXRcbiAgICogQHJldHVybnMge0Zvcm1hdH1cbiAgICovXG4gIGdldEF2YWlsYWJsZUZvcm1hdCAoZm9ybWF0KSB7XG4gICAgcmV0dXJuIHRoaXMuYXZhaWxhYmxlRm9ybWF0c1tmb3JtYXRdO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcm1hdHM7XG4iXSwibWFwcGluZ3MiOiJnNUNBZVk7QUFBQUEsY0FBQSxTQUFBQSxDQUFBLFNBQUFDLGNBQUEsV0FBQUEsY0FBQSxFQUFBRCxjQUFBLEdBZlosTUFBTyxDQUFBRSxZQUFZLEtBQU0sMkJBQTJCLENBQ3BELE1BQU8sQ0FBQUMsSUFBSSxLQUFNLG1CQUFtQixDQUNwQyxNQUFPLENBQUFDLGlCQUFpQixLQUFNLGdDQUFnQyxDQUM5RCxNQUFPLENBQUFDLFdBQVcsS0FBTSwwQkFBMEIsQ0FDbEQsTUFBTyxDQUFBQyxNQUFNLEtBQU0scUJBQXFCLENBRXhDO0FBQ0E7QUFDQTtBQUNBLEdBSEEsQ0FLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBVkEsQ0FZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBUEEsQ0FTQTtBQUNBO0FBQ0E7QUFDQSxHQUhBLENBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBTEEsQ0FPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBUEEsQ0FTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBbENBLENBb0NBO0FBQ0E7QUFDQSxHQUNBLEtBQU0sQ0FBQUMsT0FBUSxDQUNaO0FBQ0Y7QUFDQSxLQUNFQyxXQUFXQSxDQUFBLENBQUksQ0FBQVIsY0FBQSxHQUFBUyxDQUFBLE1BQUFULGNBQUEsR0FBQVUsQ0FBQSxNQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLENBQUNDLGdCQUFnQixDQUFHLHNDQUF3QyxDQUM5RFQsWUFBWSxDQUNaQyxJQUFJLENBQ0pDLGlCQUFpQixDQUNqQkMsV0FBVyxDQUNYQyxNQUNGLENBQUUsQ0FDSixDQUVBO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQ0UsS0FBTSxDQUFBTSw0QkFBNEJBLENBQUVDLEtBQUssQ0FBRUMsTUFBTSxDQUFFQyxNQUFNLENBQUVDLFFBQVEsQ0FBRSxDQUFBaEIsY0FBQSxHQUFBUyxDQUFBLE1BQUFULGNBQUEsR0FBQVUsQ0FBQSxNQUNuRSxNQUFPLE1BQU0sS0FBSSxDQUFDQyxnQkFBZ0IsQ0FBQ0csTUFBTSxDQUFDLENBQ3hDRyxPQUFPLENBQUNGLE1BQU0sQ0FBRSxDQUNkLEdBQUdDLFFBQVEsQ0FDWEgsS0FBSyxDQUNMSyxPQUFPLENBQUUsSUFBSSxDQUNiO0FBQ0E7QUFDQUosTUFDRixDQUFDLENBQUMsQ0FDTixDQUVBO0FBQ0Y7QUFDQSxLQUNFSyxtQ0FBbUNBLENBQ2pDTixLQUFLLENBQUVDLE1BQU0sQ0FBRU0sS0FBSyxDQUFFQyxZQUFZLENBQUVDLGNBQWMsQ0FDbEQsQ0FBQXRCLGNBQUEsR0FBQVMsQ0FBQSxNQUFBVCxjQUFBLEdBQUFVLENBQUEsTUFDQSxNQUFPLEtBQUksQ0FBQ0MsZ0JBQWdCLENBQUNHLE1BQU0sQ0FBQyxDQUFDUywwQkFBMEIsQ0FDN0RWLEtBQUssQ0FBRU8sS0FBSyxDQUFFQyxZQUFZLENBQUVDLGNBQzlCLENBQUMsQ0FDSCxDQUVBO0FBQ0Y7QUFDQTtBQUNBLEtBQ0VFLGtCQUFrQkEsQ0FBRVYsTUFBTSxDQUFFLENBQUFkLGNBQUEsR0FBQVMsQ0FBQSxNQUFBVCxjQUFBLEdBQUFVLENBQUEsTUFDMUIsTUFBTyxLQUFJLENBQUNDLGdCQUFnQixDQUFDRyxNQUFNLENBQUMsQ0FDdEMsQ0FDRixDQUVBLGNBQWUsQ0FBQVAsT0FBTyIsImlnbm9yZUxpc3QiOltdfQ==
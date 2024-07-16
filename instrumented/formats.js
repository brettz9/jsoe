function cov_1u5uhk019l(){var path="/Users/brett/jsoe/src/formats.js";var hash="977c6ebfa2d4bcc9536284fbb76059ad46c29fb8";var global=new Function("return this")();var gcv="__coverage__";var coverageData={path:"/Users/brett/jsoe/src/formats.js",statementMap:{"0":{start:{line:94,column:4},end:{line:99,column:7}},"1":{start:{line:110,column:4},end:{line:118,column:9}},"2":{start:{line:127,column:4},end:{line:129,column:6}},"3":{start:{line:137,column:4},end:{line:137,column:41}}},fnMap:{"0":{name:"(anonymous_0)",decl:{start:{line:70,column:2},end:{line:70,column:3}},loc:{start:{line:70,column:17},end:{line:100,column:3}},line:70},"1":{name:"(anonymous_1)",decl:{start:{line:109,column:2},end:{line:109,column:3}},loc:{start:{line:109,column:71},end:{line:119,column:3}},line:109},"2":{name:"(anonymous_2)",decl:{start:{line:124,column:2},end:{line:124,column:3}},loc:{start:{line:126,column:4},end:{line:130,column:3}},line:126},"3":{name:"(anonymous_3)",decl:{start:{line:136,column:2},end:{line:136,column:3}},loc:{start:{line:136,column:30},end:{line:138,column:3}},line:136}},branchMap:{},s:{"0":0,"1":0,"2":0,"3":0},f:{"0":0,"1":0,"2":0,"3":0},b:{},_coverageSchema:"1a1c01bbd47fc00a2c39e90264f33305004495a9",hash:"977c6ebfa2d4bcc9536284fbb76059ad46c29fb8"};var coverage=global[gcv]||(global[gcv]={});if(!coverage[path]||coverage[path].hash!==hash){coverage[path]=coverageData;}var actualCoverage=coverage[path];{// @ts-ignore
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
 * @typedef {{
 *   types: () => (import('./types.js').AvailableType)[],
 *   testInvalid?: (
 *     newType: string, value: Date|Array<StructuredCloneValue>
 *   ) => boolean|undefined,
 *   convertFromTypeson?: (
 *     typesonType: import('./types.js').AvailableType
 *   ) => import('./types.js').AvailableType|undefined,
 *   iterate: import('./formats/structuredCloning.js').FormatIterator,
 *   getTypesAndSchemasForState: (
 *     types: import('./types.js').default,
 *     state?: string,
 *     schemaObject?: import('./formatAndTypeChoices.js').ZodexSchema|undefined,
 *     schemaOriginal?: import('./formatAndTypeChoices.js').ZodexSchema|
 *       undefined
 *   ) => TypesAndSchemaObjects|undefined
 * }} Format
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMXU1dWhrMDE5bCIsImFjdHVhbENvdmVyYWdlIiwiaW5kZXhlZERCS2V5IiwianNvbiIsInN0cnVjdHVyZWRDbG9uaW5nIiwic2NoZW1hIiwiRm9ybWF0cyIsImNvbnN0cnVjdG9yIiwiZiIsInMiLCJhdmFpbGFibGVGb3JtYXRzIiwiZ2V0Q29udHJvbHNGb3JGb3JtYXRBbmRWYWx1ZSIsInR5cGVzIiwiZm9ybWF0IiwicmVjb3JkIiwic3RhdGVPYmoiLCJpdGVyYXRlIiwiZm9ybWF0cyIsImdldFR5cGVzQW5kU2NoZW1hc0ZvckZvcm1hdEFuZFN0YXRlIiwic3RhdGUiLCJzY2hlbWFPYmplY3QiLCJzY2hlbWFPcmlnaW5hbCIsImdldFR5cGVzQW5kU2NoZW1hc0ZvclN0YXRlIiwiZ2V0QXZhaWxhYmxlRm9ybWF0Il0sInNvdXJjZXMiOlsiZm9ybWF0cy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5kZXhlZERCS2V5IGZyb20gJy4vZm9ybWF0cy9pbmRleGVkREJLZXkuanMnO1xuaW1wb3J0IGpzb24gZnJvbSAnLi9mb3JtYXRzL2pzb24uanMnO1xuaW1wb3J0IHN0cnVjdHVyZWRDbG9uaW5nIGZyb20gJy4vZm9ybWF0cy9zdHJ1Y3R1cmVkQ2xvbmluZy5qcyc7XG5pbXBvcnQgc2NoZW1hIGZyb20gJy4vZm9ybWF0cy9zY2hlbWEuanMnO1xuXG4vKipcbiAqIEFuIGFyYml0cmFyeSBTdHJ1Y3R1cmVkIENsb25lLCBKU09OLCBldGMuIHZhbHVlLlxuICogQHR5cGVkZWYge2FueX0gU3RydWN0dXJlZENsb25lVmFsdWVcbiAqL1xuXG4vKipcbiAqIEBjYWxsYmFjayBHZXRUeXBlc0FuZFNjaGVtYXNGb3JGb3JtYXRBbmRTdGF0ZVxuICogQHBhcmFtIHtpbXBvcnQoJy4vdHlwZXMuanMnKS5kZWZhdWx0fSB0eXBlc1xuICogQHBhcmFtIHtBdmFpbGFibGVGb3JtYXR9IGZvcm1hdFxuICogQHBhcmFtIHtzdHJpbmd9IFtzdGF0ZV1cbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8XG4gKiAgIHVuZGVmaW5lZH0gW3NjaGVtYU9iamVjdF1cbiAqIEBwYXJhbSB7aW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8XG4gKiAgIHVuZGVmaW5lZH0gW3NjaGVtYU9yaWdpbmFsXVxuICogQHJldHVybnMge1R5cGVzQW5kU2NoZW1hT2JqZWN0c3x1bmRlZmluZWR9XG4gKi9cblxuLyogc2NoZW1hOlxuZXhwb3J0IGNvbnN0IGdldFR5cGVGb3JGb3JtYXRTdGF0ZUFuZFZhbHVlID0gKHtmb3JtYXQsIHN0YXRlLCB2YWx1ZX0pID0+IHtcbiAgY29uc3QgdmFsVHlwZSA9IG5ldyBUeXBlc29uKCkucmVnaXN0ZXIoXG4gICAgc3RydWN0dXJlZENsb25pbmdUaHJvd2luZ1xuICApLnJvb3RUeXBlTmFtZSh2YWx1ZSk7XG4gIHJldHVybiBjYW5vbmljYWxUb0F2YWlsYWJsZVR5cGUoZm9ybWF0LCBzdGF0ZSwgdmFsVHlwZSwgdmFsdWUpO1xufTtcbiovXG5cbi8qKlxuICogQHR5cGVkZWYge1wiaW5kZXhlZERCS2V5XCJ8XCJqc29uXCJ8XCJzdHJ1Y3R1cmVkQ2xvbmluZ1wifFwic2NoZW1hXCJ9IEF2YWlsYWJsZUZvcm1hdFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge3tcbiAqICAgdHlwZXM6IChpbXBvcnQoJy4vdHlwZXMuanMnKS5BdmFpbGFibGVUeXBlKVtdLFxuICogICBzY2hlbWFPYmplY3RzOiBpbXBvcnQoJy4vZm9ybWF0cy9zY2hlbWEuanMnKS5ab2RleFNjaGVtYVtdXG4gKiB9fSBUeXBlc0FuZFNjaGVtYU9iamVjdHNcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIHR5cGVzOiAoKSA9PiAoaW1wb3J0KCcuL3R5cGVzLmpzJykuQXZhaWxhYmxlVHlwZSlbXSxcbiAqICAgdGVzdEludmFsaWQ/OiAoXG4gKiAgICAgbmV3VHlwZTogc3RyaW5nLCB2YWx1ZTogRGF0ZXxBcnJheTxTdHJ1Y3R1cmVkQ2xvbmVWYWx1ZT5cbiAqICAgKSA9PiBib29sZWFufHVuZGVmaW5lZCxcbiAqICAgY29udmVydEZyb21UeXBlc29uPzogKFxuICogICAgIHR5cGVzb25UeXBlOiBpbXBvcnQoJy4vdHlwZXMuanMnKS5BdmFpbGFibGVUeXBlXG4gKiAgICkgPT4gaW1wb3J0KCcuL3R5cGVzLmpzJykuQXZhaWxhYmxlVHlwZXx1bmRlZmluZWQsXG4gKiAgIGl0ZXJhdGU6IGltcG9ydCgnLi9mb3JtYXRzL3N0cnVjdHVyZWRDbG9uaW5nLmpzJykuRm9ybWF0SXRlcmF0b3IsXG4gKiAgIGdldFR5cGVzQW5kU2NoZW1hc0ZvclN0YXRlOiAoXG4gKiAgICAgdHlwZXM6IGltcG9ydCgnLi90eXBlcy5qcycpLmRlZmF1bHQsXG4gKiAgICAgc3RhdGU/OiBzdHJpbmcsXG4gKiAgICAgc2NoZW1hT2JqZWN0PzogaW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8dW5kZWZpbmVkLFxuICogICAgIHNjaGVtYU9yaWdpbmFsPzogaW1wb3J0KCcuL2Zvcm1hdEFuZFR5cGVDaG9pY2VzLmpzJykuWm9kZXhTY2hlbWF8XG4gKiAgICAgICB1bmRlZmluZWRcbiAqICAgKSA9PiBUeXBlc0FuZFNjaGVtYU9iamVjdHN8dW5kZWZpbmVkXG4gKiB9fSBGb3JtYXRcbiAqL1xuXG4vKipcbiAqIENsYXNzIGZvciBwcm9jZXNzaW5nIG11bHRpcGxlIGZvcm1hdHMuXG4gKi9cbmNsYXNzIEZvcm1hdHMge1xuICAvKipcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICAvLyBDYW4gZW5hYmxlIGxhdGVyIChhbmQgYWRkIHRlc3RzKVxuICAgIC8vIGlmIChmb3JtYXRzKSB7XG4gICAgLy8gICB0aGlzLmF2YWlsYWJsZUZvcm1hdHMgPSB7fTtcbiAgICAvLyAgIGZvcm1hdHMuZm9yRWFjaCgoZm9ybWF0KSA9PiB7XG4gICAgLy8gICAgIGxldCBmb3JtYXRWYWx1ZTtcbiAgICAvLyAgICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAvLyAgICAgY2FzZSAnaW5kZXhlZERCS2V5JzpcbiAgICAvLyAgICAgICBmb3JtYXRWYWx1ZSA9IGluZGV4ZWREQktleTtcbiAgICAvLyAgICAgICBicmVhaztcbiAgICAvLyAgICAgY2FzZSAnanNvbic6XG4gICAgLy8gICAgICAgZm9ybWF0VmFsdWUgPSBqc29uO1xuICAgIC8vICAgICAgIGJyZWFrO1xuICAgIC8vICAgICBjYXNlICdzdHJ1Y3R1cmVkQ2xvbmluZyc6XG4gICAgLy8gICAgICAgZm9ybWF0VmFsdWUgPSBzdHJ1Y3R1cmVkQ2xvbmluZztcbiAgICAvLyAgICAgICBicmVhaztcbiAgICAvLyAgICAgZGVmYXVsdDpcbiAgICAvLyAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZm9ybWF0Jyk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgdGhpcy5hdmFpbGFibGVGb3JtYXRzW2Zvcm1hdF0gPSBmb3JtYXRWYWx1ZTtcbiAgICAvLyAgIH0pO1xuICAgIC8vICAgcmV0dXJuO1xuICAgIC8vIH1cbiAgICAvLyBVc2luZyBtZXRob2RzIGVuc3VyZSB3ZSBoYXZlIGZyZXNoIGNvcGllc1xuICAgIHRoaXMuYXZhaWxhYmxlRm9ybWF0cyA9IC8qKiBAdHlwZSB7e1trZXk6IHN0cmluZ106IEZvcm1hdH19ICovICh7XG4gICAgICBpbmRleGVkREJLZXksXG4gICAgICBqc29uLFxuICAgICAgc2NoZW1hLFxuICAgICAgc3RydWN0dXJlZENsb25pbmdcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge2ltcG9ydCgnLi90eXBlcy5qcycpLmRlZmF1bHR9IHR5cGVzXG4gICAqIEBwYXJhbSB7QXZhaWxhYmxlRm9ybWF0fSBmb3JtYXRcbiAgICogQHBhcmFtIHtTdHJ1Y3R1cmVkQ2xvbmVWYWx1ZX0gcmVjb3JkXG4gICAqIEBwYXJhbSB7aW1wb3J0KCcuL3R5cGVzLmpzJykuU3RhdGVPYmplY3R9IHN0YXRlT2JqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEVsZW1lbnQ+fVxuICAgKi9cbiAgYXN5bmMgZ2V0Q29udHJvbHNGb3JGb3JtYXRBbmRWYWx1ZSAodHlwZXMsIGZvcm1hdCwgcmVjb3JkLCBzdGF0ZU9iaikge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmF2YWlsYWJsZUZvcm1hdHNbZm9ybWF0XS5cbiAgICAgIGl0ZXJhdGUocmVjb3JkLCB7XG4gICAgICAgIC4uLnN0YXRlT2JqLFxuICAgICAgICB0eXBlcyxcbiAgICAgICAgZm9ybWF0czogdGhpcyxcbiAgICAgICAgLy8gVGhpcyBoYWQgYmVlbiBiZWZvcmUgYHN0YXRlT2JqYCBidXQgc2hvdWxkIGFwcGFyZW50bHkgaGF2ZSBwcmVjZWRlbmNlXG4gICAgICAgIC8vICAgb3IganVzdCBhdm9pZCBwYXNzaW5nIGBmb3JtYXRgIHRvIHRoaXMgZnVuY3Rpb25cbiAgICAgICAgZm9ybWF0XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZSB7R2V0VHlwZXNBbmRTY2hlbWFzRm9yRm9ybWF0QW5kU3RhdGV9XG4gICAqL1xuICBnZXRUeXBlc0FuZFNjaGVtYXNGb3JGb3JtYXRBbmRTdGF0ZSAoXG4gICAgdHlwZXMsIGZvcm1hdCwgc3RhdGUsIHNjaGVtYU9iamVjdCwgc2NoZW1hT3JpZ2luYWxcbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuYXZhaWxhYmxlRm9ybWF0c1tmb3JtYXRdLmdldFR5cGVzQW5kU2NoZW1hc0ZvclN0YXRlKFxuICAgICAgdHlwZXMsIHN0YXRlLCBzY2hlbWFPYmplY3QsIHNjaGVtYU9yaWdpbmFsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0F2YWlsYWJsZUZvcm1hdH0gZm9ybWF0XG4gICAqIEByZXR1cm5zIHtGb3JtYXR9XG4gICAqL1xuICBnZXRBdmFpbGFibGVGb3JtYXQgKGZvcm1hdCkge1xuICAgIHJldHVybiB0aGlzLmF2YWlsYWJsZUZvcm1hdHNbZm9ybWF0XTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGb3JtYXRzO1xuIl0sIm1hcHBpbmdzIjoiODRDQWVZO0FBQUFBLGNBQUEsU0FBQUEsQ0FBQSxTQUFBQyxjQUFBLFdBQUFBLGNBQUEsRUFBQUQsY0FBQSxHQWZaLE1BQU8sQ0FBQUUsWUFBWSxLQUFNLDJCQUEyQixDQUNwRCxNQUFPLENBQUFDLElBQUksS0FBTSxtQkFBbUIsQ0FDcEMsTUFBTyxDQUFBQyxpQkFBaUIsS0FBTSxnQ0FBZ0MsQ0FDOUQsTUFBTyxDQUFBQyxNQUFNLEtBQU0scUJBQXFCLENBRXhDO0FBQ0E7QUFDQTtBQUNBLEdBSEEsQ0FLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBVkEsQ0FZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBUEEsQ0FTQTtBQUNBO0FBQ0EsR0FGQSxDQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUxBLENBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FsQkEsQ0FvQkE7QUFDQTtBQUNBLEdBQ0EsS0FBTSxDQUFBQyxPQUFRLENBQ1o7QUFDRjtBQUNBLEtBQ0VDLFdBQVdBLENBQUEsQ0FBSSxDQUFBUCxjQUFBLEdBQUFRLENBQUEsTUFBQVIsY0FBQSxHQUFBUyxDQUFBLE1BQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksQ0FBQ0MsZ0JBQWdCLENBQUcsc0NBQXdDLENBQzlEUixZQUFZLENBQ1pDLElBQUksQ0FDSkUsTUFBTSxDQUNORCxpQkFDRixDQUFFLENBQ0osQ0FFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUNFLEtBQU0sQ0FBQU8sNEJBQTRCQSxDQUFFQyxLQUFLLENBQUVDLE1BQU0sQ0FBRUMsTUFBTSxDQUFFQyxRQUFRLENBQUUsQ0FBQWYsY0FBQSxHQUFBUSxDQUFBLE1BQUFSLGNBQUEsR0FBQVMsQ0FBQSxNQUNuRSxNQUFPLE1BQU0sS0FBSSxDQUFDQyxnQkFBZ0IsQ0FBQ0csTUFBTSxDQUFDLENBQ3hDRyxPQUFPLENBQUNGLE1BQU0sQ0FBRSxDQUNkLEdBQUdDLFFBQVEsQ0FDWEgsS0FBSyxDQUNMSyxPQUFPLENBQUUsSUFBSSxDQUNiO0FBQ0E7QUFDQUosTUFDRixDQUFDLENBQUMsQ0FDTixDQUVBO0FBQ0Y7QUFDQSxLQUNFSyxtQ0FBbUNBLENBQ2pDTixLQUFLLENBQUVDLE1BQU0sQ0FBRU0sS0FBSyxDQUFFQyxZQUFZLENBQUVDLGNBQWMsQ0FDbEQsQ0FBQXJCLGNBQUEsR0FBQVEsQ0FBQSxNQUFBUixjQUFBLEdBQUFTLENBQUEsTUFDQSxNQUFPLEtBQUksQ0FBQ0MsZ0JBQWdCLENBQUNHLE1BQU0sQ0FBQyxDQUFDUywwQkFBMEIsQ0FDN0RWLEtBQUssQ0FBRU8sS0FBSyxDQUFFQyxZQUFZLENBQUVDLGNBQzlCLENBQUMsQ0FDSCxDQUVBO0FBQ0Y7QUFDQTtBQUNBLEtBQ0VFLGtCQUFrQkEsQ0FBRVYsTUFBTSxDQUFFLENBQUFiLGNBQUEsR0FBQVEsQ0FBQSxNQUFBUixjQUFBLEdBQUFTLENBQUEsTUFDMUIsTUFBTyxLQUFJLENBQUNDLGdCQUFnQixDQUFDRyxNQUFNLENBQUMsQ0FDdEMsQ0FDRixDQUVBLGNBQWUsQ0FBQVAsT0FBTyIsImlnbm9yZUxpc3QiOltdfQ==
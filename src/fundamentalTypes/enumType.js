import {$e} from '../utils/templateUtils.js';

/**
 * @type {import('../types.js').TypeObject}
 */
const enumType = {
  option: ['Enum'],
  stringRegex: /^Enum\((?<innerContent>[^|]*)(?<choices>.*)\)$/u,
  valueMatch (x) {
    return typeof x === 'string';
  },
  toValue (s) {
    return {value: s};
  },
  getInput ({root}) {
    return /** @type {HTMLSelectElement} */ ($e(root, 'select'));
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value;
  },
  getValue ({root}) {
    return this.getInput({root}).value;
  },
  viewUI ({value, specificSchemaObject}) {
    return ['span', {
      dataset: {type: 'enum'},
      title: specificSchemaObject?.description ?? '(an enum)'
    }, [
      value
    ]];
  },
  editUI ({typeNamespace, specificSchemaObject /* , value = '' */}) {
    return ['div', {dataset: {type: 'enum'}}, [
      ['select', {
        name: `${typeNamespace}-enum`
      }, /** @type {import('zodex').SzEnum} */ (
        specificSchemaObject
      )?.values.map((value) => {
        return ['option', {
          selected: specificSchemaObject?.defaultValue === value
        }, [value]];
      })]
    ]];
  }
};

export default enumType;

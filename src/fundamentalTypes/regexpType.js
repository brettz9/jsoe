import {$e} from '../utils/templateUtils.js';
import {jml} from '../../node_modules/jamilih/dist/jml-es.js';
import Types from '../types.js';

/**
 * @type {TypeObject}
 */
const regexpType = {
  option: ['RegExp'],
  stringRegex (nonGrouping) {
    const parenth = nonGrouping ? '(?:' : '(';
    return new RegExp(`^/${parenth}.*)/${parenth}[${
      this.allowedFlags.join('')
    }]{0,${
      this.allowedFlags.length
    }})$`, 'u');
  },
  toValue (s) {
    const [, str, flags] = s.match(this.stringRegex());
    return {value: new RegExp(str, flags)};
  },
  getInput ({root}) {
    return $e(root, 'input');
  },
  setValue ({root, value}) {
    this.getInput({root}).value = value.source;
    this.getSelect({root}).$set([...value.flags]);
  },
  getSelect ({root}) {
    return $e(root, 'select');
  },
  validate ({root}) {
    try {
      this.getValue({root});
      return {valid: true};
    } catch (err) {
      return {
        valid: false,
        message: err.message
      };
    }
  },
  getValue ({root}) {
    return new RegExp(
      this.getInput({root}).value, // .replace(/\\/g, '\\\\'),
      [...this.getSelect({root}).selectedOptions].reduce((s, opt) => {
        return s + opt.value;
      }, '')
    );
  },
  allowedFlags: ['g', 'i', 'm', 'u', 'y', 's'],
  viewUI ({value}) {
    return ['i', {dataset: {type: 'regexp'}}, [String(value)]];
  },
  editUI ({typeNamespace, value = {source: '', flags: ''}}) {
    // Todo (low): Add RegExp syntax highlighter
    const select = jml(
      'select',
      {multiple: true, size: 5, $custom: {
        $set (valArr) { // A useful reusable method for multiple selects
          [...this.options].forEach((opt) => {
            opt.selected = valArr.includes(opt.value);
          });
        }
      }},
      this.allowedFlags.map((flag) => {
        return ['option', {
          selected: value.flags.includes(flag)
        }, [flag]];
      })
    );
    const root = jml('div', {dataset: {type: 'regexp'}}, [
      ['label', [
        'Source ',
        ['input', {
          name: `${typeNamespace}-regexp`, type: 'text',
          value: value.source
        }]
      ]],
      ['br'],
      ['label', [
        'Flags ',
        select
      ]]
    ]);
    // Could be disallowed flags; we might instead try in
    //   advance which will work
    select.addEventListener('change', () => {
      Types.validate({type: 'regexp', root});
    });
    return [root];
  }
};

export default regexpType;

import {jml, body} from '../vendor/jamilih/dist/jml-es.js';

import {
  typeChoices,
  getFormatAndSchemaChoices,
  formatAndTypeChoices,
  Types // , Formats
} from '../src/index.js';

const keyPathNotExpectedTypeChoices = formatAndTypeChoices({
  hasKeyPath: false,
  typeNamespace: 'demo-keypath-not-expected'
});

jml('section', {role: 'main'}, [
  ['h2', [
    'Format and type choices: No key path expected (type can vary at root)'
  ]],

  // Put inside form so can validate
  ['form', [
    ...keyPathNotExpectedTypeChoices.domArray
  ]],

  ['button', {
    $on: {
      click () {
        // eslint-disable-next-line no-alert -- Simple demo
        alert(keyPathNotExpectedTypeChoices.getType());
      }
    }
  }, ['Get type']],

  ['button', {
    $on: {
      click () {
        // eslint-disable-next-line no-alert -- Simple demo
        alert(keyPathNotExpectedTypeChoices.validValuesSet());
      }
    }
  }, ['Is valid']],

  ['button', {
    $on: {
      click () {
        console.log(keyPathNotExpectedTypeChoices.getValue());
      }
    }
  }, ['Log value']],

  ['h2', [
    'Format and type choices: Key path expected (object required at root)'
  ]],
  ...formatAndTypeChoices({
    hasKeyPath: true,
    typeNamespace: 'demo-keypath-expected'
  }).domArray,

  ['h2', [
    'Format choices without type selection ' +
      '(might use as retrieval return format)'
  ]],
  ['select', [
    getFormatAndSchemaChoices()
  ]],

  ['h2', [
    'Type choices only'
  ]],

  (() => {
    const typeSelection = typeChoices({
      format: 'structuredCloning',
      typeNamespace: 'demo-type-choices-only'
    });

    return ['form', {
      $on: {
        submit (e) {
          e.preventDefault();
        }
      }
    }, [
      ...typeSelection.domArray,
      ['button', {
        $on: {
          click () {
            // eslint-disable-next-line no-alert -- Simple demo
            alert(typeSelection.getType());
          }
        }
      }, ['Get type']],

      ['button', {
        $on: {
          click () {
            // eslint-disable-next-line no-alert -- Simple demo
            alert(typeSelection.validValuesSet());
          }
        }
      }, ['Is valid']],

      ['button', {
        $on: {
          click () {
            console.log(typeSelection.getValue());
          }
        }
      }, ['Log value']]
    ]];
  })(),

  ['h2', [
    'Convert structured cloning string representation to value and log'
  ]],
  ['input', {
    placeholder: 'e.g., ["abc", 17]',
    $on: {
      change () {
        const value = Types.getValueForString(this.value, {
          format: 'structuredCloning'
        })[0];
        console.log(value);
      }
    }
  }]
], body);

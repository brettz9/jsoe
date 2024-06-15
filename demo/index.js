import {jml, body, $} from '../src/vendor-imports.js';

import {
  typeChoices,
  getFormatAndSchemaChoices,
  formatAndTypeChoices,
  Types
} from '../src/index.js';

const types = new Types();

const keyPathNotExpectedTypeChoices = formatAndTypeChoices({
  hasKeyPath: false,
  typeNamespace: 'demo-keypath-not-expected'
});

setTimeout(async function () {
  jml('section', {role: 'main'}, [
    ['h1', [
      'Jsoe testing'
    ]],
    ['h2', [
      'Format and type choices: No key path expected (type can vary at root)'
    ]],

    // Put inside form so can validate
    ['form', {id: 'formatAndTypeChoices'}, [
      ...keyPathNotExpectedTypeChoices.domArray
    ]],

    ['button', {
      id: 'getType',
      $on: {
        click () {
          // eslint-disable-next-line no-alert -- Simple demo
          alert(keyPathNotExpectedTypeChoices.getType());
        }
      }
    }, ['Get type']],

    ['button', {
      id: 'isValid',
      $on: {
        click () {
          // eslint-disable-next-line no-alert -- Simple demo
          alert(keyPathNotExpectedTypeChoices.validValuesSet());
        }
      }
    }, ['Is valid']],

    ['button', {
      id: 'logValue',
      $on: {
        click () {
          console.log(keyPathNotExpectedTypeChoices.getValue());
        }
      }
    }, ['Log value']],

    ['button', {
      id: 'viewUI',
      $on: {
        async click () {
          const controls =
            // eslint-disable-next-line @stylistic/max-len -- Long
            await keyPathNotExpectedTypeChoices.formats.getControlsForFormatAndValue(
              keyPathNotExpectedTypeChoices.types,
              'structuredCloning',
              keyPathNotExpectedTypeChoices.getValue(),
              {
                readonly: true
              }
            );
          $('#viewUIResults').firstChild?.remove();
          $('#viewUIResults').append(controls);
        }
      }
    }, ['view UI']],

    ['div', {id: 'viewUIResults'}],

    ['button', {
      id: 'initializeWithValue',
      $on: {
        async click () {
          await keyPathNotExpectedTypeChoices.setValue(42);
        }
      }
    }, ['Initialize with a value']],

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
    ['select', {id: 'formatAndSchemaChoices'}, [
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
        id: 'typeChoicesOnly',
        $on: {
          submit (e) {
            e.preventDefault();
          }
        }
      }, [
        ...typeSelection.domArray,
        ['button', {
          id: 'typeChoicesOnly-getType',
          $on: {
            click () {
              // eslint-disable-next-line no-alert -- Simple demo
              alert(typeSelection.getType());
            }
          }
        }, ['Get type']],

        ['button', {
          id: 'typeChoicesOnly-isValid',
          $on: {
            click () {
              // eslint-disable-next-line no-alert -- Simple demo
              alert(typeSelection.validValuesSet());
            }
          }
        }, ['Is valid']],

        ['button', {
          id: 'validateInitialType',
          $on: {
            click () {
              // eslint-disable-next-line no-alert -- Simple demo
              alert(typeSelection.domArray[0].$validate());
            }
          }
        }, [
          'Validate initial type'
        ]],

        ['button', {
          id: 'typeChoicesOnly-logValue',
          $on: {
            click () {
              console.log(typeSelection.getValue());
            }
          }
        }, ['Log value']],

        ['button', {
          id: 'typeChoicesOnly-initializeWithValue',
          $on: {
            async click () {
              await typeSelection.setValue(42);
            }
          }
        }, ['Initialize with a value']]
      ]];
    })(),

    ['h2', [
      'Convert arbitrary value to an editable menu'
    ]],

    await types.getControlsForFormatAndValue(
      'structuredCloning',
      new Date('1999-01-01')
    ),

    ['h2', [
      'Convert arbitrary value to a readonly menu'
    ]],

    await types.getControlsForFormatAndValue(
      'structuredCloning',
      new Date('1999-01-01'), {
        readonly: true
      }
    ),

    ['h2', [
      'Convert structured cloning string representation to value and log'
    ]],
    ['input', {
      id: 'getValueForString',
      placeholder: 'e.g., ["abc", 17]',
      $on: {
        change () {
          const types = new Types();
          const value = types.getValueForString(this.value, {
            format: 'structuredCloning'
          })[0];
          console.log(value);
        }
      }
    }]
  ], body);
}, 500);

/* globals InternalError */
import {errors as errorsTypesonRegistry} from 'typeson-registry';
import {$e} from '../utils/templateUtils.js';
import {jml} from '../vendor-imports.js';

/**
 * @typedef {number} Integer
 */

/**
 * @param {object} obj
 * @returns {string}
 */
function getConstructor (obj) {
  const str = Function.prototype.toString.call(obj.constructor);
  return str.slice(9, str.indexOf('('));
}

/**
 * @typedef {ErrorConstructor|AggregateErrorConstructor} SpecialErrorType
 */

/** @type {Map<string, SpecialErrorType>} */
const specialErrorsMap = new Map([
  ['TypeError', TypeError],
  ['RangeError', RangeError],
  ['SyntaxError', SyntaxError],
  ['ReferenceError', ReferenceError],
  ['EvalError', EvalError],
  ['URIError', URIError]
]);
if (typeof AggregateError !== 'undefined') {
  specialErrorsMap.set('AggregateError', AggregateError);
}

/* istanbul ignore next 5 */
// @ts-expect-error Only use if available
if (typeof InternalError !== 'undefined') {
  // @ts-expect-error Only use if available
  specialErrorsMap.set('InternalError', InternalError);
}

const specialErrors = [...specialErrorsMap.keys()];

/**
 * @type {import('./SpecialNumberType.js').SuperTypeObject}
 */
const errorsSpecialType = {
  option: ['Special errors'],
  childTypes: specialErrors.map((err) => {
    return err.toLowerCase();
  }),
  stringRegex: new RegExp(
    '^(?<errorClass>' + specialErrors.join('|') +
      ')\\((?<innerContent>.*)\\)$', 'u'
  ),
  toValue (s, rootInfo) {
    const {groups: {
      errorClass
    /* istanbul ignore next -- Should always be found */
    } = {}} = /** @type {RegExpMatchArray} */ (
      /** @type {import('../types.js').RootInfo} */ (rootInfo).match
    );

    const obj = JSON.parse(s);
    const errObj = /** @type {{revive: import('typeson-registry').Reviver}} */ (
      errorsTypesonRegistry[errorClass.toLowerCase()]
    ).revive(obj, {});
    return {value: errObj};
  },
  getInput ({root}) { // Which one to get here?
    return /** @type {HTMLInputElement} */ ($e(root, 'input:not([type])'));
  },
  setValue ({root, value}) {
    /** @type {HTMLSelectElement} */ (
      $e(root, '.errorType')
    ).value = getConstructor(value);

    if (typeof value.message === 'string') {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.message:not([type])')
      ).value = value.message;
    } else {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.message[type=checkbox]')
      ).click();
    }
    if (typeof value.name === 'string') {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.name:not([type])')
      ).value = value.name;
    } else {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.name[type=checkbox]')
      ).click();
    }
    if (typeof value.fileName === 'string') {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.fileName:not([type])')
      ).value = value.fileName;
    } else {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.fileName[type=checkbox]')
      ).click();
    }

    if (typeof value.lineNumber === 'number') {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.lineNumber[type=number]')
      ).value = value.lineNumber;
    } else {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.lineNumber[type=number]')
      ).value = '';
    }

    if (typeof value.columnNumber === 'number') {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.columnNumber[type=number]')
      ).value = value.columnNumber;
    } else {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.columnNumber[type=number]')
      ).value = '';
    }

    if (typeof value.stack === 'string') {
      /** @type {HTMLTextAreaElement} */ (
        $e(root, 'textarea.stack:not([type])')
      ).value = value.stack;
    } else {
      /** @type {HTMLInputElement} */ (
        $e(root, 'input.stack[type=checkbox]')
      ).click();
    }

    setTimeout(() => {
      if (typeof value.cause === 'object') {
        /** @type {HTMLElement} */ ($e(root, '.cause')).click();
        /** @type {import('../types.js').TypeObjectSetValue} */ (
          this.setValue
        )({
          root: /** @type {HTMLDivElement} */ ($e(root, '.causeContents')),
          value: value.cause
        });
      }

      if (Array.isArray(value.errors)) {
        /** @type {HTMLElement} */ ($e(root, '.aggregateErrors')).click();

        const aggregateErrorsContents = /** @type {HTMLDivElement} */ ($e(
          root, '.aggregateErrorsContents'
        ));

        value.errors.forEach((
          /** @type {unknown} */
          error,
          /** @type {Integer} */
          idx
        ) => {
          /** @type {import('../types.js').TypeObjectSetValue} */ (
            this.setValue
          )({
            root: /** @type {HTMLDivElement} */ (
              aggregateErrorsContents.children[idx]
            ),
            value: error
          });
        });
      }
    });
  },
  getValue ({root}) {
    const UserErrorType = specialErrorsMap.get(
      /** @type {HTMLSelectElement} */ (
        $e(root, '.errorType')
      ).value
    );
    if (!UserErrorType) {
      throw new Error('Bad error type');
    }

    /**
     * @type {{
     *   message?: string|undefined
     *   name?: string|undefined
     *   fileName?: string|undefined
     *   stack?: string|undefined,
     *   lineNumber?: number|undefined
     *   columnNumber?: number|undefined
     *   cause?: unknown|undefined
     * }}
     */
    let errObj;
    if (/** @type {HTMLInputElement} */ (
      $e(root, 'input.message[type=checkbox]')
    ).checked) {
      const message = /** @type {HTMLInputElement} */ (
        $e(root, 'input.message:not([type])')
      ).value;
      if (Object.prototype.toString.call(UserErrorType) ===
        '[object AggregateError]') {
        const UET = /** @type {AggregateErrorConstructor} */ (UserErrorType);
        const errors = [...(
          /** @type {HTMLElement} */ ($e(
            root, '.aggregateErrorsContents'
          )).children
        )].map((errorRoot) => {
          return this.getValue({
            root: /** @type {HTMLDivElement} */ (errorRoot)
          });
        });
        errObj = new UET(errors, message);
      } else {
        const UET = /** @type {TypeErrorConstructor} */ (UserErrorType);
        errObj = new UET(message);
      }
    } else {
      if (Object.prototype.toString.call(UserErrorType) ===
        '[object AggregateError]') {
        const UET = /** @type {AggregateErrorConstructor} */ (UserErrorType);
        const errors = [...(
          /** @type {HTMLElement} */ (
            $e(root, '.aggregateErrorsContents')
          ).children
        )].map((errorRoot) => {
          return this.getValue({
            root: /** @type {HTMLDivElement} */ (errorRoot)
          });
        });
        errObj = new UET(errors);
      } else {
        const UET = /** @type {TypeErrorConstructor} */ (UserErrorType);
        errObj = new UET();
      }
      errObj.message = undefined; // Force (at least needed for Chrome)
    }
    if (/** @type {HTMLInputElement} */ (
      $e(root, 'input.name[type=checkbox]')
    ).checked) {
      const name = /** @type {HTMLInputElement} */ (
        $e(root, 'input.name:not([type])')
      ).value;
      errObj.name = name;
    } else {
      errObj.name = undefined;
    }
    if (/** @type {HTMLInputElement} */ (
      $e(root, 'input.fileName[type=checkbox]')
    ).checked) {
      const fileName = /** @type {HTMLInputElement} */ (
        $e(root, 'input.fileName:not([type])')
      ).value;
      errObj.fileName = fileName;
    } else {
      errObj.fileName = undefined;
    }
    if (/** @type {HTMLInputElement} */ (
      $e(root, 'input.stack[type=checkbox]')
    ).checked) {
      const stack = /** @type {HTMLTextAreaElement} */ (
        $e(root, 'textarea.stack:not([type])')
      ).value;
      errObj.stack = stack;
    } else {
      errObj.stack = undefined;
    }

    const lineNumber = /** @type {HTMLInputElement} */ (
      $e(root, 'input.lineNumber[type=number]')
    ).value;
    errObj.lineNumber = lineNumber === '' ? undefined : Number(lineNumber);

    const columnNumber = /** @type {HTMLInputElement} */ (
      $e(root, 'input.columnNumber[type=number]')
    ).value;
    errObj.columnNumber = columnNumber === ''
      ? undefined
      : Number(columnNumber);

    const causeContents = /** @type {HTMLDivElement} */ (
      $e(root, '.causeContents')
    );
    if (causeContents.children.length) {
      errObj.cause = this.getValue({
        root: causeContents
      });
    }

    return errObj;
  },
  viewUI (
    {value: o, format}
  ) {
    const constructor = getConstructor(o);
    return /** @type {import('jamilih').JamilihArray} */ ([
      'div', {dataset: {type: 'errors'}}, [
        ['div', [['b', ['Error type: ']], ['span', [
          constructor
        ]]]],
        typeof o.message === 'string'
          ? ['div', [['b', ['Message: ']], ['span', [o.message]]]]
          : [],
        typeof o.name === 'string'
          ? ['div', [['b', ['Name: ']], ['span', [o.name]]]]
          : [],
        typeof o.fileName === 'string'
          ? ['div', [['b', ['File name: ']], ['span', [o.fileName]]]]
          : [],
        typeof o.lineNumber === 'number'
          ? ['div', [['b', ['Line number: ']], ['span', [o.lineNumber]]]]
          : [],
        typeof o.columnNumber === 'number'
          ? ['div', [['b', ['Column number: ']], ['span', [o.columnNumber]]]]
          : [],
        typeof o.stack === 'string'
          ? ['div', [['b', ['Stack: ']], ['span', [o.stack]]]]
          : [],
        ['b', ['Cause: ']], ['div', {class: 'causeHolder'}, [
          ['button', {$on: {click (/** @type {Event} */ e) {
            e.preventDefault();
            const {target} = e;
            const causeContents = /** @type {HTMLDivElement} */ (
              /** @type {HTMLElement} */ (target).nextElementSibling
            );
            causeContents.hidden = !causeContents.hidden;
            /** @type {HTMLElement} */ (
              target
            ).textContent = causeContents.hidden ? '+' : '-';
          }}}, ['-']],
          ['div', {class: 'causeContents'}, [
            o.cause
              ? this.viewUI({
                format,
                value: o.cause
              })
              : ''
          ]]
        ]],
        constructor === 'AggregateError'
          ? ['div', [
            ['b', ['Errors ']],
            ['div', {class: 'aggregateErrorsHolder'}, [
              ['button', {$on: {click (/** @type {Event} */ e) {
                e.preventDefault();
                const {target} = e;
                const aggregateErrorsContents = /** @type {HTMLDivElement} */ (
                  /** @type {HTMLElement} */ (target).nextElementSibling
                );
                aggregateErrorsContents.hidden =
                  !aggregateErrorsContents.hidden;
                /** @type {HTMLElement} */ (
                  target
                ).textContent = aggregateErrorsContents.hidden ? '+' : '-';
              }}}, ['-']],
              ['div', {class: 'aggregateErrorsContents'}, [
                ...(o.errors
                  ? o.errors.map(
                    (
                      /** @type {unknown} */
                      error
                    ) => {
                      return this.viewUI({
                        format,
                        value: error
                      });
                    }
                  )
                  : [])
              ]]
            ]]
          ]]
          : ''
      ]
    ]);
  },
  editUI ({typeNamespace, value = {
    message: '',
    name: '',
    fileName: '',
    lineNumber: '',
    columnNumber: '',
    stack: '',
    cause: undefined,
    errors: undefined
  }}) {
    /**
     * @param {Event} e
     * @this {HTMLInputElement}
     * @returns {void}
     */
    const click = function (e) {
      /** @type {HTMLElement} */ (
        /** @type {HTMLElement} */ (
          this.parentNode
        ).nextElementSibling
      // eslint-disable-next-line @stylistic/space-unary-ops -- TS
      ).hidden = !
      /** @type {HTMLInputElement} */
      (e.target).checked;
    };
    // eslint-disable-next-line consistent-this -- Clearer
    const component = this;

    if (typeof value.cause === 'object') {
      setTimeout(() => {
        /** @type {HTMLElement} */ ($e(
          div, '.cause'
        )).click();
      });
    }

    if (Array.isArray(value.errors)) {
      setTimeout(() => {
        /** @type {HTMLElement} */ ($e(
          div, '.aggregateErrors'
        )).click();
      });
    }

    const div = /** @type {HTMLDivElement} */ (jml(
      'div',
      {dataset: {type: 'errors'}},
      /** @type {import('jamilih').JamilihChildren} */ ([
        ['div', [
          ['label', [
            'Special error type ',
            ['select', {
              class: 'errorType',
              $on: {
                change () {
                  const aggregateErrorsLabel =
                    /** @type {HTMLLabelElement} */ ($e(
                      /** @type {Element} */
                      (this.parentElement?.closest('div[data-type=errors]')),
                      'label.aggregateErrors'
                    ));
                  aggregateErrorsLabel.hidden =
                    /** @type {HTMLSelectElement} */ (
                      this
                    ).value !== 'AggregateError';
                }
              }
            }, [
              ['option', {value: ''}, ['Select an error type']],
              ...specialErrors.map((errorType) => {
                return ['option', {
                  selected: errorType === getConstructor(value)
                    ? 'selected'
                    : undefined
                }, [
                  errorType
                ]];
              })
            ]]
          ]],
          ['br'],
          ['label', [
            'Message? ',
            ['input', {
              class: 'message',
              type: 'checkbox', checked: typeof value.message === 'string',
              $on: {
                click
              }
            }]
          ]],
          ' ',
          ['label', {
            hidden: typeof value.message !== 'string'
          }, [
            'Message ',
            ['input', {
              class: 'message',
              name: `${typeNamespace}-errors-message`,
              value: value.message
            }]
          ]]
        ]],
        ['div', [
          ['label', [
            'Name? ',
            ['input', {
              class: 'name',
              type: 'checkbox', checked: typeof value.name === 'string',
              $on: {
                click
              }
            }]
          ]],
          ' ',
          ['label', {
            hidden: typeof value.name !== 'string'
          }, [
            'Name ',
            ['input', {
              class: 'name',
              name: `${typeNamespace}-errors-name`,
              value: value.name
            }]
          ]]
        ]],
        ['br'],
        ['div', [
          ['label', [
            'File name? ',
            ['input', {
              class: 'fileName',
              type: 'checkbox', checked: typeof value.fileName === 'string',
              $on: {
                click
              }
            }]
          ]],
          ' ',
          ['label', {
            hidden: typeof value.fileName !== 'string'
          }, [
            'File name ',
            ['input', {
              class: 'fileName',
              name: `${typeNamespace}-errors-fileName`,
              value: value.fileName
            }]
          ]]
        ]],
        ['label', [
          'Line number ',
          ['input', {
            class: 'lineNumber',
            name: `${typeNamespace}-errors-lineNumber`,
            type: 'number', step: 'any', value: value.lineNumber
          }]
        ]],
        ['br'],
        ['label', [
          'Column number ',
          ['input', {
            class: 'columnNumber',
            name: `${typeNamespace}-errors-columnNumber`,
            type: 'number', step: 'any', value: value.columnNumber
          }]
        ]],
        ['div', [
          ['label', [
            'Stack? ',
            ['input', {
              class: 'stack',
              type: 'checkbox', checked: typeof value.stack === 'string',
              $on: {
                click
              }
            }]
          ]],
          ['label', {
            hidden: typeof value.stack !== 'string'
          }, [
            'Stack ',
            ['textarea', {
              class: 'stack',
              name: `${typeNamespace}-errors-stack`
            }, [
              value.stack
            ]]
          ]]
        ]],
        ['label', [
          'Cause? ',
          ['input', {
            class: 'cause',
            type: 'checkbox',
            $on: {
              click (e) {
                click.call(/** @type {HTMLInputElement} */ (this), e);
                const causeHolder = /** @type {Element} */ (
                  /** @type {Element} */ (
                    this.parentElement
                  ).nextElementSibling
                );
                const causeContents = $e(causeHolder, '.causeContents');
                if (!causeContents?.children.length) {
                  const editui = component.editUI({
                    typeNamespace,
                    value: value.cause
                  });
                  jml(...editui, causeContents);
                }
              }
            }
          }]
        ]],
        ['div', {class: 'causeHolder', hidden: true}, [
          ['label', ['Cause ']],
          ['button', {$on: {click (/** @type {Event} */ e) {
            e.preventDefault();
            const {target} = e;
            const causeContents = /** @type {HTMLDivElement} */ ($e(
              /** @type {HTMLElement} */
              (/** @type {HTMLElement} */ (target).closest('.causeHolder')),
              '.causeContents'
            ));
            causeContents.hidden = !causeContents.hidden;
            /** @type {HTMLElement} */ (
              target
            ).textContent = causeContents.hidden ? '+' : '-';
          }}}, ['-']],
          ['div', {class: 'causeContents'}]
        ]],
        ['br'],
        ['label', {class: 'aggregateErrors'}, {
          hidden: Boolean(value.errors)
        }, [
          'Aggregate errors? ',
          ['input', {
            class: 'aggregateErrors',
            type: 'checkbox',
            $on: {
              click (e) {
                click.call(/** @type {HTMLInputElement} */ (this), e);
                const aggregateErrorsHolder = /** @type {Element} */ (
                  /** @type {Element} */ (
                    this.parentElement
                  ).nextElementSibling
                );
                const aggregateErrorsContents = $e(
                  aggregateErrorsHolder, '.aggregateErrorsContents'
                );
                if (!aggregateErrorsContents?.children.length) {
                  // @ts-expect-error Ok
                  jml(...(value.errors.map(
                    (
                      /** @type {unknown} */
                      error
                    ) => {
                      const editui = component.editUI({
                        typeNamespace,
                        value: error
                      });
                      return editui[0];
                    }
                  )), aggregateErrorsContents);
                }
              }
            }
          }]
        ]],
        ['div', {class: 'aggregateErrorsHolder', hidden: true}, [
          ['label', ['Aggregate errors ']],
          ['button', {$on: {click (/** @type {Event} */ e) {
            e.preventDefault();
            const {target} = e;
            const aggregateErrorsContents = /** @type {HTMLDivElement} */ ($e(
              /** @type {HTMLElement} */
              (/** @type {HTMLElement} */ (
                target
              ).closest('.aggregateErrorsHolder')),
              '.aggregateErrorsContents'
            ));
            aggregateErrorsContents.hidden = !aggregateErrorsContents.hidden;
            /** @type {HTMLElement} */ (
              target
            ).textContent = aggregateErrorsContents.hidden ? '+' : '-';
          }}}, ['-']],
          ['div', {class: 'aggregateErrorsContents'}]
        ]]
      ])
    ));

    return [div];
  }
};

export default errorsSpecialType;

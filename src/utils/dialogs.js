/* eslint-disable promise/avoid-new */
import {jml, nbsp} from '../../vendor/jamilih/dist/jml-es.js';
import {$e} from './templateUtils.js';

const localeStrings = {
  submit: 'Submit',
  cancel: 'Cancel',
  ok: 'Ok'
};

// Todo: i18nize
const dialogs = {
  setLocale (locale = {}) {
    this.localeStrings = {...localeStrings, ...locale};
  },
  makeDialog ({atts = {}, children = [], close, remove = true} = {}) {
    if (close) {
      if (!atts.$on) {
        atts.$on = {};
      }
      if (!atts.$on.close) {
        atts.$on.close = close;
      }
    }
    const dialog = jml('dialog', atts, children, document.body);
    dialog.showModal();
    if (remove) {
      dialog.addEventListener('close', () => {
        dialog.remove();
      });
    }
    return dialog;
  },
  makeSubmitDialog ({submit, submitClass = 'submit', ...args}) {
    const dialog = this.makeCancelDialog(args);
    $e(dialog, `button.${args.cancelClass || 'cancel'}`).before(
      jml('button', {
        class: submitClass,
        $on: {
          click (e) {
            submit.call(this, {e, dialog});
          }
        }
      }, [this.localeStrings.submit]),
      nbsp.repeat(2)
    );
    return dialog;
  },
  makeCancelDialog ({
    submit, // Don't pass this on to `args` if present
    cancel,
    cancelClass = 'cancel', submitClass = 'submit',
    ...args
  }) {
    const dialog = this.makeDialog(args);
    jml('div', {class: submitClass}, [
      ['br'], ['br'],
      ['button', {class: cancelClass, $on: {
        click (e) {
          e.preventDefault();
          if (cancel) {
            if (cancel.call(this, {e, dialog}) === false) {
              return;
            }
          }
          dialog.close();
        }
      }}, [this.localeStrings.cancel]]
    ], dialog);
    return dialog;
  },
  alert (message) {
    message = typeof message === 'string' ? {message} : message;
    const {submitClass = 'submit'} = message;
    ({message} = message);
    return new Promise((resolve, _reject) => {
      const dialog = jml('dialog', [
        message,
        ['br'], ['br'],
        ['div', {class: submitClass}, [
          ['button', {$on: {click () {
            dialog.close();
            resolve();
          }}}, [this.localeStrings.ok]]
        ]]
      ], document.body);
      dialog.showModal();
    });
  },
  confirm ({atts = {}, message, submitClass = 'submit'}) {
    ({message} = typeof message === 'string' ? {message} : message);
    return new Promise((resolve, reject) => {
      const dialog = jml('dialog', atts, [
        message,
        ['br'], ['br'],
        ['div', {class: submitClass}, [
          ['button', {$on: {click () {
            dialog.close();
            resolve();
          }}}, [this.localeStrings.ok]],
          nbsp.repeat(2),
          ['button', {$on: {click () {
            dialog.close();
            reject(new Error('cancelled'));
          }}}, [this.localeStrings.cancel]]
        ]]
      ], document.body);
      dialog.showModal();
    });
  }
};

dialogs.setLocale();

export default dialogs;

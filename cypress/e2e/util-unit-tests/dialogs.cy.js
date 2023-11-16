import dialogs from '../../../instrumented/utils/dialogs.js';
// import dialogs from '../../../src/utils/dialogs.js'; // Test Cypress

describe('dialogs', function () {
  describe('makeDialog', function () {
    it('allows close argument', function (done) {
      const dialog = dialogs.makeDialog({
        close () {
          done();
        }
      });

      dialog.close();
    });

    it('allows true close argument', function (done) {
      const dialog = dialogs.makeDialog({
        close: true,
        atts: {
          $on: {
            close () {
              done();
            }
          }
        }
      });

      dialog.close();
    });

    it('can avoid dialog removal', function () {
      dialogs.makeDialog({
        remove: false
      });
    });

    it('allows avoiding children', function () {
      dialogs.makeDialog();
    });
  });

  describe('makeCancelDialog', function () {
    it('supports a cancel argument', function (done) {
      const dialog = dialogs.makeCancelDialog({
        cancel () {
          setTimeout(() => {
            expect(dialog.open).to.equal(false);
            done();
          });
        }
      });
      /** @type {HTMLElement} */ (dialog.querySelector('.cancel')).click();
    });

    it(
      'supports a cancel argument which returns false to avoid closing',
      function (done) {
        const dialog = dialogs.makeCancelDialog({
          cancel () {
            setTimeout(() => {
              expect(dialog.open).to.equal(true);
              done();
            });
            return false;
          }
        });
        /** @type {HTMLElement} */ (dialog.querySelector('.cancel')).click();
      }
    );
  });
  describe('confirm', function () {
    it('confirm supports object-based message', function (done) {
      dialogs.confirm({
        atts: {
          id: 'confirmDialog'
        },
        message: {
          message: 'Please confirm'
        }
      });
      setTimeout(() => {
        const dialog = document.querySelector('#confirmDialog');
        const submit = dialog.querySelector('.submit > button');
        console.log('dialog', dialog.outerHTML);
        /** @type {HTMLElement} */ (submit).click();
        expect(dialog.textContent).to.contain('Please confirm');
        done();
      });
    });
  });

  describe('makeSubmitDialog', function () {
    it('submits', function (done) {
      const dialog = dialogs.makeSubmitDialog({
        submit ({e, dialog}) {
          expect(e).to.be.instanceOf(Event);
          expect(dialog).to.be.instanceOf(HTMLDialogElement);
          done();
        }
      });
      dialog.querySelector('button.submit').click();
    });
  });

  describe('alert', function () {
    it('alerts with simple string', function (done) {
      dialogs.alert('Message1');
      cy.get('dialog[open] button').click();
      cy.get('dialog[open]').should('have.text', 'Message1');
      done();
    });
  });
});

describe('file spec', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8087/demo/index-instrumented.html', {
      onBeforeLoad (win) {
        cy.stub(win.console, 'log').as('consoleLog');
      }
    });
  });
  it('creates form control', () => {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'file'
    );
    cy.get('input[name="demo-keypath-not-expected-file"]').should(
      'exist'
    );
  });

  it('allows selection of local file and shows metadata', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'file'
    );

    cy.get(sel + 'input[name="demo-keypath-not-expected-file"]').selectFile(
      'package.json'
    );

    cy.get(sel + '.fileName').should(($input) => {
      expect($input.val()).to.equal('package.json');
    });

    cy.get(sel + '.size').should(($input) => {
      expect($input.val()).to.match(/\d+/u);
    });

    cy.get(sel + '.contentType').should(($input) => {
      expect($input.val()).to.equal('application/json');
    });

    cy.get(sel + '.lastModified').should(($input) => {
      expect($input.val()).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,3}$/u);
    });

    cy.get(sel + '.clearData').click();

    cy.get(sel + '.fileName').should(($input) => {
      expect($input.val()).to.equal('');
    });

    cy.get(sel + '.size').should(($input) => {
      expect($input.val()).to.equal('');
    });

    cy.get(sel + '.contentType').should(($input) => {
      expect($input.val()).to.equal('');
    });

    cy.get(sel + '.lastModified').should(($input) => {
      expect($input.val()).to.equal('');
    });

    cy.get(sel + '.viewBinary').click();

    cy.get('dialog[open]').should(
      'contain', 'There is no file chosen with binary data'
    );
  });

  it('allows selection of local file and changing of file name', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'file'
    );

    cy.get(sel + 'input[name="demo-keypath-not-expected-file"]').selectFile(
      'package.json'
    );

    cy.clearTypeAndBlur(sel + '.fileName', 'newName.json');

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'newName.json');
  });

  it(
    'allows selection of local file and changing of content type',
    function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'file'
      );

      cy.get(sel + 'input[name="demo-keypath-not-expected-file"]').selectFile(
        'package.json'
      );

      cy.clearTypeAndBlur(sel + '.contentType', 'text/json');

      cy.get('button#viewUI').click();
      cy.get('#viewUIResults').should('contain', 'text/json');
    }
  );

  it(
    'allows selection of local file and content type', function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'file'
      );

      cy.clearTypeAndBlur(sel + '.fileName', 'newName.json');
      cy.clearTypeAndBlur(sel + '.contentType', 'text/json');

      cy.get(sel + '.viewBinary').click();
      cy.get('dialog[open]').should(
        'contain', 'There is no file chosen with binary data'
      );
    }
  );

  it('allows selection of local file and shows binary data', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'file'
    );

    cy.get(sel + 'input[name="demo-keypath-not-expected-file"]').selectFile(
      'package.json'
    );

    cy.get(sel + '.viewBinary').click();

    cy.get('dialog[open] .view-binary').should(
      'contain', '"name": "@es-joy/jsoe"'
    );
  });

  it('logs value', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'file'
    );
    cy.get(sel + 'input[name="demo-keypath-not-expected-file"]').selectFile(
      'package.json'
    );

    cy.get('button#logValue').click();

    // These values aren't precise, but work since console.log only
    //   checks there is an object
    cy.get('@consoleLog').should('be.calledWith', new File([''], '', {
      type: 'application/json',
      lastModified: 1231230
    }));
  });

  it('views UI (JSON)', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'file'
    );
    cy.get(sel + 'input[name="demo-keypath-not-expected-file"]').selectFile(
      'package.json'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'package.json');
    cy.get('#viewUIResults').should('contain', 'application/json');
    cy.get('#viewUIResults .view-text').should(($textarea) => {
      expect($textarea.val()).to.contain('"name": "@es-joy/jsoe"');
    });
  });

  it('views UI (video)', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'file'
    );
    cy.get(sel + 'input[name="demo-keypath-not-expected-file"]').selectFile(
      'node_modules/webappfind-demos-samples/sample-test-files/small.webm'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'small.webm');
    cy.get('#viewUIResults').should('contain', 'video/webm');
    cy.get('#viewUIResults video.video').should(($video) => {
      expect(/** @type {HTMLVideoElement} */ ($video[0]).duration).to.be.gt(0);
    });

    cy.get('#viewUIResults video.video').should('have.prop', 'paused', true).
      and('have.prop', 'ended', false);

    cy.get('#viewUIResults .play').click();

    cy.get('#viewUIResults video.video').should('have.prop', 'paused', false).
      and('have.prop', 'ended', false);

    cy.get('#viewUIResults .pause').click();

    cy.get('#viewUIResults video.video').should('have.prop', 'paused', true).
      and('have.prop', 'ended', false);

    cy.get('#viewUIResults .play').click();

    cy.get('#viewUIResults video.video', {timeout: 10000}).
      and('have.prop', 'ended', true);

    cy.get('#viewUIResults .replay').click();

    cy.get('#viewUIResults video.video').should('have.prop', 'paused', false).
      and('have.prop', 'ended', false);

    cy.get('#viewUIResults video.video', {timeout: 10000}).
      and('have.prop', 'ended', true);
  });

  it('views UI (audio)', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'file'
    );
    cy.get(sel + 'input[name="demo-keypath-not-expected-file"]').selectFile(
      'node_modules/webappfind-demos-samples/sample-test-files/' +
        'Armstrong_Small_Step.ogg'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'Armstrong_Small_Step.ogg');
    cy.get('#viewUIResults').should('contain', 'audio/ogg');
    cy.get('#viewUIResults audio.audio').should(($audio) => {
      expect(/** @type {HTMLVideoElement} */ ($audio[0]).duration).to.be.gt(0);
    });

    cy.get('#viewUIResults audio.audio').should('have.prop', 'paused', true).
      and('have.prop', 'ended', false);

    cy.get('#viewUIResults .play').click();

    cy.get('#viewUIResults audio.audio').should('have.prop', 'paused', false).
      and('have.prop', 'ended', false);

    cy.get('#viewUIResults .pause').click();

    cy.get('#viewUIResults audio.audio').should('have.prop', 'paused', true).
      and('have.prop', 'ended', false);

    cy.get('#viewUIResults .play').click();

    // cy.get('#viewUIResults audio.audio', {timeout: 30000}).
    //   and('have.prop', 'ended', true);

    cy.get('#viewUIResults .replay').click();

    cy.get('#viewUIResults audio.audio').should('have.prop', 'paused', false).
      and('have.prop', 'ended', false);

    // cy.get('#viewUIResults audio.audio', {timeout: 30000}).
    //   and('have.prop', 'ended', true);
  });

  it('views UI (PDF)', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'file'
    );
    cy.get(sel + 'input[name="demo-keypath-not-expected-file"]').selectFile(
      'node_modules/webappfind-demos-samples/sample-test-files/' +
        'helloworld.pdf'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'helloworld.pdf');
    cy.get('#viewUIResults').should('contain', 'application/pdf');
    cy.get('#viewUIResults iframe.PDF').should('exist');
  });

  it('views UI (image)', function () {
    const sel = '#formatAndTypeChoices ';
    cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
      'file'
    );
    cy.get(sel + 'input[name="demo-keypath-not-expected-file"]').selectFile(
      'node_modules/webappfind-demos-samples/sample-test-files/' +
        'test.jpg'
    );

    cy.get('button#viewUI').click();
    cy.get('#viewUIResults').should('contain', 'test.jpg');
    cy.get('#viewUIResults').should('contain', 'image/jpeg');
    cy.get('#viewUIResults img.imageView').should('exist');
  });

  describe('Video and audio recording', function () {
    it('records audio', function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'file'
      );
      cy.get(sel + '.device').select('audio');

      cy.get(sel + '.visualizer').should('be.visible');

      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Needed for stream to load
      cy.wait(1000);
      cy.get(sel + '.recordMedia').click();

      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Need some time recorded
      cy.wait(1000);
      cy.get(sel + '.stopRecording').click();

      // Todo: should refactor audio to produce audio name and content type
      cy.get(sel + '.fileName').should(($input) => {
        expect($input.val()).to.equal('placeholder.webm');
      });

      cy.get(sel + '.contentType').should(($input) => {
        expect($input.val()).to.equal('video/webm');
      });

      cy.get(sel + 'video.recordedMedia').should(($video) => {
        expect(/** @type {HTMLVideoElement} */ (
          $video[0]
        ).duration).to.be.gt(0);
      });

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', true).
        and('have.prop', 'ended', false);

      cy.get(sel + '.recordedMedia .play').click();

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', false).
        and('have.prop', 'ended', false);

      cy.get(sel + '.recordedMedia .pause').click();

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', true).
        and('have.prop', 'ended', false);

      cy.get(sel + '.recordedMedia .replay').click();

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', false).
        and('have.prop', 'ended', false);

      cy.get(sel + 'video.recordedMedia', {timeout: 10000}).
        and('have.prop', 'ended', true);

      // Trigger stopping of old tracks
      cy.get(sel + '.device').select('video');
    });

    it('records video (only)', function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'file'
      );
      cy.get(sel + '.device').select('video');

      cy.get(sel + '.visualizer').should('not.be.visible');

      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Needed for stream to load
      cy.wait(1000);
      cy.get(sel + '.recordMedia').click();

      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Need some time recorded
      cy.wait(1000);
      cy.get(sel + '.stopRecording').click();

      cy.get(sel + '.fileName').should(($input) => {
        expect($input.val()).to.equal('placeholder.webm');
      });

      cy.get(sel + '.contentType').should(($input) => {
        expect($input.val()).to.equal('video/webm');
      });

      cy.get(sel + 'video.recordedMedia').should(($video) => {
        expect(/** @type {HTMLVideoElement} */ (
          $video[0]
        ).duration).to.be.gt(0);
      });

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', true).
        and('have.prop', 'ended', false);

      cy.get(sel + '.recordedMedia .play').click();

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', false).
        and('have.prop', 'ended', false);

      cy.get(sel + '.recordedMedia .pause').click();

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', true).
        and('have.prop', 'ended', false);

      cy.get(sel + '.recordedMedia .replay').click();

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', false).
        and('have.prop', 'ended', false);

      cy.get(sel + 'video.recordedMedia', {timeout: 10000}).
        and('have.prop', 'ended', true);

      // Trigger stopping of old tracks
      cy.get(sel + '.device').select('');
    });

    it('records audio and video', function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'file'
      );
      cy.get(sel + '.device').select('audio-and-video');

      cy.get(sel + '.visualizer').should('be.visible');

      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Needed for stream to load
      cy.wait(1000);
      cy.get(sel + '.recordMedia').click();

      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Need some time recorded
      cy.wait(1000);
      cy.get(sel + '.stopRecording').click();

      cy.get(sel + '.fileName').should(($input) => {
        expect($input.val()).to.equal('placeholder.webm');
      });

      cy.get(sel + '.contentType').should(($input) => {
        expect($input.val()).to.equal('video/webm');
      });

      cy.get(sel + 'video.recordedMedia').should(($video) => {
        expect(/** @type {HTMLVideoElement} */ (
          $video[0]
        ).duration).to.be.gt(0);
      });

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', true).
        and('have.prop', 'ended', false);

      cy.get(sel + '.recordedMedia .play').click();

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', false).
        and('have.prop', 'ended', false);

      cy.get(sel + '.recordedMedia .pause').click();

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', true).
        and('have.prop', 'ended', false);

      cy.get(sel + '.recordedMedia .replay').click();

      cy.get(sel + 'video.recordedMedia').should('have.prop', 'paused', false).
        and('have.prop', 'ended', false);

      cy.get(sel + 'video.recordedMedia', {timeout: 10000}).
        and('have.prop', 'ended', true);
    });
  });

  describe('Snapshots', function () {
    it('records snapshot', function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'file'
      );
      cy.get(sel + '.device').select('video');

      cy.get(sel + '.takeSnapshot').click();

      cy.get(sel + '.fileName').should(($input) => {
        expect($input.val()).to.equal('placeholder.png');
      });

      cy.get(sel + '.contentType').should(($input) => {
        expect($input.val()).to.equal('image/png');
      });
    });
  });

  describe('Screen sharing', function () {
    it('should share screen', function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'file'
      );
      cy.get(sel + '.device').select('screenShare');
    });
    it('should share screen', function () {
      const sel = '#formatAndTypeChoices ';
      cy.get(sel + 'select.typeChoices-demo-keypath-not-expected').select(
        'file'
      );
      cy.get(sel + '.device').select('screenShareAndVideo');
    });
  });

  describe('getInput()', function () {
    it('Shows the file root form control', function () {
      const sel = '#formatAndTypeChoices ';

      cy.get(
        sel + 'select.typeChoices-demo-keypath-not-expected'
      ).select('file');

      cy.get('#showRootFormControl').click();

      cy.get(
        '#formatAndTypeChoices > .typesHolder > .typeContainer > ' +
        'div[data-type="file"] button.viewBinary'
      ).should(($input) => {
        expect($input[0].style.backgroundColor).to.equal('red');
      });

      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Needed
      cy.wait(3000);

      cy.get(
        '#formatAndTypeChoices > .typesHolder > .typeContainer > ' +
        'div[data-type="file"] button.viewBinary'
      ).should(($input) => {
        expect($input[0].style.backgroundColor).to.not.equal('red');
      });
    });
  });

  it('gets value', function () {
    cy.clearTypeAndBlur(
      '#getValueForString',
      'File({{}"stringContents":"abc","name":"someName",' +
        '"type":"text/plain","lastModified":1231230})'
    );
    cy.get('@consoleLog').should(
      'be.calledWith', new File(['abc'], 'someName', {
        type: 'text/plain',
        lastModified: 1231230
      })
    );
  });

  // For the "Type choices with initial value set" control
  it('gets a value set onload', function () {
    cy.get(
      'form > .typeContainer > ' +
      'div[data-type="file"] .fileName'
    ).should(($input) => {
      expect($input.val()).to.equal('anotherName');
    });
  });

  it('gets a value set onload (within array setting value)', function () {
    cy.get(
      'fieldset[data-type="file"] .fileName'
    ).should(($input) => {
      expect($input.val()).to.equal('someName');
    });
  });
});

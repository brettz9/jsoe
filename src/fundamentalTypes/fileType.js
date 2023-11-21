import {jml} from '../vendor-imports.js';
import {$e} from '../utils/templateUtils.js';
import dialogs from '../utils/dialogs.js';

/**
 * @typedef {File|{
 *   name: string, size: string, type: string,
 *   lastModified: string
 * }} FileInfo
 */

/**
 * @typedef {(file: FileInfo) => void} SetValue
 */

/** @type {AudioContext} */
let audioCtx;
/**
 * @param {MediaStream} stream
 * @param {HTMLCanvasElement} canvas
 * @see Adapted from {@link https://mdn.github.io/dom-examples/media/web-dictaphone/}
 * @returns {void}
 */
function visualize (stream, canvas) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  const canvasCtx = /** @type {CanvasRenderingContext2D} */ (
    canvas.getContext('2d')
  );

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  // analyser.connect(audioCtx.destination);

  draw();

  /**
   * @returns {void}
   */
  function draw () {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    const sliceWidth = WIDTH * 1 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128;
      const y = v * HEIGHT / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
}

/**
 * @param {MediaStreamConstraints} constraints
 * @returns {Promise<MediaStream|null>}
 */
async function getUserMedia (constraints) {
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  /* c8 ignore next 4 */
  } catch (err) {
    console.error('err', err);
    return null;
  }
  return stream;
}

/**
 * @param {DisplayMediaStreamOptions|undefined} displayMediaOptions
 * @returns {Promise<MediaStream|null>}
 */
async function startScreenCapture (displayMediaOptions) {
  let captureStream = null;

  try {
    captureStream =
      await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
  /* c8 ignore next 3 */
  } catch (err) {
    console.error(`Error: ${err}`);
  }
  return captureStream;
}

/**
 * @param {number} timestamp
 * @returns {string}
 */
function getDateString (timestamp) {
  const d = new Date(timestamp);
  const dateTimeLocalValue = (
    new Date(
      d.getTime() - (d.getTimezoneOffset() * 60000)
    ).toISOString()
  ).slice(0, -1);
  return dateTimeLocalValue;
}

/**
 * @param {File} value
 * @returns {import('jamilih').JamilihArray}
 */
function binaryButton (value) {
  // @ts-expect-error It's ok
  return ['button', /** @type {import('jamilih').JamilihAttributes} */ ({
    class: 'viewBinary',
    $custom: {
      $value: value
    },
    $on: {
      /**
       * @this {HTMLButtonElement & {$value: File}}
       * @param {Event} e
       */
      click (e) {
        e.preventDefault();
        if (
          !this.$value ||
          Object.prototype.toString.call(this.$value).slice(8, -1) !== 'File'
        ) {
          dialogs.alert(
            'There is no file chosen with binary data'
          );
          return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', async function () {
          await dialogs.alert({
            message: ['div', [
              'Binary source',
              ['br'],
              ['textarea', {class: 'view-binary'}, [
                /* c8 ignore next */
                /** @type {string|null} */ (reader.result) ?? ''
              ]]
            ]]
          });
        });
        // Seems not feasible to accurately simulate
        /* c8 ignore next 10 */
        reader.addEventListener(
          'error',
          /* c8 ignore next 6 */
          async function () {
            console.error(reader.error);
            await dialogs.alert(/** @type {string} */ (
              /** @type {DOMException} */ (reader.error).message
            ));
          }
        );
        reader.readAsBinaryString(this.$value);
      }
    }
  }), ['View binary data']];
}

/**
 * @type {import('../types.js').TypeObject}
 */
const fileType = {
  option: ['File'],
  stringRegex: /^File\((.*)\)$/u,
  toValue (s) {
    const obj = JSON.parse(s);
    return {value: new File([obj.stringContents], obj.name, {
      type: obj.type,
      lastModified: obj.lastModified
    })};
  },
  getInput ({root}) {
    return /** @type {HTMLButtonElement} */ ($e(root, 'button.viewBinary'));
  },
  setValue ({root, value}) {
    /** @type {HTMLFieldSetElement & {$setValue: SetValue}} */
    ($e(root, 'fieldset.fileMetaData')).$setValue(value);
  },
  getValue ({root}) {
    // Get value attached to DOM element rather than input,
    //    so can be from preexisting file too
    return /** @type {HTMLButtonElement & {$value: File}} */ (
      this.getInput({root})
    ).$value;
  },
  viewUI ({value}) {
    return ['div', {dataset: {type: 'file'}}, [
      ['b', {class: 'emphasis'}, [
        'File'
      ]],
      ['br'],
      ['br'],
      ['b', [
        'Name '
      ]],
      value.name,
      ['br'],
      ['b', [
        'Size (in bytes) '
      ]],
      String(value.size),
      ['br'],
      ['b', [
        'Content type '
      ]],
      value.type,
      ['br'],
      ['b', [
        'Last modified date '
      ]],
      getDateString(value.lastModified),
      ['br'],
      value.type.startsWith('text/') || value.type === 'application/json'
        ? (() => {
          const div = /** @type {HTMLDivElement} */ (jml('div'));
          const reader = new FileReader();
          reader.addEventListener('load', function () {
            div.append(jml('div', [
              'Text source',
              ['br'],
              ['textarea', {class: 'view-text'}, [
                /* c8 ignore next */
                /** @type {string|null} */ (reader.result) ?? ''
              ]]
            ]));
          });
          // Seems not feasible to accurately simulate
          /* c8 ignore next 10 */
          reader.addEventListener(
            'error',
            /* c8 ignore next 6 */
            function () {
              console.error(reader.error);
              div.append(
                /** @type {DOMException} */ (reader.error).message
              );
            }
          );
          reader.readAsBinaryString(value);
          return div;
        })()
        : binaryButton(value),
      value.type.startsWith('video/')
        ? (() => {
          const objURL = URL.createObjectURL(value);
          const video = /** @type {HTMLVideoElement} */ (jml('video', {
            src: objURL,
            class: 'video',
            $on: {
              loadeddata () {
                URL.revokeObjectURL(objURL);
              }
            }
          }));

          return ['div', [
            video,
            ['button', {
              class: 'play',
              $on: {
                click (e) {
                  e.preventDefault();
                  video.play();
                }
              }
            }, [
              'Play'
            ]],
            ['button', {
              class: 'pause',
              $on: {
                click (e) {
                  e.preventDefault();
                  video.pause();
                }
              }
            }, [
              'Pause'
            ]],
            ['button', {
              class: 'replay',
              $on: {
                click (e) {
                  e.preventDefault();
                  video.pause();
                  video.currentTime = 0;
                  video.play();
                }
              }
            }, [
              'Replay'
            ]]
          ]];
        })()
        : '',
      value.type.startsWith('audio/')
        ? (() => {
          const objURL = URL.createObjectURL(value);
          const audio = /** @type {HTMLAudioElement} */ (jml('audio', {
            src: objURL,
            class: 'audio',
            $on: {
              loadeddata () {
                URL.revokeObjectURL(objURL);
              }
            }
          }));
          return ['div', [
            audio,
            ['button', {
              class: 'play',
              $on: {
                click (e) {
                  e.preventDefault();
                  audio.play();
                }
              }
            }, [
              'Play'
            ]],
            ['button', {
              class: 'pause',
              $on: {
                click (e) {
                  e.preventDefault();
                  audio.pause();
                }
              }
            }, [
              'Pause'
            ]],
            ['button', {
              class: 'replay',
              $on: {
                click (e) {
                  e.preventDefault();
                  audio.pause();
                  audio.currentTime = 0;
                  audio.play();
                }
              }
            }, [
              'Replay'
            ]]
          ]];
        })()
        : '',
      value.type === 'application/pdf'
        ? (() => {
          const objURL = URL.createObjectURL(value);
          const iframe = jml('iframe', {
            class: 'PDF',
            src: objURL,
            $on: {
              load () {
                URL.revokeObjectURL(objURL);
              }
            }
          });
          return iframe;
        })()
        : '',
      value.type.startsWith('image/')
        // @ts-expect-error It's ok
        ? ['img', /** @type {import('jamilih').JamilihAttributes} */ ({
          class: 'imageView',
          src: URL.createObjectURL(value),
          $on: {
            /** @this {HTMLImageElement} */
            load () {
              URL.revokeObjectURL(this.src);
            }
          }
        })]
        : ''
    ]];
  },
  editUI ({typeNamespace, value = {}}) {
    // Todo: Could add way to preview file in edit mode (whether
    //         recorded or uploaded)
    return ['div', {dataset: {type: 'file'}}, [
      ['fieldset', {
        class: 'fileMetaData',
        $custom: {
          /**
           * @this {HTMLFieldSetElement}
           * @param {FileInfo} file
           */
          $setValue (file) {
            // eslint-disable-next-line consistent-this -- Clarity
            const metadataFieldset = this;
            /** @type {HTMLInputElement} */ ($e(
              metadataFieldset,
              '.fileName'
            )).value = file.name;

            /** @type {HTMLInputElement} */ ($e(
              metadataFieldset,
              '.size'
            )).value = String(file.size);

            /** @type {HTMLInputElement} */ ($e(
              metadataFieldset,
              '.contentType'
            )).value = file.type;

            /** @type {HTMLInputElement} */ ($e(
              metadataFieldset,
              '.lastModified'
            )).value = typeof file.lastModified === 'number'
              ? getDateString(file.lastModified)
              : '';

            /** @type {HTMLButtonElement & {$value: File|undefined}} */ ($e(
              metadataFieldset,
              '.viewBinary'
            )).$value = typeof file.lastModified === 'number'
              ? /** @type {File} */ (file)
              : undefined;
          }
        }
      }, [
        ['legend', ['Current file data']],
        ['label', [
          'Name ',
          ['input', {
            size: 50,
            class: 'fileName', value: value.name ?? '',
            $on: {
              change () {
                const viewBinary =
                  /**
                   * @type {HTMLButtonElement & {$value: File}}
                   */ (
                    $e(
                      /** @type {HTMLElement} */
                      (this.parentElement?.parentElement),
                      '.viewBinary'
                    )
                  );
                const oldFile = /** @type {File|undefined} */ (
                  viewBinary.$value
                );
                if (
                  !oldFile ||
                  Object.prototype.toString.call(
                    oldFile
                  ).slice(8, -1) !== 'File'
                ) {
                  return;
                }
                const newName = /** @type {HTMLInputElement} */ (this).value;
                const file = new File(
                  [oldFile],
                  newName,
                  {
                    type: oldFile.type,
                    lastModified: oldFile.lastModified
                  }
                );
                viewBinary.$value = file;
              }
            }
          }]
        ]],
        ['br'],
        ['label', [
          'Size (in bytes) ',
          ['input', {
            type: 'number', disabled: true, class: 'size',
            value: String(value.size)
          }]
        ]],
        ['br'],
        ['label', [
          'Content type ',
          ['input', {
            class: 'contentType', value: value.type ?? '',
            $on: {
              change () {
                const viewBinary =
                  /**
                   * @type {HTMLButtonElement & {$value: File}}
                   */ (
                    $e(
                      /** @type {HTMLElement} */
                      (this.parentElement?.parentElement),
                      '.viewBinary'
                    )
                  );
                const oldFile = /** @type {File|undefined} */ (
                  viewBinary.$value
                );
                if (
                  !oldFile ||
                  Object.prototype.toString.call(
                    oldFile
                  ).slice(8, -1) !== 'File'
                ) {
                  return;
                }
                const newContentType =
                  /** @type {HTMLInputElement} */ (this).value;
                const file = new File(
                  [oldFile],
                  oldFile.name,
                  {
                    type: newContentType,
                    lastModified: oldFile.lastModified
                  }
                );
                viewBinary.$value = file;
              }
            }
          }]
        ]],
        ['br'],
        ['label', [
          'Last modified date ',
          ['input', {
            type: 'datetime-local', disabled: true, class: 'lastModified',
            value: value.lastModified
              ? getDateString(value.lastModified)
              : undefined
          }]
        ]],
        ['br'],
        binaryButton(value),
        ['button', {
          class: 'clearData',
          $on: {
            click (e) {
              e.preventDefault();
              /**
               * @type {HTMLFieldSetElement & {$setValue: SetValue}}
               */ (this.parentElement).$setValue({
                name: '',
                size: '',
                type: '',
                lastModified: ''
              });
            }
          }
        }, [
          'Clear data'
        ]]
      ]],
      ['fieldset', [
        ['legend', ['Supply file through upload']],
        ['label', [
          'File ',
          // @ts-expect-error It's ok
          ['input', /** @type {import('jamilih').JamilihAttributes} */ ({
            $on: {
              /**
               * @this {HTMLInputElement}
               */
              change () {
                /* c8 ignore next 3 -- TS */
                if (!this.files) {
                  return;
                }
                const file = this.files[0];

                const metadataFieldset =
                  /**
                   * @type {HTMLFieldSetElement & {
                   *   $setValue: SetValue
                   * }}
                   */ (/** @type {HTMLElement} */ (
                    this.parentElement?.parentElement
                  )?.previousElementSibling);
                metadataFieldset.$setValue(file);
              }
            },
            name: `${typeNamespace}-file`, type: 'file'
          })]
        ]]
      ]],
      ['fieldset', [
        ['legend', [
          'Supply file through recording'
        ]],
        (() => {
          const select = /** @type {HTMLSelectElement} */ (
            jml('select', {
              class: 'device',
              $on: {
                async change () {
                  const videoContainer = /** @type {HTMLDivElement} */ (
                    this.nextElementSibling?.nextElementSibling
                  );

                  const photo =
                    /**
                     * @type {HTMLCanvasElement}
                     */
                    ($e(videoContainer, 'img.photo'));
                  photo.hidden = true;

                  const oldVideo =
                    /**
                     * @type {HTMLVideoElement & {
                     *   $stream: MediaStream
                     * }}
                     */
                    ($e(
                      videoContainer,
                      'video.previewMedia'
                    ));

                  // Drop preexisting listeners
                  const previewMedia =
                    /**
                     * @type {HTMLVideoElement & {
                     *   $stream: MediaStream,
                     *   $screenShare: boolean
                     * }}
                     */ (
                      jml('video', {
                        class: 'previewMedia'
                      })
                    );

                  if (oldVideo.$stream) {
                    const tracks = /** @type {MediaStream} */ (
                      oldVideo.$stream
                    ).getTracks();
                    tracks.forEach((track) => {
                      track.stop();
                    });
                    oldVideo.srcObject = null;
                  }

                  oldVideo.replaceWith(previewMedia);

                  const takeSnapshot = /** @type {HTMLButtonElement} */ (
                    $e(/** @type {HTMLDivElement} */ (
                      select.nextElementSibling
                    ), '.takeSnapshot')
                  );

                  const recordMedia = /** @type {HTMLButtonElement} */ (
                    $e(/** @type {HTMLDivElement} */ (
                      select.nextElementSibling
                    ), '.recordMedia')
                  );

                  /** @type {HTMLDivElement} */ ($e(
                    /** @type {HTMLDivElement} */
                    (select.nextElementSibling?.
                      nextElementSibling),
                    'div.recordedMedia'
                  )).hidden = true;

                  const visualizer = /** @type {HTMLCanvasElement} */ (
                    $e(videoContainer, 'canvas.visualizer')
                  );

                  /**
                   * @type {{
                   *   video?: true,
                   *   audio?: true
                   * }|undefined}
                   */
                  let constraints;
                  let screenShareConstraints;

                  previewMedia.$screenShare = false;
                  switch (select.value) {
                  case 'audio-and-video':
                    constraints = {video: true, audio: true};
                    previewMedia.hidden = false;
                    takeSnapshot.hidden = false;
                    recordMedia.textContent = 'Record video/audio';
                    break;
                  case 'video':
                    constraints = {video: true};
                    previewMedia.hidden = false;
                    takeSnapshot.hidden = false;
                    recordMedia.textContent = 'Record video';
                    break;
                  case 'audio':
                    constraints = {audio: true};
                    previewMedia.hidden = true;
                    takeSnapshot.hidden = true;
                    recordMedia.textContent = 'Record audio';
                    break;
                  case 'screenShare':
                    screenShareConstraints = {video: true};
                    // Fallthrough
                  case 'screenShareAndVideo':
                    if (!screenShareConstraints) {
                      screenShareConstraints = {video: true, audio: true};
                    }
                    previewMedia.$screenShare = true;
                    previewMedia.hidden = true;
                    takeSnapshot.hidden = true;
                    visualizer.hidden = true;
                    break;
                  default:
                    return;
                  }

                  if (constraints) {
                    const mediaStream = await getUserMedia(constraints);
                    /* c8 ignore next 4 */
                    if (!mediaStream) {
                      await dialogs.alert('Error getting user media');
                      return;
                    }

                    videoContainer.hidden = false;
                    previewMedia.srcObject = mediaStream;

                    // Save as stream for later reuse as stream
                    previewMedia.$stream = mediaStream;

                    if (constraints.video) {
                      const canvas =
                        /**
                         * @type {HTMLCanvasElement}
                         */
                        ($e(
                          videoContainer,
                          'canvas.recordedImage'
                        ));
                      // https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos
                      previewMedia.addEventListener('canplay', () => {
                        canvas.setAttribute('width', String(
                          previewMedia.videoWidth
                        ));
                        canvas.setAttribute(
                          'height', String(previewMedia.videoHeight)
                        );
                      });
                    }

                    previewMedia.addEventListener('loadedmetadata', () => {
                      previewMedia.play();
                      if (constraints?.audio) {
                        visualizer.hidden = false;
                        visualize(
                          mediaStream,
                          visualizer
                        );
                      } else {
                        visualizer.hidden = true;
                      }
                    });
                  } else if (screenShareConstraints) {
                    const mediaStream = await startScreenCapture(
                      screenShareConstraints
                    );
                    /* c8 ignore next 4 */
                    if (!mediaStream) {
                      await dialogs.alert('Error getting user media');
                      return;
                    }

                    videoContainer.hidden = false;
                    previewMedia.srcObject = mediaStream;

                    // Save as stream for later reuse as stream
                    previewMedia.$stream = mediaStream;
                  }
                }
              }
            }, [
              ['option', {value: ''}, ['Please choose a device']]
            ])
          );

          (async () => {
            const devices = await navigator.mediaDevices.enumerateDevices();
            let hasAudioInput = false;
            let hasVideoInput = false;
            devices.forEach((device) => {
              switch (device.kind) {
              case 'audioinput':
                hasAudioInput = true;
                break;
              case 'videoinput':
                hasVideoInput = true;
                break;
              default:
                break;
              }
            });

            if (hasAudioInput) {
              jml('option', {value: 'audio'}, ['Microphone only'], select);
            }
            if (hasVideoInput) {
              jml('option', {value: 'video'}, ['Video camera only'], select);
            }
            if (hasAudioInput && hasVideoInput) {
              jml(
                'option',
                {value: 'audio-and-video'},
                ['Video camera and microphone'],
                select
              );
            }

            // Can't be feature detected for privacy reasons
            jml('option', {
              value: 'screenShare'
            }, ['Screen share'], select);
            jml('option', {
              value: 'screenShareAndVideo'
            }, ['Screen share and microphone'], select);
          })();

          return select;
        })(),
        ' ',
        ['div', [
          // @ts-expect-error It's ok
          ['button', /** @type {import('jamilih').JamilihAttributes} */ ({
            class: 'recordMedia',
            $on: {
              /**
               * @param {Event} e
               * @this {HTMLButtonElement & {
               *   $mediaRecorder: MediaRecorder
               * }}
               */
              click (e) {
                e.preventDefault();
                const previewMedia =
                  /**
                   * @type {HTMLVideoElement & {$stream: MediaStream}}
                   */ ($e(
                    /** @type {HTMLDivElement} */
                    (this.parentElement?.nextElementSibling),
                    'video.previewMedia'
                  ));

                /* c8 ignore next 4 */
                if (!previewMedia.srcObject) {
                  dialogs.alert('No stream found to record');
                  return;
                }

                // Not interested in the photo now, so hide it
                const videoContainer = /** @type {HTMLDivElement} */ (
                  this.parentElement?.nextElementSibling
                );
                const photo =
                  /**
                   * @type {HTMLCanvasElement}
                   */
                  ($e(videoContainer, 'img.photo'));
                photo.hidden = true;

                // Todo: Could check codecs for allowable values
                //     as second argument
                //  see https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static
                const mimeType = 'video/webm';
                const mediaRecorder = new MediaRecorder(previewMedia.$stream, {
                  mimeType
                });

                /** @type {Blob[]} */
                let chunks = [];
                mediaRecorder.addEventListener('dataavailable', (e) => {
                  chunks.push(e.data);
                });

                try {
                  mediaRecorder.start();
                /* c8 ignore next 4 */
                } catch (err) {
                  dialogs.alert('Error starting media recorder');
                  return;
                }
                mediaRecorder.addEventListener('stop', () => {
                  const blob = new Blob(chunks, {
                    type: mimeType
                  });

                  const url = URL.createObjectURL(blob);

                  const recordedMedia = /** @type {HTMLVideoElement} */ ($e(
                    /** @type {HTMLDivElement} */
                    (this.parentElement?.nextElementSibling),
                    'video.recordedMedia'
                  // )).srcObject = blob;
                  ));
                  /** @type {HTMLDivElement} */ (
                    recordedMedia.parentElement
                  ).hidden = false;

                  recordedMedia.src = url;

                  recordedMedia.addEventListener('loadeddata', () => {
                    URL.revokeObjectURL(url);
                  });

                  const file = new File(
                    [blob],
                    'placeholder.webm',
                    {type: mimeType}
                  );
                  console.log('file', file);

                  const root = /** @type {HTMLDivElement} */
                    (this.closest('[data-type="file"]'));
                  /**
                   * @type {HTMLFieldSetElement & {
                   *   $setValue: SetValue
                   * }}
                   */ ($e(
                    root, 'fieldset.fileMetaData'
                  )).$setValue(file);

                  chunks = [];
                });

                this.$mediaRecorder = mediaRecorder;

                // Todo: Could make option for front/back
                //         camera ("user"/"environment") and bringIntoFocus
              }
            }
          }), [
            'Record media'
          ]],
          ['button', {
            class: 'stopRecording',
            $on: {
              click (e) {
                e.preventDefault();
                /**
                 * @type {HTMLButtonElement & {$mediaRecorder: MediaRecorder}}
                 */ (
                  this.previousElementSibling
                ).$mediaRecorder.stop();

                // const previewMedia =
                //   /**
                //    * @type {HTMLVideoElement & {
                //    *   $stream: MediaStream,
                //    *   $screenShare: boolean
                //    * }}
                //    */ (
                //     $e(
                //       /** @type {HTMLDivElement} */
                //       (this.parentElement?.nextElementSibling),
                //       '.previewMedia'
                //     )
                //   );

                // Doesn't hurt to keep the normal video going as user
                //   may wish to re-record, but for screen-sharing, we
                //   may want to reenable this, at the cost that the
                //   screen sharing cannot be re-done
                // if (previewMedia.$screenShare) {
                //   const tracks = /** @type {MediaStream} */ (
                //     previewMedia.$stream
                //   ).getTracks();
                //   tracks.forEach((track) => {
                //     track.stop();
                //   });
                // }
                // previewMedia.srcObject = null;
              }
            }
          }, [
            'Stop recording'
          ]],
          ['button', {
            class: 'takeSnapshot',
            hidden: true
          }, {
            $on: {
              click (e) {
                e.preventDefault();

                const videoContainer = /** @type {HTMLDivElement} */
                  (this.parentElement?.nextElementSibling);

                // Not interested in this anymore
                /** @type {HTMLVideoElement} */
                ($e(videoContainer, '.recordedMedia')).hidden = true;

                const canvas =
                  /**
                   * @type {HTMLCanvasElement}
                   */
                  ($e(videoContainer, 'canvas.recordedImage'));

                const context = /** @type {CanvasRenderingContext2D} */ (
                  canvas.getContext('2d')
                );

                const previewMedia =
                  /**
                   * @type {HTMLVideoElement}
                   */
                  ($e(videoContainer, 'video.previewMedia'));
                context.drawImage(
                  previewMedia, 0, 0, canvas.width, canvas.height
                );
                const photo =
                  /**
                   * @type {HTMLCanvasElement}
                   */
                  ($e(videoContainer, 'img.photo'));

                canvas.toBlob((blob) => {
                  /* c8 ignore next 4 */
                  if (!blob) {
                    dialogs.alert('Error converting canvas to Blob');
                    return;
                  }
                  const newPhoto = /** @type {HTMLImageElement} */ (jml('img', {
                    class: 'photo'
                  }));
                  const url = URL.createObjectURL(blob);

                  newPhoto.addEventListener('load', () => {
                    // no longer need to read the blob so it's revoked
                    URL.revokeObjectURL(url);
                  });

                  const file = new File(
                    [blob],
                    'placeholder.png',
                    {type: blob.type}
                  );
                  console.log('file', file);

                  const root = /** @type {HTMLDivElement} */
                    (this.closest('[data-type="file"]'));
                  /**
                   * @type {HTMLFieldSetElement & {
                   *   $setValue: SetValue
                   * }}
                   */ ($e(
                    root, 'fieldset.fileMetaData'
                  )).$setValue(file);

                  newPhoto.src = url;
                  photo.replaceWith(newPhoto);
                });
              }
            }
          }, [
            'Take and use snapshot as file'
          ]]
        ]],
        ['div', {class: 'videoContainer', hidden: true}, [
          ['canvas', {class: 'visualizer', hidden: true}],
          ['br'],
          ['video', {class: 'previewMedia'}],
          ['div', [
            ['canvas', {hidden: true, class: 'recordedImage'}],
            ['img', {class: 'photo'}]
          ]],
          [
            'div',
            {class: 'recordedMedia'},
            /** @type {import('jamilih').JamilihChildren} */ ([
              ...(() => {
                const recordedMedia = /** @type {HTMLVideoElement} */ (jml(
                  'video', {class: 'recordedMedia'}
                ));
                return [
                  recordedMedia,
                  ['br'],
                  jml('button', {
                    class: 'play',
                    $on: {
                      click (e) {
                        e.preventDefault();
                        recordedMedia.play();
                      }
                    }
                  }, [
                    'Play'
                  ]),
                  jml('button', {
                    class: 'pause',
                    $on: {
                      click (e) {
                        e.preventDefault();
                        recordedMedia.pause();
                      }
                    }
                  }, [
                    'Pause'
                  ]),
                  jml('button', {
                    class: 'replay',
                    $on: {
                      click (e) {
                        e.preventDefault();
                        recordedMedia.pause();
                        recordedMedia.currentTime = 0;
                        recordedMedia.play();
                      }
                    }
                  }, [
                    'Replay'
                  ])
                ];
              })()
            ])
          ]
        ]]
      ]]
    ]];
  }
};

export default fileType;

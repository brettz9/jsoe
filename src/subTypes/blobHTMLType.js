/* globals sceditor */
import {jml} from '../../vendor/jamilih/dist/jml-es.js';
import {$e} from '../utils/templateUtils.js';

import dialogs from '../utils/dialogs.js';
import {isNullish} from '../utils/types.js';

const blobHTMLType = {
  // Todo (low): Support other content-types
  option: ['Blob (text/html)'],
  stringRegex: /^data:text\/html(?:;base64)?,.*$/u,
  valueMatch: (v) => v.type === 'text/html',
  superType: 'blob',
  toValue (s) {
    // Todo (low): `Blob` untested; use https://stackoverflow.com/a/30407840/271577 ?
    /**
     *
     * @param {string} dataURI
     * @returns {Blob}
     */
    function dataURIToBlob (dataURI) {
      // Adapted from https://stackoverflow.com/a/12300351/271577
      const [mimeInfo, bytes] = dataURI.split(',');
      const [mimeString, encoding] = mimeInfo.split(':')[1].split(';');
      let ab;
      if (encoding === 'base64') {
        const byteString = atob(bytes);
        ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          // eslint-disable-next-line unicorn/prefer-code-point -- Only a byte
          ia[i] = byteString.charCodeAt(i);
        }
      } else {
        ab = bytes;
      }
      return new Blob([ab], {type: mimeString});
    }
    return {
      value: dataURIToBlob(s)
    };
  },
  /* istanbul ignore next -- No dupe keys, array refs, or validation */
  getInput ({root}) {
    return $e(root, 'textarea');
  },
  getValue (/* {root} */) {
    return this.toValue(
      'data:text/html,' + this.sceditorInstance.val()
      // this.getInput({root}).value
    ).value;
  },
  loadBlob (value) {
    const reader = new FileReader();
    // eslint-disable-next-line promise/avoid-new
    return new Promise((resolve, reject) => {
      reader.addEventListener('loadend', () => {
        resolve(reader);
      });
      reader.addEventListener(
        'error',
        /* istanbul ignore next -- How to simulate? */
        (_e) => {
          reject(reader.error);
        }
      );
      reader.readAsText(value);
    });
  },
  async setValue ({/* root, */ value}) {
    const {result} = await this.loadBlob(value);
    this.sceditorInstance.val(result);
    // this.getInput({root}).value = result;
  },
  viewUI ({value}) {
    let val;
    const div = jml('div', {dataset: {type: 'blobHTML'}}, [
      'HTML: ',
      ['button', {$on: {
        click () {
          dialogs.alert({message: ['div', [
            'Source: ',
            ['textarea', {class: 'view-source'}, [val]]
          ]]});
        }
      }}, ['View source']]
    ]);
    // eslint-disable-next-line promise/prefer-await-to-then
    this.loadBlob(value).then(({
      result
    }) => {
      val = result;
      jml('iframe', {
        sandbox: '',
        srcdoc: val
      }, div);
      return undefined;
    // eslint-disable-next-line promise/prefer-await-to-then
    }).catch(
      /* istanbul ignore next -- How to simulate? */
      () => {
      // Todo: Show an error message?
      }
    );
    return [div];
    // return ['i', [`data:text/html,${value}`]];
  },
  editUI ({typeNamespace, value}) {
    const textarea = jml('textarea', {name: `${typeNamespace}-blobHTML`});
    const root = jml('div', {dataset: {type: 'blobHTML'}}, [
      textarea
    ]);
    setTimeout(() => {
      // Push onto these: https://www.sceditor.com/documentation/formats/xhtml/
      // sceditor.formats.xhtml.converters array
      // sceditor.formats.xhtml.allowedAttribs object
      // sceditor.formats.xhtml.disallowedAttribs object
      // sceditor.formats.xhtml.allowedTags array
      // sceditor.formats.xhtml.disallowedTags array
      // console.log(
      //  'sceditor.formats.xhtml.converters',
      //  sceditor.formats.xhtml.converters.map((c) => Object.keys(c.tags))
      // );
      // console.log(
      //   'sceditor.formats.xhtml.converters',
      //   sceditor.formats.xhtml.converters.map((c) => c.conv.toString())
      // );
      sceditor.create(textarea, {
        // Todo (low): "dragdrop" plugin is for file handling (could
        //   treat as Blobs but would need to reference them)
        // "autoyoutube" plugin may be ok
        // toolbarExclude (default of `null` doesn't exclude any)
        // Must also add languages files (after editor files but
        //   before editor creation)
        // locale: 'en',
        // emoticons: {}, icons, //
        // width, height, resizeMinWidth, resizeMinHeight, autoExpand: true,
        // autofocus, autofocusEnd
        // id, spellcheck, toolbarContainer, dropDownCss, fonts, colors
        // disableBlockRemove, parserOptions
        width: '1000px',
        height: '225px',
        // auto-updates original textbox when the editor loses focus
        autoUpdate: true,
        resizeMaxHeight: -1,
        resizeMaxWidth: -1,
        plugins: 'xhtml,plaintext,undo',
        emoticonsRoot: 'node_modules/sceditor/',
        style: 'node_modules/sceditor/minified/themes/content/default.min.css'
      });
      this.sceditorInstance = sceditor.instance(textarea);
      if (!isNullish(value)) {
        this.setValue({root, value});
      }
    });
    return [root];
  }
};

export default blobHTMLType;

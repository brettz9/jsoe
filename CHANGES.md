# CHANGES TO `@es-joy/jsoe`

## 0.10.0

- feat: add `filelist` type

## 0.9.0

- feat: add `blob` type

## 0.8.1

- feat: fix bug with `file` in array/object context not triggering file
    picker

## 0.8.0

- feat: make `File` fully editable (also by modified date or
    string contents or if by scratch)

## 0.7.1

- feat: fix bug with `file` in array/object context not triggering file
    picker

## 0.7.0

- feat: add `file` type including video, audio, photo, and
   screen sharing recording

## 0.6.1

- refactor: avoid problems for instrumenter

## 0.6.0

- feat: add `set`, `map`, `error`, and special error types
- fix: ensure `Types.getTypeForRoot` always returns a string
- fix: ensure Blob textarea is independent per instance

## 0.5.1

- fix: TS types

## 0.5.0

- chore: update `jamilih`, `typeson-registry`, devDeps.;
  use nodeNext moduleResolution

## 0.4.6

- fix: TS types

## 0.4.5

- fix: TS types (Make `stateObj` argument optional)

## 0.4.4

- fix: TS types (make `customValidateAllReferences` optional)

## 0.4.3

- fix: TS types (`topRoot` optional in `buildTypeChoices`)

## 0.4.2

- fix: TS types

## 0.4.1

- fix: add `main`

## 0.4.0

- feat: TypeScript types

## 0.3.0

- feat: negative zero support
- chore: bump jamilih, typeson-registry, devDeps.

## 0.2.0

- refactor(BREAKING): `typeChoices`->`formatAndTypeChoices`;
    add different `typeChoices`, adding methods to both
- feat: add `getControlsForFormatAndValue` utility
- fix: ensure `setValue` removes existing content
- feat: add stylesheet

## 0.1.0

- refactor: have `getFormatAndSchemaChoices` return fragment of options
- refactor: avoid placement dependency for return results of `typeChoices`
- refactor: return array of return objects for easier direct embedding
   in Jamilih
- docs: better API docs
- docs: add demo
- chore: switch port for testing

## 0.0.2

- fix: `node_modules` paths

## 0.0.1

- initial commit

type sceditorOptions = {
  width: string,
  height: string,
  autoUpdate: boolean,
  resizeMaxHeight: number,
  resizeMaxWidth: number,
  plugins: string,
  emoticonsRoot: string,
  style: string
}
type sceditorInstance = {
  val: (val?: string) => string|void
}

declare interface SCEditor {
  instance: ((textarea: HTMLTextAreaElement) => sceditorInstance),
  create: (textarea: HTMLTextAreaElement, opts: sceditorOptions) => void
}

declare var sceditor: SCEditor;

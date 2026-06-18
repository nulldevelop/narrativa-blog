'use client'

import 'suneditor/src/assets/suneditor.css'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export interface SunEditorRef {
  insertImage: (url: string) => void
  getContent: () => string
}

interface Props {
  content: string
  onChange: (value: string) => void
  articleId?: string
  onImageUploaded?: (url: string) => void
}

interface EditorHtml {
  get(): string
  insert(html: string): void
}

interface EditorImagePlugin {
  submitURL?(url: string): void
}

interface EditorFrameContext {
  get(key: string): { innerHTML?: string } | null | undefined
}

interface EditorCore {
  $: {
    html: EditorHtml
    focusManager: { focus(): void }
    plugins?: Record<string, EditorImagePlugin | undefined>
    frameContext?: EditorFrameContext
  }
  destroy(): void
}

interface ImageInfo {
  src?: string
}

interface EditorOptions {
  plugins: Record<string, unknown>
  value: string
  minHeight: string
  defaultStyle: string
  toolbar_sticky: number
  buttonList: string[][]
  image: {
    uploadUrl: string
    uploadHeaders?: Record<string, string>
    canResize: boolean
    createFileInput: boolean
    createUrlInput: boolean
    insertBehavior?: 'auto' | 'select' | 'line' | 'none'
  }
  onChange(payload: { data: string }): void
  onImageLoad(payload: { infoList: ImageInfo[] }): void
}

interface SunEditorCreator {
  create(element: HTMLTextAreaElement, options: EditorOptions): EditorCore
}

type SunEditorModule = { default?: SunEditorCreator } & SunEditorCreator
type PluginsModule = { default?: Record<string, unknown> } & Record<string, unknown>

export const MyEditor = forwardRef<SunEditorRef, Props>(
  ({ content, onChange, articleId, onImageUploaded }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const instanceRef = useRef<EditorCore | null>(null)
    const onChangeRef = useRef(onChange)
    const contentRef = useRef(content)
    const articleIdRef = useRef(articleId)
    const onImageUploadedRef = useRef(onImageUploaded)

    useEffect(() => {
      onChangeRef.current = onChange
    }, [onChange])
    useEffect(() => {
      contentRef.current = content
    }, [content])
    useEffect(() => {
      articleIdRef.current = articleId
    }, [articleId])
    useEffect(() => {
      onImageUploadedRef.current = onImageUploaded
    }, [onImageUploaded])

    const readContent = (): string => {
      const editor = instanceRef.current
      if (!editor) return ''
      try {
        const html = editor.$.html.get()
        if (typeof html === 'string') return html
      } catch {
      }
      return editor.$.frameContext?.get('wysiwyg')?.innerHTML ?? ''
    }

    useImperativeHandle(ref, () => ({
      insertImage: (url: string) => {
        const editor = instanceRef.current
        if (!editor) return
        editor.$.focusManager.focus()
        const imagePlugin = editor.$.plugins?.image
        try {
          if (typeof imagePlugin?.submitURL === 'function') {
            imagePlugin.submitURL(url)
          } else {
            editor.$.html.insert(`<figure><img src="${url}" alt=""></figure>`)
          }
        } catch {
          editor.$.html.insert(`<figure><img src="${url}" alt=""></figure>`)
        }
      },
      getContent: () => readContent(),
    }))

    useEffect(() => {
      if (!textareaRef.current) return
      let destroyed = false

      ;(async () => {
        const seModule = (await import('suneditor')) as unknown as SunEditorModule
        const suneditor: SunEditorCreator = seModule.default ?? seModule

        const pluginsModule = (await import('suneditor/plugins')) as unknown as PluginsModule
        const pl: Record<string, unknown> = pluginsModule.default ?? pluginsModule

        const {
          align,
          font,
          fontColor,
          backgroundColor,
          hr,
          list,
          table,
          blockStyle,
          lineHeight,
          paragraphStyle,
          textStyle,
          blockquote,
          link,
          image,
          video,
          fontSize,
        } = pl

        if (destroyed || !textareaRef.current) return

        const instance = suneditor.create(textareaRef.current, {
          plugins: {
            align,
            font,
            fontSize,
            fontColor,
            backgroundColor,
            hr,
            list,
            table,
            blockStyle,
            lineHeight,
            paragraphStyle,
            textStyle,
            blockquote,
            link,
            image,
            video,
          },
          value: contentRef.current,
          minHeight: '500px',
          defaultStyle: 'font-family: Arial; font-size: 16px;',
          toolbar_sticky: 90,
          buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'blockStyle'],
            ['paragraphStyle', 'blockquote'],
            [
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
            ],
            ['fontColor', 'backgroundColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'hr', 'list', 'lineHeight'],
            ['table', 'link', 'image', 'video'],
            ['fullScreen', 'showBlocks', 'codeView'],
            ['preview', 'print'],
          ],
          image: {
            uploadUrl: '/api/upload/article',
            uploadHeaders: articleIdRef.current
              ? { 'x-article-id': articleIdRef.current }
              : undefined,
            canResize: true,
            createFileInput: true,
            createUrlInput: true,
            insertBehavior: 'line',
          },
          onChange({ data }: { data: string }) {
            onChangeRef.current(data ?? '')
          },
          onImageLoad({ infoList }: { infoList: ImageInfo[] }) {
            infoList.forEach((info) => {
              if (info.src) onImageUploadedRef.current?.(info.src)
            })
          },
        })

        instanceRef.current = instance
      })()

      return () => {
        destroyed = true
        instanceRef.current?.destroy()
        instanceRef.current = null
      }
    }, [])

    return (
      <div className="sun-editor-container">
        <textarea ref={textareaRef} />
        <style jsx global>{`
          .sun-editor-container .sun-editor {
            border-color: #e2e8f0;
            border-radius: 0.375rem;
          }
          .sun-editor-container .sun-editor .se-toolbar {
            outline: none;
            background-color: #fff;
            border-top-left-radius: 0.375rem;
            border-top-right-radius: 0.375rem;
            border-bottom: 1px solid #e2e8f0;
          }
          .sun-editor-container .sun-editor .se-resizing-bar {
            display: none;
          }
          .sun-editor-container .sun-editor .se-wrapper .se-wrapper-inner {
            min-height: 500px;
            padding: 16px 20px;
            font-size: 16px;
            line-height: 1.85;
            color: #3a3a3a;
          }
          .sun-editor-container .sun-editor .se-wrapper-inner p {
            margin-bottom: 1em;
          }
          .sun-editor-container .sun-editor .se-wrapper-wysiwyg img {
            max-width: 100%;
            height: auto;
          }
          /* suneditor v3: figure::after tem position:absolute top/right/bottom/left:0
             sem position:relative no figure o overlay escapa para .se-wrapper-wysiwyg
             e cobre o editor inteiro — qualquer clique resolve para a figure */
          .sun-editor-container .sun-editor-editable figure {
            position: relative;
          }
          .sun-editor-container .sun-editor .se-image-container.__se__float-left,
          .sun-editor-container .sun-editor .se-image-container.__se__float-right {
            max-width: 50%;
          }
          .sun-editor-container .sun-editor .se-sticky-toolbar {
            top: 90px !important;
          }
          /* Blockquote igual ao artigo publicado (prose-narrativa) */
          .sun-editor-container .sun-editor-editable blockquote {
            font-style: italic;
            font-weight: 400;
            font-size: 1.4rem;
            line-height: 1.55;
            border-left: 4px solid #b11226 !important;
            border-right-width: 0 !important;
            padding: 1.5rem 2.25rem 0.75rem !important;
            margin: 2.5rem 0;
            color: #1a1a1a;
            background-color: #f9f8f6;
          }
          .sun-editor-container .sun-editor-editable blockquote > * {
            margin: 0;
          }
          .sun-editor-container .sun-editor-editable blockquote > * + * {
            margin-top: 0.75rem;
          }
          .sun-editor-container .sun-editor-editable blockquote p:first-of-type::before {
            content: '“';
            color: #b11226;
            font-weight: 700;
            margin-right: 0.08em;
          }
          .sun-editor-container .sun-editor-editable blockquote p:last-of-type::after {
            content: '”';
            color: #b11226;
            font-weight: 700;
            margin-left: 0.08em;
          }
          .sun-editor-container .sun-editor-editable blockquote cite {
            display: block;
            margin-top: 1rem;
            font-style: normal;
            font-weight: 700;
            font-size: 0.72rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #b11226;
          }
          .sun-editor-container .sun-editor-editable blockquote cite::before {
            content: '';
          }
        `}</style>
      </div>
    )
  },
)

MyEditor.displayName = 'MyEditor'

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

export const MyEditor = forwardRef<SunEditorRef, Props>(
  ({ content, onChange, articleId, onImageUploaded }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const instanceRef = useRef<any>(null)
    const onChangeRef = useRef(onChange)
    const articleIdRef = useRef(articleId)
    const onImageUploadedRef = useRef(onImageUploaded)

    useEffect(() => { onChangeRef.current = onChange }, [onChange])
    useEffect(() => { articleIdRef.current = articleId }, [articleId])
    useEffect(() => { onImageUploadedRef.current = onImageUploaded }, [onImageUploaded])

    // Helper compartilhado: usa html.get() (HTML de saída v3) com fallback para innerHTML.
    const readContent = (): string => {
      const editor = instanceRef.current
      if (!editor) return ''
      try {
        const html = editor.$.html.get()
        if (typeof html === 'string') return html
      } catch {
        // cai no fallback abaixo
      }
      return editor.$.frameContext?.get('wysiwyg')?.innerHTML ?? ''
    }

    useImperativeHandle(ref, () => ({
      insertImage: (url: string) => {
        const editor = instanceRef.current
        if (!editor) return

        // Restaura o foco/seleção do editor (o clique no botão da sidebar tira o foco)
        editor.$.focusManager.focus()

        // Usa a API oficial do plugin de imagem (cria a estrutura de figure correta
        // e dispara o onChange interno). Fallback: insere o HTML diretamente.
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
      // Lê o HTML de SAÍDA do editor (processado), não o innerHTML bruto de edição.
      // É o que deve ser salvo/renderizado na matéria.
      getContent: () => readContent(),
    }))

    useEffect(() => {
      if (!textareaRef.current) return
      let destroyed = false

      ;(async () => {
        const seModule = await import('suneditor')
        const suneditor = (seModule.default ?? seModule) as any
        const pluginsModule = await import('suneditor/plugins')
        const pl = (pluginsModule.default ?? pluginsModule) as any
        const { align, font, fontColor, backgroundColor, hr, list, table, blockStyle, lineHeight, paragraphStyle, textStyle, blockquote, link, image, video, fontSize } = pl
        if (destroyed || !textareaRef.current) return

        const instance = suneditor.create(textareaRef.current, {
          plugins: { align, font, fontSize, fontColor, backgroundColor, hr, list, table, blockStyle, lineHeight, paragraphStyle, textStyle, blockquote, link, image, video },
          value: content,
          minHeight: '500px',
          defaultStyle: 'font-family: Arial; font-size: 16px;',
          toolbar_sticky: 90,
          buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'blockStyle'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
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
            uploadHeaders: articleId ? { 'x-article-id': articleId } : undefined,
            canResize: true,
            createFileInput: true,
            createUrlInput: true,
          },
          // v3: onChange recebe { $, frameContext, data } onde data é o HTML.
          // Dispara após inserir imagem (via history) — mantém o estado atualizado.
          onChange({ data }: { data: string }) {
            onChangeRef.current(data ?? '')
          },
          // Apenas notifica a sidebar das imagens carregadas. NÃO chamamos html.get()
          // aqui: isso roda no meio da inserção e trava a interação do editor.
          onImageLoad({ infoList }: { infoList: any[] }) {
            infoList.forEach((info) => {
              if (info.src) onImageUploadedRef.current?.(info.src)
            })
          },
        } as any)

        instanceRef.current = instance
      })()

      return () => {
        destroyed = true
        instanceRef.current?.destroy()
        instanceRef.current = null
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          /* Padding interno da área de texto — v3 removeu o default */
          .sun-editor-container .sun-editor .se-wrapper .se-wrapper-inner {
            min-height: 500px;
            padding: 16px 20px;
            font-size: 16px;
            line-height: 1.85;
            color: #3a3a3a;
          }
          /* Garante que parágrafos tenham espaçamento */
          .sun-editor-container .sun-editor .se-wrapper-inner p {
            margin-bottom: 1em;
          }
          /* Barra de ferramentas sticky correta */
          .sun-editor-container .sun-editor .se-sticky-toolbar {
            top: 90px !important;
          }
        `}</style>
      </div>
    )
  },
)

MyEditor.displayName = 'MyEditor'
